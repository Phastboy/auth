/**
 * User Schema
 * @type {Object} User
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

// Define the UserDocument interface
export type UserDocument = HydratedDocument<User>;

// Define the User class
@Schema({ timestamps: true })
export class User{
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