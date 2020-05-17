import {
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Card } from './Card';
import { Attachment } from './Attachment';

@Table({
  tableName: 'cardAttachment',
})
export class CardAttachment extends Model<CardAttachment> {
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

  @ForeignKey(() => Card)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  boardListCardId: number;

  @ForeignKey(() => Attachment)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  attachmentId: number;

  @Default(0)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isCover: boolean;

  // 根据信息从 Attachment 中查询信息
  @BelongsTo(() => Attachment)
  detail: Attachment;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
