"use strict";

var _require = require('../db/mysql'),
    exec = _require.exec;

var tip = require('../utils/tip');

var login = function login(ctx) {
  var _ctx$request$body, username, password, sql, result;

  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ctx$request$body = ctx.request.body, username = _ctx$request$body.username, password = _ctx$request$body.password;
          sql = "select * from ren where username = '".concat(username, "';");
          _context.next = 4;
          return regeneratorRuntime.awrap(exec(sql));

        case 4:
          result = _context.sent;

          if (result.length) {
            if (result[0].password === password) {
              ctx.session.username = username;
              ctx.response.body = {
                data: null,
                errno: 0,
                errmsg: ''
              };
            } else {
              ctx.response.body = tip[1004];
            }
          } else {
            ctx.response.body = tip[1005];
          }

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var logout = function logout(ctx) {
  return regeneratorRuntime.async(function logout$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          ctx.session = null;
          ctx.response.body = {
            data: null,
            errno: 0,
            errmsg: ''
          };

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var who = function who(ctx) {
  var name, sql, result;
  return regeneratorRuntime.async(function who$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          name = ctx.session.username;
          sql = "select * from ren where username = '".concat(name, "';");
          _context3.next = 4;
          return regeneratorRuntime.awrap(exec(sql));

        case 4:
          result = _context3.sent;
          ctx.response.body = {
            data: result,
            errno: 0,
            errmsg: ''
          };

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  login: login,
  logout: logout,
  who: who
};