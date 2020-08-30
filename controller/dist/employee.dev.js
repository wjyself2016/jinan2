"use strict";

var _require = require('../db/mysql'),
    exec = _require.exec;

var tip = require('../utils/tip');

var getCurrent = function getCurrent(ctx) {
  var name, sql, result;
  return regeneratorRuntime.async(function getCurrent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = ctx.session.username;
          sql = "select * from ren where username = '".concat(name, "';");
          _context.next = 4;
          return regeneratorRuntime.awrap(exec(sql));

        case 4:
          result = _context.sent;
          ctx.response.body = {
            data: result[0],
            errno: 0,
            errmsg: ''
          };

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var setCurrent = function setCurrent(ctx) {
  var name, current, sql;
  return regeneratorRuntime.async(function setCurrent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          name = ctx.session.username;
          current = ctx.request.body.current;
          sql = "\n        update ren set\n            current = '".concat(current, "'\n        where\n            username = '").concat(name, "';\n    ");
          _context2.next = 5;
          return regeneratorRuntime.awrap(exec(sql));

        case 5:
          ctx.response.body = {
            data: null,
            errno: 0,
            errmsg: ''
          };

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  getCurrent: getCurrent,
  setCurrent: setCurrent
};