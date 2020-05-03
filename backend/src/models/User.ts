// User 模型类
import {
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  AllowNull,
  Unique,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
// 引入加密库
const crypto = require('crypto');

// 映射数据库表
@Table({
  tableName: 'user',
})
export class User extends Model<User> {
  // 定义字段
  @PrimaryKey
  @AutoIncrement
  @Column // 列信息一定要写在所有装饰器的最后
  id: number;
  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(50),
  })
  name: string;

  // 密码需要将明文加密成密文
  // 使用 set，也可以使用 get 做一些其他的操作
  @Column
  set password(val: string) {
    let md5 = crypto.createHash('md5');
    let newPassword = md5.update(val).digest('hex');
    // 将加密后的密码映射到数据库表的对应字段
    this.setDataValue('password', newPassword);
  }
  @CreatedAt
  createdAt: Date;
  @UpdatedAt
  updatedAt: Date;
}
