import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SmsSend, smsSendSchema } from "./model/sms.send.schema";
import { SmsSendService } from "./sms.send.service";
import { smsSendController } from "./sms.send.controller";


@Module({
    imports: [
        MongooseModule.forFeature([{name:SmsSend.name,schema:smsSendSchema}])
    ],
    providers: [SmsSendService],
    controllers:[smsSendController]
})





export class smsSendModule{}