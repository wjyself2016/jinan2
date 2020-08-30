const router = require('koa-router')();
const employee = require('../controller/employee');

router.get('/api/employee/current', employee.getCurrent);
router.post('/api/employee/change', employee.setCurrent);

module.exports = router;