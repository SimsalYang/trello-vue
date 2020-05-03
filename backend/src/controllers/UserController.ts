import { Controller, Post, Body, Ctx } from 'koa-ts-controllers';
import { Context } from 'koa';
import { RegisterBody, LoginBody } from '../validators/User';
// 引入模型
import { User as UserModel } from '../models/User';
// 引入错误处理库
import Boom from '@hapi/Boom';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import configs from '../configs/index';

@Controller('/user')
export class UserController {
  /**
   * 用户注册
   */
  @Post('/register')
  async register(@Ctx() ctx: Context, @Body() body: RegisterBody) {
    let { name, password } = body;
    // 验证数据库中是否已经存在要注册的用户
    let user = await UserModel.findOne({
      where: {
        name,
      },
    });
    // 如果用户名存在，则抛出错误
    if (user) {
      throw Boom.conflict('注册失败', '用户名已经被注册了');
    }
    // 用户名不存在，实例化模型实例
    // 进行写入数据库表操作
    let newUser = new UserModel();
    newUser.name = name;
    newUser.password = password;
    // 同步到数据库
    await newUser.save();
    // 操作成功，更改状态码
    ctx.status = 201;
    return {
      id: newUser.id,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };
  }

  /**
   * 登录
   */
  @Post('/login')
  async login(@Ctx() ctx: Context, @Body() body: LoginBody) {
    let { name, password } = body;
    let user = await UserModel.findOne({
      where: {
        name,
      },
    });

    if (!user) {
      throw Boom.notFound('登录失败', '用户不存在');
    }

    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    if (password !== user.password) {
      throw Boom.forbidden('登录失败', '密码错误');
    }

    // jwt 鉴权
    // 验证成功后，把用户信息加密，再通过 Header 的方式带给前端
    let userInfo = {
      id: user.id,
      name: user.name,
    };

    // key 值存在 configs/index.ts 配置文件中
    let token = jwt.sign(userInfo, configs.jwt.privateKey);
    ctx.set('authorization', token);

    return userInfo;
  }
}
