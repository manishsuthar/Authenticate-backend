import { Entity, ObjectIdColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Contact {
  @ObjectIdColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  isSpam?:boolean;

  @Column("string", { array: true })
  user: string[];
}
