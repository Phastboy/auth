/**
 * User Schema
 * @type {Object} User
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the User class
@Schema({ timestamps: true })
export class User extends Document{
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    password: string;

    @Prop({ required: true, unique: true })
    salt: string;

    @Prop({  })
    role: string;
}

// Create a the UserSchema based on the User class
export const UserSchema = SchemaFactory.createForClass(User);