import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmsSend } from './model/sms.send.schema';
import * as axios from 'axios';
import * as csv from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';
import { smsSendDto } from './dto/sms.send.dto';
import { Client, ApiController, ApiResponse, BandwidthMessage } from '@bandwidth/messaging';
import { Response, response } from 'express';

@Injectable()
export class SmsSendService {
  constructor(
    @InjectModel(SmsSend.name) private readonly smsSendModel: Model<SmsSend>,
  ) {}

  async processCSVData(results: any[]): Promise<any> {
    const newResults = results.map(result => ({
      ...result,
      id: uuidv4(),
    }));

    const groups = [];
    const groupSize = 1000;

    for (let i = 0; i < newResults.length; i += groupSize) {
      const groupArr = newResults.slice(i, i + groupSize);
      groups.push({ users: groupArr });
    }

    await this.smsSendModel.deleteMany({});
    const userMessage = await this.smsSendModel.insertMany(groups);
    return userMessage;
  }

  async fetchDataAndProcess(url: string): Promise<any> {
    try {
      const response = await axios.default.get(url);

      if (!response.data) {
        throw new Error('Empty response data');
      }

      const results = [];
      const dataString = response.data.toString('utf-8');
      const parser = csv({ headers: true });

      return new Promise((resolve, reject) => {
        parser
          .on('data', data => {
            results.push(data);
          })
          .on('end', async () => {
            if (results.length === 0) {
              return reject(new Error('Empty file'));
            }

            await this.smsSendModel.init().then(() => {
              console.log('Indexes created successfully');
            }).catch(err => {
              console.error('Error creating indexes:', err);
            });

            const userMessage = await this.processCSVData(results);
            resolve(userMessage);
          })
          .on('error', error => {
            reject(error);
          });

        parser.write(dataString);
        parser.end();
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching and processing data: ${error.message}`);
    }
  }

  
  async getGroups(page: number, limit: number) {
    // Validate input
    if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be greater than 0');
    }

    // Fetch data with pagination
    const existingData = await this.smsSendModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    // Check if no data is found
    if (existingData.length === 0) {
        return [];
    }

    return existingData;
  }
  
 
  async sendsms(data: smsSendDto, message: string): Promise<any> {
    try {
      
    
    const recipients = [];
    data.users.forEach((item) => {
      if (item._2 !== "Phone") {
        let cleanedNumber = item._2.replace(/[-() \s]/g, '');
        if (!cleanedNumber.startsWith('+1')) {
          cleanedNumber = '+1' + cleanedNumber;
        }
        recipients.push(cleanedNumber);
      }
    });

    const BW_USERNAME = "arslandeveloper";
    const BW_PASSWORD = "776x5QcTqyrZB5g";
    const BW_ACCOUNT_ID = "5010362";
    const BW_MESSAGING_APPLICATION_ID = "4ebcf6fe-d2bc-47c3-a082-e3d34fa557cf";
    const BW_NUMBER = "+923271064839";
    const USER_NUMBER = recipients;

    const client = new Client({
      basicAuthUserName: BW_USERNAME,
      basicAuthPassword: BW_PASSWORD,
    });

    const controller = new ApiController(client);

    const accountId = BW_ACCOUNT_ID;

    const sendMessage = async function () {
      try {
        const response = await controller.createMessage(accountId, {
          applicationId: BW_MESSAGING_APPLICATION_ID,
          to: USER_NUMBER,
          from: BW_NUMBER,
          text: message,
        });
        return {
          result: response,
        };
      } catch (error) {
        return {
          statusCode: error.response?.statusCode || 500,
          message: error.response?.data?.message || 'Failed to send message',
        };
      }
    };

      return await sendMessage();
    } catch (error) {
      return {error}
    }
  }
}
