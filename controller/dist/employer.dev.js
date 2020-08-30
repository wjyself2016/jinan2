"use strict";

var _require = require('../db/mysql'),
    exec = _require.exec;

var tip = require('../utils/tip');

var getList = function getList(ctx) {
  var name, sql, result, itemid, sql2, result2;
  return regeneratorRuntime.async(function getList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = ctx.session.username;
          sql = "select * from ren where username = '".concat(name, "';");
          _context.next = 4;
          return regeneratorRuntime.awrap(exec(sql));

        case 4:
          result = _context.sent;
          itemid = result[0].itemid;
          sql2 = "select * from ren where belong = '".concat(itemid, "'");
          _context.next = 9;
          return regeneratorRuntime.awrap(exec(sql2));

        case 9:
          result2 = _context.sent;
          ctx.response.body = {
            data: result2,
            errno: 0,
            errmsg: ''
          };

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

var update = function update(ctx) {
  var _ctx$request$body, itemid, queue, sql;

  return regeneratorRuntime.async(function update$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _ctx$request$body = ctx.request.body, itemid = _ctx$request$body.itemid, queue = _ctx$request$body.queue;
          sql = "\n        update ren set \n            queue = '".concat(queue, "'\n        where \n            itemid = '").concat(itemid, "';\n    ");
          _context2.next = 4;
          return regeneratorRuntime.awrap(exec(sql));

        case 4:
          ctx.response.body = {
            data: null,
            errno: 0,
            errmsg: ''
          };

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  getList: getList,
  update: update
};