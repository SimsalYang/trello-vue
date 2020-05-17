import {
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { User } from './User';
import { BoardList } from './BoardList';
import { CardAttachment } from './CardAttachment';
import { Comment } from './Comment';

@Table({
  tableName: 'boardListCard',
})
export class Card extends Model<Card> {
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

  @ForeignKey(() => BoardList)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  boardListId: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(2000),
  })
  description?: string;

  @Column({
    type: DataType.FLOAT,
  })
  order: number;

  // 一对多查询
  @HasMany(() => CardAttachment)
  attachments: CardAttachment[];

  @HasMany(() => Comment)
  comments: Comment[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
