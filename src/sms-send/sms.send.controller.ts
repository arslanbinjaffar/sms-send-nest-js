import { Body, Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { SmsSendService } from "./sms.send.service";
import { Response } from "express";
import { smsSendDto } from "./dto/sms.send.dto";
import { ApiResponse, BandwidthMessage } from "@bandwidth/messaging";

@Controller('/api/v1/sms')

export class smsSendController {
    constructor(private readonly smsSendService: SmsSendService) { }
    @Get()
    async getsmssend() {
        return 'hello sms'
    }
    @Post('process')
    async fetchDataAndProcess(@Res() response, @Body('url') url: string) {
        try {
            const data = await this.smsSendService.fetchDataAndProcess(url);
            return response.status(200).json({
                data,
                message: "file process completed"
            });
        }
        catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'An error occurred while login',
            });
        }
    }

    @Get('group')
    async getGroup(@Res() response, @Query('page') page: number, @Query('limit') limit: number) {
        try {
            // Call the service method with pagination parameters
            const existingData = await this.smsSendService.getGroups(page, limit);
            return response.status(HttpStatus.OK).json({
                message: "Successfully sent message",
                data: existingData,
            });
        } catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'An error occurred while retrieving groups',
            });
        }
    }
    
    @Post("send")
    async sendMessage(@Res() response, @Body() body: { data: smsSendDto, message: string }) {
        try {
            const existingData = await this.smsSendService.sendsms(body.data);
            return response.status(existingData.statusCode || HttpStatus.OK).json({
                message: "Successfully sent message",
                data: existingData.result,
            });
        } catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'An error occurred while sending the message',
            });
        }
    }
}

