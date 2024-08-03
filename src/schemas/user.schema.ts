/**
 * User Schema
 * @type {Object} User
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../types';

// Define the UserDocument interface
export type UserDocument = HydratedDocument<User>;

// Define the User class
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ required: true, unique: true })
  salt: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: string;
}

// Create a the UserSchema based on the User class
export const UserSchema = SchemaFactory.createForClass(User);
