// 导入配置文件
import configs from './configs';
// 导入 koa，并且安装 @types/koa 类型库
import Koa, { Context } from 'koa';
// 导入 koa-ts-controllers 的 bootstrapControllers 方法
import { bootstrapControllers } from 'koa-ts-controllers';
// 导入 koa-router
import KoaRouter from 'koa-router';
// 引入 path
import path from 'path';
// 引入 路由解析库
import KoaBodyParser from 'koa-bodyparser';

(async () => {
  // 实例化 koa
  const app = new Koa();

  // 实例化 koa-router
  const router = new KoaRouter();

  // 注册路由
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
      console.log(err);
      // 服务其本身错误
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

  // 使用路由解析库
  app.use(KoaBodyParser());
  app.use(router.routes());

  app.listen(configs.server.port, configs.server.port, () => {
    console.log(
      `服务启动成功：http://${configs.server.host}:${configs.server.port}`
    );
  });
})();