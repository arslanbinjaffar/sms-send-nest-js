import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
    timestamps:true
})

export class inBoundMessgeWebhook extends Document{
    @Prop({
        type: String,
        default:""
    })
    inboundBody: string
    @Prop({
        type: String,
        default:""
    })
    inBoundStatus:string
}


export const inBoundMessgeWebhookSchema = SchemaFactory.createForClass(inBoundMessgeWebhook);