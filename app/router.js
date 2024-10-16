'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/project/template', controller.project.getTemplate);
  router.get('/project/oss', controller.project.getOSSProject);
  router.get('/page/template', controller.page.getTemplate);
  router.get('/section/template', controller.section.getTemplate);
  router.get('/oss/get', controller.project.getOSSFile);
  router.get('/redis/test', controller.project.getRedis);
  router.get('/test', controller.project.test);

  app.io.route('build', app.io.controller.build.index);

  // app.io.of('/')
  app.io.route('chat', app.io.controller.chat.index);
  // app.io.of('/chat')
  app.io.of('/chat').route('chat', app.io.controller.chat.index);

  router.resources(
    'components',
    '/api/v1/components',
    controller.v1.components
  );
  // router.resources(
  //   'componentSite',
  //   '/api/v1/componentSite',
  //   controller.v1.componentSite
  // );
};
