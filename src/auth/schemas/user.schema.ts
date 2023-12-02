import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: [true, 'Duplicate username entered'] })
  username: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
