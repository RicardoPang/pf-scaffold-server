'use strict';

module.exports = (app) => {
  class User extends app.Service {
    async say() {
      return 'hello Man!';
    }
  }
  return User;
};
