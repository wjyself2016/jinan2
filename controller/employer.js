const { exec } = require('../db/mysql');
var tip = require('../utils/tip');

const getList = async (ctx) => {
    var name = ctx.session.username;
    const sql = `select * from ren where username = '${name}';`;
    var result = await exec(sql);
    var itemid = result[0].itemid;
    const sql2 = `select * from ren where belong = '${itemid}'`;
    var result2 = await exec(sql2);
    ctx.response.body = {
        data: result2,
        errno: 0,
        errmsg: ''
    };
}
const update = async (ctx) => {
    var { itemid, queue } = ctx.request.body;
    const sql = `
        update ren set 
            queue = '${queue}'
        where 
            itemid = '${itemid}';
    `;
    await exec(sql);
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}

module.exports = {
    getList,
    update
};