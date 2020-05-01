import { Length, IsNotEmpty } from 'class-validator';

import { IsSameValue } from './CustomValidationDecorators';

export class RegisterBody {
  @Length(1, 50, {
    message: '用户名不能为空或者大于 50 个字符',
  })
  name: string;
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  // 需要和 password 比较，必须用于相同的值
  // class-validator 没有提供类似的功能，需要自己实现
  @IsSameValue('password', {
    message: '两次输入密码不一致',
  })
  rePassword: string;
}
