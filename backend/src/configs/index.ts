const configs = {
  development: {
    server: {
      host: 'localhost',
      port: 8080,
    },
  },
  test: {
    server: {
      host: 'localhost',
      port: 8080,
    },
  },
  production: {
    server: {
      host: 'localhost',
      port: 8080,
    },
  },
};

// 确定 NODE_ENV 的类型，
// 确保只在 configs 声明的类型中
// typeof 取得 configs 中的类型
// 再用 keyof 取得类型中的 key
type configKyes = keyof typeof configs;

// 环境变量
// 需要安装 @types/node 类型声明，
// 正式要上线的项目需要考虑库的版本
// 通过 as 约束 process.env.NODE_ENV 类型
const NODE_ENV = (process.env.NODE_ENV as configKyes) || 'development';

export default configs[NODE_ENV];
