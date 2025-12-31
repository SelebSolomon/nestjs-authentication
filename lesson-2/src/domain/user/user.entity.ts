import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, select: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 500 })
  public password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public last_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public family_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public first_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public name: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  public refresh_token: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public picture_url: string;

  @Column({ type: 'varchar', nullable: true })
  public permissions: string;

  @Column({ type: 'jsonb', default: null })
  public passwordReset: any;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  public update_at: Date;
}
