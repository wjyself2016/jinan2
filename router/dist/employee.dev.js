"use strict";

var router = require('koa-router')();

var employee = require('../controller/employee');

router.get('/employee/current', employee.getCurrent);
router.post('/employee/change', employee.setCurrent);
module.exports = router;