'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const { decode } = require('js-base64');
const constant = require('../../const');
const { success, failed } = require('../../utils/request');
const { formatName } = require('../../utils');
const ComponentService = require('../../service/ComponentService');
const VersionService = require('../../service/VersionService');
const ComponentTask = require('../../models/ComponentTask');

class ComponentsController extends Controller {
  async index() {
    const { ctx, app } = this;
    const { name } = ctx.query;
    ctx.body = 'get all components';
  }

  async show() {
    const { ctx, app } = this;
    const id = ctx.params.id;
    ctx.body = 'get single component';
  }

  async create() {
    const { ctx, app } = this;
    const { component, git } = ctx.request.body;
    const timestamp = new Date().getTime();
    // 1. 添加组件信息
    const componentData = {
      name: component.name,
      classname: component.className,
      description: component.description,
      npm_name: component.npmName,
      npm_version: component.npmVersion,
      git_type: git.type,
      git_remote: git.remote,
      git_owner: git.owner,
      git_login: git.login,
      status: constant.STATUS.ON,
      create_dt: timestamp,
      create_by: git.login,
      update_dt: timestamp,
      update_by: git.login,
    };
    const componentService = new ComponentService(app);
    const haveComponentInDB = await componentService.queryOne({
      classname: componentData.classname,
    });
    let componentId;
    if (!haveComponentInDB) {
      componentId = await componentService.insert(componentData);
    } else {
      componentId = haveComponentInDB.id;
    }
    if (!componentId) {
      ctx.body = failed('添加组件失败');
      return;
    }
    // 2. 添加组件的版本信息
    const versionData = {
      component_id: componentId,
      version: git.version,
      build_path: component.buildPath,
      example_path: component.examplePath,
      example_list: JSON.stringify(component.exampleList),
      status: constant.STATUS.ON,
      create_dt: timestamp,
      create_by: git.login,
      update_dt: timestamp,
      update_by: git.login,
    };
    const versionService = new VersionService(app);
    const haveVersionInDB = await versionService.queryOne({
      component_id: componentId,
      version: versionData.version,
    });
    if (!haveVersionInDB) {
      const versionRes = await versionService.insert(versionData);
      if (!versionRes) {
        ctx.body = failed('添加组件失败');
        return;
      }
    } else {
      const updateData = {
        build_path: component.buildPath,
        example_path: component.examplePath,
        example_list: JSON.stringify(component.exampleList),
        update_dt: timestamp,
        update_by: git.login,
      };
      const versionRes = await versionService.update(updateData, {
        component_id: componentId,
        version: versionData.version,
      });
      if (!versionRes) {
        ctx.body = failed('更新组件失败');
        return;
      }
    }
    // 3. 向OSS中上传组件预览文件
    const task = new ComponentTask(
      {
        repo: git.remote,
        version: git.version,
        name: component.className,
        branch: git.branch,
        buildPath: component.buildPath,
        examplePath: component.examplePath,
      },
      {
        ctx,
      }
    );
    try {
      // 3.1 下载源码
      await task.downloadSourceCode();
      // 3.2 上传组件构建结果
      await task.publishBuild();
      // 3. 上传组件多预览文件
      await task.publishExample();
      ctx.body = success('添加组件成功', {
        component: await componentService.queryOne({ id: componentId }),
        version: await versionService.queryOne({
          component_id: componentId,
          version: versionData.version,
        }),
      });
    } catch (e) {
      ctx.logger.error(e);
      ctx.body = failed('添加组件失败, 失败原因: ' + e.message);
    }
  }
}

module.exports = ComponentsController;
