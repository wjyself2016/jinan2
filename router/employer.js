const router = require('koa-router')();
const employer = require('../controller/employer');

router.get('/api/employer/list', employer.getList);
router.post('/api/employer/update', employer.update);

module.exports = router;