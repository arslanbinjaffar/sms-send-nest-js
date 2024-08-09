import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SmsSend, smsSendSchema } from "./model/sms.send.schema";
import { SmsSendService } from "./sms.send.service";
import { smsSendController } from "./sms.send.controller";
import { MessageReceived,MessageReceivedSchema,MessageStatusSchema,MessageStatus } from "./model/inbound.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: SmsSend.name, schema: smsSendSchema
        }, { name: MessageReceived.name, schema: MessageReceivedSchema },
        {name:MessageStatus.name,schema:MessageStatusSchema}
        ])
    ],
    providers: [SmsSendService],
    controllers:[smsSendController]
})





export class smsSendModule{}