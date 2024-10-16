'use strict';

const fs = require('fs');
const path = require('path');
const userHome = require('user-home');

/** MONGODB **/
const mongodbUrl = 'mongodb://localhost:27017/cli-pf';
const mongodbDbName = 'cli-pf';

/** OSS **/
const OSS_ACCESS_KEY = 'LTAI5tDjtuvr3gUXj9yJgaos';
const OSS_ACCESS_SECRET_KEY = fs
  .readFileSync(path.resolve(userHome, '.pf-scaffold', 'oss_access_secret_key'))
  .toString();
const OSS_PROD_BUCKET = 'pf-scaffold-sync';
const OSS_DEV_BUCKET = 'pf-scaffold-sync-dev';
const OSS_COMPONENT_BUCKET = 'pf-component';
const OSS_REGION = 'oss-cn-guangzhou';

/** MYSQL **/
const MYSQL_HOST = '127.0.0.1';
const MYSQL_PORT = 3306;
const MYSQL_USER = 'root';
const MYSQL_PWD = fs
  .readFileSync(path.resolve(userHome, '.pf-scaffold', 'mysql_password'))
  .toString()
  .trim();
const MYSQL_DB = 'pf-scaffold';

module.exports = {
  mongodbUrl,
  mongodbDbName,
  OSS_ACCESS_KEY,
  OSS_ACCESS_SECRET_KEY,
  OSS_PROD_BUCKET,
  OSS_DEV_BUCKET,
  OSS_COMPONENT_BUCKET,
  OSS_REGION,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
};
