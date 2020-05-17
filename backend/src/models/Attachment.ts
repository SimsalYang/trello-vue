import {
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Default,
  CreatedAt,
  UpdatedAt,
  Table,
} from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'attachment',
})
export class Attachment extends Model<Attachment> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @Default('')
  @Column({
    type: DataType.STRING(255),
  })
  originName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  type: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  size: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
