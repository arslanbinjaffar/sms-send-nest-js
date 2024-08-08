import { string } from "@bandwidth/messaging/dist/schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
    timestamps:true
})

export class SmsSend extends Document{
    @Prop({
        type:Array,
        required: true,
    })
    users:[]
    @Prop({
        type: Boolean,
        required: true,
        default:true
    })
    isActive: boolean
    
}


export const smsSendSchema = SchemaFactory.createForClass(SmsSend);