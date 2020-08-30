const router = require('koa-router')();
const user = require('../controller/user');
const { exec } = require('../db/mysql');

router.post('/api/login', user.login);
router.get('/api/logout', user.logout);
router.get('/api/who', user.who);

// other
router.get('/api/list', async (ctx) => {
    var arr = await exec('select * from ren');
    ctx.body = arr;
});
router.post('/api/update', async (ctx) => {
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
});
module.exports = router;