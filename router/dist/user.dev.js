"use strict";

var router = require('koa-router')();

var user = require('../controller/user');

var _require = require('../db/mysql'),
    exec = _require.exec;

router.post('/api/login', user.login);
router.get('/api/logout', user.logout);
router.get('/api/who', user.who); // other

router.get('/api/list', function _callee(ctx) {
  var arr;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(exec('select * from ren'));

        case 2:
          arr = _context.sent;
          ctx.body = arr;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/api/update', function _callee2(ctx) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // let data = ctx.request.body;
          // let itemid = [];
          // data.forEach(item => {
          //     itemid.push(item.itemid);
          // });
          // itemid = itemid.join(',');
          // let sql = `
          //     update ren set role = 'a' where itemid in (${itemid});
          // `;
          // await exec(sql);
          // let sql = `
          //     update ren set 
          //         username = case itemid
          // `;
          // data.forEach(item => {
          //     itemid.push(item.itemid);
          //     sql += `
          //         when ${item.itemid} then '${item.username}'
          //     `;
          // });
          // itemid = itemid.join(',');
          // sql += `
          //     end,
          //     password = case itemid
          // `;
          // data.forEach(item => {
          //     sql += `
          //         when ${item.itemid} then '${item.password}'
          //     `;
          // });
          // sql += `
          //     end
          // `;
          // sql += `
          //     where itemid in (${itemid})
          // `;
          // await exec(sql);
          ctx.response.body = {
            data: null,
            errno: 0,
            errmsg: ''
          };

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;