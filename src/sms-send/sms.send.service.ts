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
import * as base64 from 'base-64';
import { inBoundMessgeWebhook } from './model/inbound.sms.webhook';
@Injectable()
export class SmsSendService {
  constructor(
    @InjectModel(SmsSend.name) private readonly smsSendModel: Model<SmsSend>,
    @InjectModel(inBoundMessgeWebhook.name) private readonly inBoundMessgeWebhookModel: Model<inBoundMessgeWebhook>,

  ) {}
  private BW_USERNAME = "arslandeveloper";
  private BW_PASSWORD = "776x5QcTqyrZB5g";
  private BW_ACCOUNT_ID = "5010362";
  private BW_MESSAGING_APPLICATION_ID = "4ebcf6fe-d2bc-47c3-a082-e3d34fa557cf";
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
  
 
  async sendsms(data: smsSendDto, message: string,senderNum:string): Promise<any> {
    try {
    const recipients = [];
    data.users.slice(0,10).forEach((item) => {
      if (item._2 !== "Phone") {
        let cleanedNumber = item._2.replace(/[-() \s]/g, '');
        if (!cleanedNumber.startsWith('+1')) {
          cleanedNumber = '+1' + cleanedNumber;
        }
        recipients.push(cleanedNumber);
      }
    });

  
    const BW_NUMBER = senderNum;
      const USER_NUMBER = recipients;
    // const USER_NUMBER = ["+13236042424"];
      

    const client = new Client({
      basicAuthUserName: this.BW_USERNAME,
      basicAuthPassword: this.BW_PASSWORD,
    });

    const controller = new ApiController(client);

    const accountId = this.BW_ACCOUNT_ID;
    const applicationId=this.BW_MESSAGING_APPLICATION_ID
    const sendMessage = async function () {
      try {
        const response = await controller.createMessage(accountId, {
          applicationId,
          to: USER_NUMBER,
          from: BW_NUMBER,
          text: message,

        });
        return {
          result: response,
        };
      } catch (error) {
        console.log(error,"error message")
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
  async createMessagingApplication() {
    const inboundCallbackUrl = `https://izhmw2qjmx.us-east-2.awsapprunner.com/api/v1/sms/inbound-message`;
    const outboundCallbackUrl = `https://izhmw2qjmx.us-east-2.awsapprunner.com/api/v1/sms/outbound-status`;

    const auth ="12858273ac31b3ff0adf744323fdfdf3488e0777131fd7f4";
    const url = `https://dashboard.bandwidth.com/api/accounts/${this.BW_ACCOUNT_ID}/applications`;

    const requestData = {
      Application: {
        ServiceType: 'Messaging-V2',
        AppName: 'My Messaging App',
        InboundCallbackUrl: inboundCallbackUrl,
        OutboundCallbackUrl: outboundCallbackUrl,
        InboundCallbackCreds: {
          UserId: this.BW_USERNAME,
          Password: this.BW_PASSWORD
        },
        OutboundCallbackCreds: {
          UserId: this.BW_USERNAME,
          Password: this.BW_PASSWORD
        },
        RequestedCallbackTypes: {
          CallbackType: [
            'message-delivered',
            'message-failed',
            'message-sending'
          ]
        }
      }
    };

    try {
      const response = await axios.default.post(url, requestData, {
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': `Basic ${auth}`
        }
      });
      console.log('Application created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

    async handleInboundMessage(body: any) {
      return await this.inBoundMessgeWebhookModel.create({
        inboundBody: JSON.stringify(body)
      });
   
    }
  
    
   async handleOutboundStatus(body:any,status:any) {
     return await this.inBoundMessgeWebhookModel.create({
          inBoundStatus:body
     })
      // Process the outbound status update event
      
    }
}

