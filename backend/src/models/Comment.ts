import {
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  Table,
} from 'sequelize-typescript';
import { User } from './User';
import { Card } from './Card';

@Table({
  tableName: 'comment',
})
export class Comment extends Model<Comment> {
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

  // 一对一关系
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Card)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  boardListCardId: number;

  @Column({
    type: DataType.STRING(2000),
  })
  content?: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
