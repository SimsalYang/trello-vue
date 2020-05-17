import databaseConfig from './database.json';
import path from 'path';

// 定义 databaseConfig 类型接口
interface IDatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';
  timezone: string;
}
const configs = {
  development: {
    server: {
      host: 'localhost',
      port: 8080,
    },
    database: databaseConfig.development as IDatabaseConfig,
    jwt: {
      privateKey: 'trellovue',
    },
    storage: {
      dir: path.resolve(__dirname, '../attachments'),
      prefix: '/public/attachments',
    },
  },
  test: {
    server: {
      host: 'localhost',
      port: 8080,
    },
    database: databaseConfig.test as IDatabaseConfig,
    jwt: {
      privateKey: 'trellovue',
    },
    storage: {
      dir: path.resolve(__dirname, '../attachments'),
      prefix: '/public/attachments',
    },
  },
  production: {
    server: {
      host: 'localhost',
      port: 8080,
    },
    database: databaseConfig.production as IDatabaseConfig,
    jwt: {
      privateKey: 'trellovue',
    },
    storage: {
      dir: path.resolve(__dirname, '../attachments'),
      prefix: '/public/attachments',
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
