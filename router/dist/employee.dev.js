"use strict";

var router = require('koa-router')();

var employee = require('../controller/employee');

router.get('/api/employee/current', employee.getCurrent);
router.post('/api/employee/change', employee.setCurrent);
module.exports = router;