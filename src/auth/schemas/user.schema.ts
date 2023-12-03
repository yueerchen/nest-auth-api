import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: [true, 'Duplicate username entered'] })
  username: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  isLocked?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
