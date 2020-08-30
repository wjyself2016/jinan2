"use strict";

var user = require('./user');

var employee = require('./employee');

var employer = require('./employer');

module.exports = function (app) {
  // 用户
  app.use(user.routes()).use(user.allowedMethods());
  app.use(employee.routes()).use(employee.allowedMethods());
  app.use(employer.routes()).use(employer.allowedMethods());
};