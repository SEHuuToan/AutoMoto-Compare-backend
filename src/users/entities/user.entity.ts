import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../roles/role.enum';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Date, default: Date.now })
  time: Date;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: String, enum: Role, default: Role.users })
  role: Role;

  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
