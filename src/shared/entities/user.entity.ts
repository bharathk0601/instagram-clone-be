import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @Column({ name: 'id' })
  id: number;

  @Column({ name: 'user_name' })
  userName: string;
}
