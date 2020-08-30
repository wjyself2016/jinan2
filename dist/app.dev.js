"use strict";

var Koa = require('koa');

var app = new Koa();

var koaBody = require('koa-body');

var session = require('koa-session');

var router = require('./router');

var serve = require("koa-static"); // const cors = require('koa2-cors');


var _require = require('./db/mysql'),
    exec = _require.exec;

var tip = require('./utils/tip');

app.keys = ['jinan'];
app.use(serve(__dirname + "/static")); // 解析文件

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 400 * 1024 * 1024 // 设置上传文件大小最大限制，默认4M

  }
})); // 跨域设置
// app.use(
//     cors({
//         origin: function (ctx) {
//             return ctx.header.origin; // 如果允许种cookie，此处域名必须等于访问域名
//         },
//         maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//         credentials: true, //是否允许种Cookie
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X_Requested_With'], //设置服务器支持的所有头信息字段
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//     })
// );
// 错误信息

app.use(function _callee(ctx, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(next());

        case 3:
          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          ctx.response.status = _context.t0.statusCode || _context.t0.status || 500;
          ctx.response.body = {
            message: _context.t0.message
          };

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
}); // 登录状态校验

app.use(function _callee2(ctx, next) {
  var url, name, sql, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = ctx.url;

          if (!(url.indexOf('login') > -1)) {
            _context2.next = 6;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(next());

        case 4:
          _context2.next = 17;
          break;

        case 6:
          name = ctx.session.username;
          sql = "select * from ren where username like '".concat(name, "';");
          _context2.next = 10;
          return regeneratorRuntime.awrap(exec(sql));

        case 10:
          result = _context2.sent;

          if (!result.length) {
            _context2.next = 16;
            break;
          }

          _context2.next = 14;
          return regeneratorRuntime.awrap(next());

        case 14:
          _context2.next = 17;
          break;

        case 16:
          ctx.response.body = tip[1003];

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // 设置cookie

app.use(session({
  key: 'koa:sess',

  /**  cookie的key。 (默认是 koa:sess) */
  maxAge: 86400000,

  /**  session 过期时间，以毫秒ms为单位计算 。*/
  autoCommit: true,

  /** 自动提交到响应头。(默认是 true) */
  overwrite: true,

  /** 是否允许重写 。(默认是 true) */
  httpOnly: true,

  /** 是否设置HttpOnly。(默认 true) */
  signed: true,

  /** 是否签名。(默认是 true) */
  rolling: false,

  /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  renew: false
  /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */

}, app));
router(app);
app.listen(80);