const { exec } = require('../db/mysql');
var tip = require('../utils/tip');

const getCurrent = async (ctx) => {
    var name = ctx.session.username;
    const sql = `select * from ren where username = '${name}';`;
    var result = await exec(sql);
    ctx.response.body = {
        data: result[0],
        errno: 0,
        errmsg: ''
    };
}
const setCurrent = async (ctx) => {
    var name = ctx.session.username;
    var { current } = ctx.request.body;
    const sql = `
        update ren set
            current = '${current}'
        where
            username = '${name}';
    `;
    await exec(sql);
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}


module.exports = {
    getCurrent,
    setCurrent
};