import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { SmsSendService } from './sms.send.service';
import { Response } from 'express';
import { smsSendDto } from './dto/sms.send.dto';
import { MessageStatusDTO, MessageReceivedDTO } from './dto/inbound.dto';

@Controller('/api/v1/sms')
export class smsSendController {
  constructor(private readonly smsSendService: SmsSendService) {}
  @Get()
  async getsmssend() {
    return 'hello sms';
  }
  @Post('process')
  async fetchDataAndProcess(@Res() response, @Body('url') url: string) {
    try {
      const data = await this.smsSendService.fetchDataAndProcess(url);
      return response.status(200).json({
        data,
        message: 'file process completed',
      });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'An error occurred while login',
        });
    }
  }

  @Get('group')
  async getGroup(
    @Res() response,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      // Call the service method with pagination parameters
      const existingData = await this.smsSendService.getGroups(page, limit);
      return response.status(HttpStatus.OK).json({
        message: 'Successfully sent message',
        data: existingData,
      });
    } catch (error) {
      return response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error.message || 'An error occurred while retrieving groups',
        });
    }
  }

  @Post('send')
  async sendMessage(
    @Res() response,
    @Body() body: { data: smsSendDto; message: string; senderNum: string },
  ) {
    const { result } = await this.smsSendService.sendsms(
      body.data,
      body.message,
      body.senderNum,
    );
    if (result.statusCode == 400 ) {
      return response.status( result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred while sending the message' || result.message,
      });
    }
    else {
      return response.status(result.statusCode ||  HttpStatus.OK ).json({
        message: result.message,
        result,
      });
    }
  }
  @Post('inbound-message')
  async handleInboundMessage(
    @Body() body: MessageReceivedDTO[] | any,
    @Res() res: Response,
  ) {
    console.log(body, 'body');
    const bodyData = await this.smsSendService.handleInboundMessage(body);
    res.send(bodyData);
  }

  @Post('outbound-status')
  async handleOutboundStatus(
    @Body() body: MessageStatusDTO[] | any,
    @Res() res: Response,
  ) {
    try {
      const bodyData = await this.smsSendService.handleOutboundStatus(body);
      return res.status(200).json({
        message: 'new webhook message status',
        bodyData,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  
}
