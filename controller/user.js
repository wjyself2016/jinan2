const { exec } = require('../db/mysql');
var tip = require('../utils/tip');

const login = async (ctx) => {
    const { username, password } = ctx.request.body;
    const sql = `select * from ren where username = '${username}';`;
    var result = await exec(sql);
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
    
}
const logout = async (ctx) => {
    ctx.session = null;
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}
const who = async (ctx) => {
    var name = ctx.session.username;
    const sql = `select * from ren where username = '${name}';`;
    var result = await exec(sql);
    ctx.response.body = {
        data: result,
        errno: 0,
        errmsg: ''
    };
}

module.exports = {
    login,
    logout,
    who
};