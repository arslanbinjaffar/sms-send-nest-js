import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
  timestamps: true,
})
export class User extends Document {
    @Prop({
        type: String,
        required: true,
        unique: true
    }) 
    email: string
    @Prop({
        type: String,
        required:true
    })
    password: string


    @Prop({
        type: String,
        enum:["admin","user"],
        required: true,
        default:"admin"
    })
    roles:string
}

export const userSchema = SchemaFactory.createForClass(User);