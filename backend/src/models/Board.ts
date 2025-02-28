import {
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  AllowNull,
  Unique,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'board',
})
export class Board extends Model<Board> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
