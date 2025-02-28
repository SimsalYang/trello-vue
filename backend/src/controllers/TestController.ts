// 引入 Controller 装饰器
import {
  Controller,
  Get,
  Params,
  Query,
  Post,
  Body,
  Header,
  Ctx,
  Flow,
} from 'koa-ts-controllers';
import { IsNumberString } from 'class-validator';
import { Context } from 'koa';
import Boom from '@hapi/boom';
import authorization from '../middlewares/authorization';

class GetUsersQuery {
  @IsNumberString({
    message: 'page 必须是数字',
  })
  page: number;
}

// 访问时需要加上 basePath 和 version：/api/v1/test/hello
@Controller('/test')
class TestController {
  @Get('/hello')
  async hello() {
    // // 主动制造错误
    // console.log(a, b);
    return 'Hello Test';
  }

  // Params 第一种使用方法 \\d+ 进行类型验证
  @Get('/user/:id(\\d+)')
  async getUser(@Params() p: { id: number }) {
    return '当前 params 的中用户 id 是： ' + p.id;
  }

  // Params 第二种使用方法，当 params 只有一个时
  @Get('/username/:name')
  async getUsername(@Params('name') name: string) {
    return '当前 params 中的用户名是：' + name;
  }

  // Query 使用方法，通过 ?id=1 方式访问
  // Query 验证，通过 class-validator 验证
  @Get('/user')
  async getUser2(@Query() q: GetUsersQuery) {
    // 业务逻辑错误：
    // 用户不存在，用户名被注册等等
    // 使用 @hapi/boom，得到统一的错误 api
    // if (true) {
    //   // 用户已被注册
    //   throw Boom.notFound('注册失败', '用户已经被注册');
    // }
    return '当前 query 中的用户 page 是： ' + q.page;
  }

  // Body 使用方法
  // Header 使用方法
  @Post('/user')
  async postUser(
    @Body() body: { name: string; password: string },
    @Header() h: any
  ) {
    console.log(body);
    console.log('header', h);
    return `当前提交的数据是： ${JSON.stringify(body)}`;
  }

  /**
   * 登录鉴权
   */
  @Get('/auth')
  // 调用权限验证中间件装饰器
  @Flow([authorization])
  async auth(@Ctx() ctx: Context) {
    // 必须要登录
    return '你已经登录';
  }
  @Get('/noauth')
  async noauth() {
    // 不用登录
  }
}
