import { Column, Entity, DeepPartial, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_token' })
export class UserToken {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'verification_code' })
  verificationCode: string;

  @Column({ name: 'verification_code_created_at' })
  verificationCodeCreatedAt: Date;

  @Column({ name: 'password_reset_token' })
  passwordResetToken: string;

  @Column({ name: 'password_reset_token_created_at' })
  passwordResetTokenCreatedAt: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}

export type TUserToken = DeepPartial<UserToken>;
