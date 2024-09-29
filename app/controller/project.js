'use strict';

const Controller = require('egg').Controller;
const mongo = require('../utils/mongo');

class ProjectController extends Controller {
  // 获取项目/组件的代码模板
  async getTemplate() {
    const { ctx } = this;
    const data = await mongo().query('projects');
    ctx.body = data;
  }

  async getRedis() {
    const { ctx, app } = this;
    const { key } = ctx.query;
    if (key) {
      const value = await app.redis.get(key);
      ctx.body = `redis[${key}]:${value}`;
    } else {
      ctx.body = '请提供参数key';
    }
  }

  async test() {
    const { ctx, app } = this;
    const list = await app.mysql.select('component');
    ctx.body = JSON.stringify(list);
  }
}

module.exports = ProjectController;
