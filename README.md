# Vue-trello

用 koa 作为后端框架，vue 作为前端框架，开发 Trello 看板项目。

功能需求

- 什么是任务管理（GTD）
  - 功能相对复杂的 Todo list
- 用户系统
  - 登录注册
- 任务面板
  - 任务列表创建
  - 编辑
  - 删除
  - 创建卡片
- 卡片列表排序
- mysql 数据库

## 后端

### 开发前准备工作

#### 技术栈

- 开发类
  - koa
    - 后端主框架
  - koa-router
    - 基于 koa 的路由
  - koa-static-cache
    - koa 静态文件代理
  - koa-ts-controllers
    - 基于 koa 和 typescript 构建的路由控制系统，提供各种装饰器来构建 RESTful 风格 API
  - mysql2
    - NodeJS 连接操作 mysql 的库
  - sequelize
    - 提供功能强大的数据库操作，提供 ORM，事务，Promise 支持
  - sequelize-typescript
    - sequelize 的 typescript 版
  - class-validator
    - 基于 validator.js 和 ts 的数据验证工具，对用户或者接口调用传入数据进行校验
  - jsonwebtoken
    - JWT 鉴权库
  - moment
    - 日期时间处理工具
- 工具类（辅助开发）
  - ts-node-dev
    - 实现热重载
  - sequelize-cli
    - sequelize 提供的 cli 工具

#### 接口规范

接口规范遵循 RESTful 规范，合理利用 请求方法、状态码来设计 API

- 资源路径
  - 接口 /api
  - 静态资源 /pullic
  - 版本 /api/v1
- 其他规范
  - 获取
    - GET
    - 200
    - 被请求的资源内容
  - 创建
    - POST
    - 201
    - 被创建的资源内容
  - 更新
    - PUT
    - 204（成功，不携带主题内容）
    - 无
  - 删除
    - DELETE
    - 204
    - 无
- 错误处理
  - 应用中的错误会返回对应的状态码
  - 请求错误
    - 资源不存在：404
    - 请求参数异常：422
  - 授权验证错误
    - 没有授权/登录：401
    - 禁止访问：403

#### HTTP响应图示

### 后端-基础搭建

#### 1、初始化

根路径 /backend

```bash
npm init
```

初始化项目

在项目根目录创建 tsconfig.json 文件，配置 ts。

#### 2、配置文件 /src/configs

项目在开发、测试、线上环境配置不同，在配置时设置多个配置项

在 /src/configs 目录下创建 index.ts 文件，在文件内写入配置信息。

配置环境时，需要用到 `process.env.NODE_ENV`，编辑器会报错，需要安装 `@types/node` 类型声明库，安装在开发依赖即可。

> 对于要正式上线的项目，安装库时，特别要注意库的版本

#### 3、入口文件 /src/app.ts

- 引入配置文件
- 引入 koa，并安装 @types/koa 类型库

ts 开发时，安装 `ts-node-dev` 调试项目，并且安装 `typescript`，这两个库都安装在开发环境。安装完成后，修改 package.json 文件中的 script，添加 `"dev": "ts-node-dev ./src/app.ts"`。然后在命令行中输入 `npm run dev` 启动项目。

启动项目后，打开浏览器，输入 `localhost:8080`，此时会显示 Not Found。这是因为没有配置路由。

#### 4、koa-ts-controllers 应用

使用 ts 开发，采用 `koa-ts-controllers` 装饰器管理路由。

安装： `npm i koa-ts-controllers`，本身包含类型声明文件

安装完成后，在入口文件引入 `import { bootstrapControllers } from 'koa-ts-controllers'`

提供了路由注册，内部要借助 koa-router 做路由绑定，它只是用类的方式组织注册函数，通过装饰的方式把这些函数绑定到路由中。所以需要安装 `koa-router`，

`bootstrapControllers` 函数第一个参数是 koa 实例，第二个参数是配置选项。配置选项包括 `router`（路由，也就是 koa-router）， `basePath`（/api），`versions`（[1]），`controllers`(装饰器所在目录)等。

整个实例包含在一个立即执行的异步函数中。

#### 5、创建 controllers

在 src 目录下创建 controllers 目录用于存放所有的 controller，约定所有的 controller 文件名均以 Controller 结尾，例如 `TestController.ts`。

- Controller 装饰器
  - @Controller(basePath?)
  - 使用在类上，针对类的装饰器，被装饰的类就会成为一个控制器类，只有控制器类下的方法才能与路由进行绑定。
- HTTP 请求方法装饰器
  - @Get(path)
  - @Post(path)
  - @Patch(path)
  - @Put(path)
  - @Delete(path)

> 初次启动时，会报缺少 `class-validator` 的错误，需要安装，`npm i class-validator`

#### 6、请求与响应统一处理

##### 1、获取请求数据

数据传输方式：

- params
- queryString
- body
- headers

对应的装饰器

- @Params()
- @Query()
- @Body()
- @Header()

```ts

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
}

```

##### 2、响应处理

响应类型

- 成功响应
  - 200，201
- 错误响应
  - 服务器错误：500
  - 其他业务错误：4xx
  - 请求路由不存在：404

