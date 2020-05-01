import { Controller, Post, Body } from 'koa-ts-controllers';
import { RegisterBody } from '../validators/User';

@Controller('/user')
export class UserController {
  /**
   * 用户注册
   */
  @Post('/register')
  async register(@Body() body: RegisterBody) {}
}
