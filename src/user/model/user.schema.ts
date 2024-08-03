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
        enum:["super_admin","admin","user"],
        default:"user"
    })
    roles: string
    @Prop({type:Boolean,default:true})
    isActive:boolean
}

export const userSchema = SchemaFactory.createForClass(User);