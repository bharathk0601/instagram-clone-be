import { Column, Entity, DeepPartial, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'is_verified' })
  isVerified: boolean;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'deactivated_at' })
  deactivatedAt: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}

export type TUser = DeepPartial<User>;