错误验证：

- params 和 query
  - 通过正则的形式验证
- body 和 header
  - 通过 `class-validator` 库进行统一处理

```ts
// 配置统一错误处理
    errorHandler: async (err: any, ctx: Context) => {
      console.log(err);
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
```

业务验证错误：

使用 `@hapi/Boom` 库处理

> bootstrapControllers 是异步函数，必须使用 await

### postman 使用

创建 collections 集合

postman 的 params 是 query

postman 内置数据生成器

1. 使用文件夹阻止请求

2. 添加断言测试脚本

postman 内置对象 pm 进行断言测试，降低测试人力成本。

```js
pm.test('描述', function() {
  // 断言
  pm.response.to.have.body('abc'); // 或其他断言
})
```

ajv - JSON Schema 断言

断言库：chaijs.com

自动测试：运行集合，自动测试集合中的所有测试

### 构建数据库

> sequelize 与 sequelize-cli

sequelize 是基于 node.js 的 ORM（Object Relational Mapping - 对象关系映射）库。

sequelize-cli 是一个独立工具，提供快速操作数据库的功能。比如创建数据库、创建表等。

#### 安装

`npm i -D  sequelize-cli` 和 `npm i sequelize`

操作数据库，需要下载对应库，mysql 下载 mysql2，`npm i mysql2`。

#### 配置

项目根目录建立 `.sequelizerc` 配置文件，填写配置内容。

```js
const path = require('path');

module.exports = {
  'env': 'development',
  'config': path.resolve('src', 'configs/database.json'),
  'migrations-path': path.resolve('src', 'database/migrations'),
  'seeders-path': path.resolve('src', 'database/seeders'),
  'models-path': path.resolve('src', 'database/models),
  'debug': true
};
```

#### 创建/销毁数据库

创建数据库：`db:create`，将此命令放在 package.json 中方便使用，在 package.json 中创建 scripts: `"db:create": "sequelize db:create"`。

删除数据库：`db:drop`，同样的方法创建 scripts: `"db:drop": "sequelize db:drop"`

#### 创建表

##### 1. 创建迁移脚本文件

`sequelize migration:create --name TableNameInit`

- queryInterface 对象，提供许多操作数据库结构的各种方法。

- Sequelize 核心类，提供一些数据库相关的常量信息。

- up 方法：注入 queryInterface 和 Sequelize；返回 Promise。

- down 方法：修改表的操作

##### 2. 执行迁移脚本

在 package.json 中创建脚本：`"db:migrate": "sequelize db:migrate"`

##### 3. 执行撤销操作

`"db:migrate:undo[:all]": "sequelize db:migrate:undo[:all]"`

##### 4. 更新迭代

添加新的迁移脚本

```shell
sequelize migration:crate --name TableNameAddUpdateAt
```

#### 种子

操作数据库中的数据

`"db:seed:all": "sequelize db:seed:all"`

`"db:seed:undo:all": "sequelize db:seed:undo:all"`

#### 联合操作

`"db:init": "npm run db:create && npm run db:migrate && npm run db:seed:all"`

`"db:redo": "npm run db:drop && npm run db:init"`

### 数据库连接

安装 `sequelize-typescript` 库，已包含类型声明文件。

```bash
npm i sequelize-typescript
```

将 `/src/configs/database.json` 的配置文件载入到 同目录下的 `index.ts` 配置文件中。

#### ORM

ORM 模型类似于前端常说的 DOM

类 <==> 数据库表
类的实例对象 <==> 数据库表中的其中一条数据

- 优点
  - 不用写 SQL 语句
  - 通过统一对象操作，底层再转化成对应的 SQL 语句，减少编码差异
- 缺点
  - 底层最终会转化成 SQL 语句，有时自动生成的 SQL 执行性能会受影响
  - 一些复杂的 SQL 通过 ORM 描述会比较繁琐，有时还是需要用到原生查询

使用时，sequelize 实例的配置需要增加 models 配置。

```ts
  // 连接数据库
  const db = new Sequelize({
    ...configs.database,
    models: [__dirname + '/models/**/*'],
  });
```

创建模型类：

```ts
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
  tableName: 'User',
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
```

### 登录与注册鉴权

在 src 下创建一个 validators 目录，在里面存放验证规则文件，做统一管理。

在 controllors 目录下创建 UserController.ts 类文件，做用户登录注册的路由。

使用 class-validator 验证装饰器做验证，使用 postman 测试。

#### 自定义验证装饰器

验证注册时重复输入密码验证，class-validator 本身不带有这样的验证方式，需要自定义实现。

