// 引入 Controller 装饰器
import {
  Controller,
  Get,
  Params,
  Query,
  Post,
  Body,
  Header,
} from 'koa-ts-controllers';
import { IsNumberString } from 'class-validator';

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
}
