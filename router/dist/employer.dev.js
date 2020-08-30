"use strict";

var router = require('koa-router')();

var employer = require('../controller/employer');

router.get('/employer/list', employer.getList);
router.post('/employer/update', employer.update);
module.exports = router;