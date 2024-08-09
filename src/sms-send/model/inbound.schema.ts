import { string } from "@bandwidth/messaging/dist/schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String })
  time: string;

  @Prop({ type: String, required: true })
  direction: string;

  @Prop({ type: [String], required: true })
  to: string[];

  @Prop({ type: [String], required: true })
  from: string[];

  @Prop({ type: String })
  text: string;

  @Prop({ type: String, required: true })
  applicationId: string;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({ type: Number, required: true })
  segmentCount: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
@Schema({
  timestamps: true,
})
  

export class MessageStatus extends Document {
  @Prop({ type: String, required: true,enum:[
    "message-failed",
    "message-delivered",
    "message-sending"] })
  type: string;

  @Prop({ type: String })
  time: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  to: string;

  @Prop({ type: Number})
  errorCode: number;

  @Prop({ type: MessageSchema, required: true })
  message: Message;
}

export const MessageStatusSchema = SchemaFactory.createForClass(MessageStatus);


@Schema({
  timestamps: true,
})

export class MessageReceived extends Document{
  @Prop({ type: String,required:true })
  type: string;

  @Prop({ type: String,required:true })
  time: string;

  @Prop({ type: String,required:true })
  description: string;

  @Prop({ type: String,required:true })
  to: string;
  @Prop({ type: MessageSchema })
  message: Message;
}




export const MessageReceivedSchema = SchemaFactory.createForClass(MessageReceived);

