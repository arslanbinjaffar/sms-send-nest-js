import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmsSend } from './model/sms.send.schema';
import * as axios from 'axios';
import * as csv from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';

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
}
