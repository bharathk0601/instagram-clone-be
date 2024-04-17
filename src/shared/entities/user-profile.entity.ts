import { Column, Entity, DeepPartial, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_profile' })
export class UserProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name', unique: true })
  uaserName: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'profile_pic' })
  profilePic: string;

  @Column({ name: 'bio' })
  buio: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}

export type TUserProfile = DeepPartial<UserProfile>;