```ts
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

/**
 * 验证是否与传入值相同
 * @param property 传入的参与验证的值
 * @param validationOptions 配置选项
 * return
 */
export function IsSameValue(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (
    // 装饰的目标
    target: Object,
    // 装饰的属性名称
    propertyName: string
  ) {
    registerDecorator({
      // 装饰器名称
      name: 'isSameValue',
      target: target.constructor,
      propertyName,
      // 验证传入的参数
      constraints: [property],
      options: validationOptions,
      // 验证器，具体要实现的验证方法
      validator: {
        validate(
          value: any,
          validationArguments?: ValidationArguments
        ): Promise<boolean> | boolean {
          // 第一个参数指定的属性对应的值
          // 因为 validationArguments 是一个可选值
          // 可能为 undefined
          // 所以在用的时候需要对其进行判断
          const relatedValue =
            validationArguments &&
            (validationArguments.object as any)[property];
          // value: 当前装饰器属性对应的值
          return relatedValue === value;
        },
      },
    });
  };
}
```

#### 注册逻辑

ORM 模型，类代表数据表，对象代表数据。

如果对表进行操作，就调用类的静态方法。

如果要操作数据，就调用类的实例的方法。

> 数据模型中如果是需要手动添加的字段，一定要包含 `@Column` 列装饰器。

写完逻辑后，通过 postman 进行验证。

```javascript
// 使用 ajv 进行更复杂的验证
const Ajv = require('ajv');
const ajv = new Ajv({logger: console});
// 定义数据验证条件
const schema = {
    required: ['id', 'name', 'createdAt'],
    properties: {
        id: {
            type: 'number'
        },
        name: {
            type: 'string'
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        }
    }
}

pm.test('status:201', () => {
    pm.response.to.have.status(201);
});
// 调用验证
pm.test('schema', () => {
    // 使用 ajv.validate
    // 第一个参数就是验证条件
    // 第二个参数是要验证的数据
    // 它会返回一个布尔值
    // 再传递给 pm.expect
    pm.expect(ajv.validate(schema, pm.response.json())).to.be.true;
})
```

#### JWT 鉴权

安装 `jsonwebtoken` 鉴权库，同时安装类型声明库 `@types/jsonwebtoken`。

```typescript
    // jwt 鉴权
    // 验证成功后，把用户信息加密，再通过 Header 的方式带给前端
    let userInfo = {
      id: user.id,
      name: user.name,
    };

    // key 值存在 configs/index.ts 配置文件中
    let token = jwt.sign(userInfo, configs.jwt.privateKey);
    ctx.set('authorization', token);
```

以后在接口中需要用到用户信息，所以要把信息带过去。

鉴权时需要在 ctx 中找 token 信息，但由于 ctx 中本身没有 token 信息，所以需要对 ctx 进行扩展。

在 src 下新建 types/koa.ext.d.ts 文件对 koa 进行扩展。

权限验证通过中间件的方式验证，在 src 目录下新建 middlewares 目录，用于存放中间件。

在 controllers 中，使用 @Flow 装饰器进行验证。如果 controller 中所有的路由都需要权限验证，就把 @Flow 放在 controller 类的头部。

### 面板 api

完成后端的面板api接口 Model 逻辑、中间件逻辑，完成接口后，利用 postman 对接口进行测试。



## 前端

### 项目构建与模板解析

新建 frontend 目录，用于存放前端项目。

在 frontend 目录下执行 `vue create vue-app` 创建基于 vue 的前端项目。选择 `babel`，`Vuex`，`vue-router`，生成项目。

项目生成后，删除掉自动生成的一些不需要的配置。

### 路由、视图组件的构建

在 /src/router/index.js 中配置路由。

> 注意： 卡片的弹窗是通过路由的方式访问的，这样做的好处是可以直接将卡片分享出去，可以直接通过链接访问卡片内容，弹窗的方式则达不到这个需求。

针对卡片弹窗需要配置子路由。

```vue
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/board/:id(\\d+)',
    name: 'Board',
    component: Board,
    children: [
      {
        path: 'list/:listId(\\d+)/card/:cardId(\\d+)',
        name: 'Card',
        component: Card
      }
    ]
  }
]
```

配置完路由后，在 /src/views/ 目录下建立路由对应的视图。

在 main.js 文件中引入全局的样式。

### 注册和登录实现

给予用户提示时，需要有良好的用户体验，可以把提示信息单独封装成一个组件。

动态组件处理。

> 把动态组件改变成可以用 js 调用的形式。

#### 业务逻辑的处理

使用 axios 与后端进行 ajax 交互。安装 axios。

为了项目的统一管理，把和后端交互的文件，放在统一的目录 /src/api 下。

项目在不同的环境可能具有不同的 baseURL，通过 vue 提供的环境信息配置，在项目根目录建立 `.env.development`、`.env.production` 等环境配置信息。

```
// .env.development
VUE_APP_SERVER_API_PATH = /api
```

```javascript
// /src/api/index.js
axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH;
```

完成配置后，重启应用，使其生效。

在 /src/api/index.js 文件中封装接口，把所有和数据有关的操作都放在 vuex 的 store 中进行处理。

> 在应用中，并不是所有的数据都要用到 store

针对 ajax 错误进行统一处理。

在请求后端数据时，需要配置代理。在根目录建立 `vue.config.js` 文件配置代理。

登录操作要进行鉴权才能访问具体页面。

在路由中增加鉴权字段。

用 localStorage 做数据持久化，保存登录信息。

### 首页

#### 顶部

注意点：

- 弹窗位置计算
- 弹窗界面菜单动态加载

