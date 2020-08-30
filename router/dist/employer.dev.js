"use strict";

var router = require('koa-router')();

var employer = require('../controller/employer');

router.get('/api/employer/list', employer.getList);
router.post('/api/employer/update', employer.update);
module.exports = router;