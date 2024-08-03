import { Body, Controller, Get, HttpStatus, Post, Query, Res } from "@nestjs/common";
import { SmsSendService } from "./sms.send.service";


@Controller('/api/v1/sms')

export class smsSendController{
    constructor(private readonly smsSendService: SmsSendService) { }
    @Get()
    async getsmssend() {
        return 'hello sms'
     }   
    @Post('process')
    async fetchDataAndProcess(@Res() response,@Body('url') url: string) {
        try {
        const data=await this.smsSendService.fetchDataAndProcess(url);
        return response.status(200).json({
            data,
            message:"file process completed"
        }); 
        }
        catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'An error occurred while login',
            });
        }  
    }

    @Get('group')
    async getGroup(@Res() response,@Query() page: number, limit: number) {
        try {
            const existingData=await this.smsSendService.getGroups(page,limit)
            return response.status(200).json({
                message: "successfully get Groups",
                data: existingData
            })
            
        } catch (error) {
            return response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'An error occurred while login',
            });
        }
    }
}

