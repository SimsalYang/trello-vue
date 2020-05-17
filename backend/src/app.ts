// 导入配置文件
import configs from './configs';
// 导入 koa，并且安装 @types/koa 类型库
import Koa, { Context, Next } from 'koa';
// 导入 koa-ts-controllers 的 bootstrapControllers 方法
import { bootstrapControllers } from 'koa-ts-controllers';
// 导入 koa-router
import KoaRouter from 'koa-router';
// 引入 path
import path from 'path';
// 引入 路由解析库
import KoaBody from 'koa-body';

import Boom from '@hapi/boom';
// 导入连接数数据库的 ts 版 sequelize
import { Sequelize } from 'sequelize-typescript';
// 引入 jwt 鉴权库
import jwt from 'jsonwebtoken';
// 引入静态资源库
import KoaStaticCache from 'koa-static-cache';

(async () => {
  // 实例化 koa
  const app = new Koa();

  // 实例化 koa-router
  const router = new KoaRouter();

  // 静态资源代理
  app.use(
    KoaStaticCache({
      dir: configs.storage.dir,
      prefix: configs.storage.prefix,
      gzip: true,
      dynamic: true,
    })
  );

  // 连接数据库
  const db = new Sequelize({
    ...configs.database,
    models: [__dirname + '/models/**/*'],
  });

  // 对鉴权进行统一处理
  app.use(async (ctx: Context, next: Next) => {
    // 从 headers 中取出 token
    let token = ctx.headers['authorization'];
    // 如果 token 存在，进行解密
    if (token) {
      ctx.userInfo = jwt.verify(token, configs.jwt.privateKey) as UserInfo;
    }
    await next();
  });

  // 注册路由
  // 这里的 await 必须加，因为 bootstrapControllers 是异步的
  // 如果不加，因为异步处理，在这里没处理完之前，会先处理后面的逻辑
  // 就会发生错误
  await bootstrapControllers(app, {
    router,
    basePath: '/api',
    versions: [1],
    controllers: [
      // 匹配 controllers 文件夹中所有配置文件
      path.resolve(__dirname, 'controllers/**/*'),
    ],
    // 配置统一错误处理
    errorHandler: async (err: any, ctx: Context) => {
      // console.log(err);
      // 服务器本身错误
      let status = 500;
      let body: any = {
        statusCode: status,
        error: 'Internal Server error',
        message: 'An internal server error occurred',
      };
      // 如果 err 存在，则走 err 的错误信息
      if (err.output) {
        status = err.output.statusCode;
        body = { ...err.output.payload };
        if (err.data) {
          body.errorDetails = err.data;
        }
      }
      ctx.status = status;
      ctx.body = body;
    },
  });

  // 当所有路由都不存在时，处理错误
  router.all('*', async (ctx) => {
    throw Boom.notFound('Not Found', '路由不存在');
  });

  // 使用路由解析库
  app.use(
    KoaBody({
      multipart: true,
      formidable: {
        uploadDir: configs.storage.dir,
        keepExtensions: true,
      },
    })
  );
  // 注册路由
  app.use(router.routes());

  app.listen(configs.server.port, configs.server.host, () => {
    console.log(
      `服务启动成功：http://${configs.server.host}:${configs.server.port}`
    );
  });
})();
