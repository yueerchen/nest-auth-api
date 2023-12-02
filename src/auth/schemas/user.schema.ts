import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: [true, 'Duplicate username entered'] })
  username: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ type: [Number], default: [] })
  loginAttemptsTimestamp: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
