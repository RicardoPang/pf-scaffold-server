'use strict';

const { createCloudBuildTask } = require('../../models/CloudBuildTask');

const REDIS_PREFIX = 'cloudbuild';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const { id } = socket;
    const { redis } = app;
    const query = socket.handshake.query;
    try {
      socket.emit(
        id,
        helper.parseMsg('connect', {
          type: 'connect',
          message: '云构建服务连接成功',
        })
      );
      // 生成redis key 将云构建任务写入redis
      let hasTask = await redis.get(`${REDIS_PREFIX}:${id}`);
      if (!hasTask) {
        await redis.set(`${REDIS_PREFIX}:${id}`, JSON.stringify(query));
      }
      hasTask = await redis.get(`${REDIS_PREFIX}:${id}`);
      logger.info('query', hasTask);
      await next();
      // 清除缓存文件
      const cloudBuildTask = await createCloudBuildTask(ctx, app);
      await cloudBuildTask.clean();
      console.log('disconnect');
    } catch (err) {
      logger.error('build error', err.message);
      // 清除缓存文件
      const cloudBuildTask = await createCloudBuildTask(ctx, app);
      await cloudBuildTask.clean();
    }
  };
};
