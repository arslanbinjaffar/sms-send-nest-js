import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SmsSend, smsSendSchema } from "./model/sms.send.schema";
import { SmsSendService } from "./sms.send.service";
import { smsSendController } from "./sms.send.controller";
import { inBoundMessgeWebhook, inBoundMessgeWebhookSchema } from "./model/inbound.sms.webhook";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: SmsSend.name, schema: smsSendSchema
        },{name:inBoundMessgeWebhook.name,schema:inBoundMessgeWebhookSchema}])
    ],
    providers: [SmsSendService],
    controllers:[smsSendController]
})





export class smsSendModule{}