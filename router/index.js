const user = require('./user');
const employee = require('./employee');
const employer = require('./employer');

module.exports = (app) => {
    // 用户
    app.use(user.routes()).use(user.allowedMethods());
    app.use(employee.routes()).use(employee.allowedMethods());
    app.use(employer.routes()).use(employer.allowedMethods());
}