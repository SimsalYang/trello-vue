# Vue-trello

## 后端

### 根路径 /backend

tsconfig.json

### 配置文件 /src/configs

项目在开发、测试、线上环境配置不同，在配置时设置多个配置项

### 入口文件 /src/app.ts

- 引入配置文件
- 引入 koa，并安装 @types/koa 类型库

ts 开发时，安装 ts-node-dev 调试项目，并且安装 typescript，这两个库都安装在开发环境。安装完成后，修改 package.json 文件中的 script，添加 `"dev": "ts-node-dev ./src/app.ts"`。然后在命令行中输入 `npm run dev` 启动项目。

启动项目后，打开浏览器，输入 `localhost:8080`，此时会显示 Not Found。这是因为没有配置路由。

使用 ts 开发，采用 koa-ts-controllers 装饰器管理路由。

#### 请求与响应处理

一、 数据请求

1. 获取请求数据

2. Params 装饰器

post 请求需要安装 koa-bodyparser 路由解析库

二、 数据响应

- 成功响应

返回状态码，200，201 等

- 错误响应

具体的错误类型返回错误状态码

  - 统一响应
  - 请求验证错误
    - params: 通过 path 规则验证
    - query:
    - 其他业务逻辑错误使用 @hapi/boom 处理（特点是能统一管理错误信息）

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

