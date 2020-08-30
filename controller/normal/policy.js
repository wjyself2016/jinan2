const { exec } = require('../../db/mysql');
var tip = require('../../utils/tip');

const checkIndexList = async (ctx) => {
    const sql = `
        select 
            id,
            name,
            p_time,
            e_time,
            msg
        from policy_message
        order by create_at desc 
        limit 0,5;
    `;
    var result = await exec(sql);
    ctx.response.body = {
        data: result,
        errno: 0,
        errmsg: ''
    };
}
const checkList = async (ctx) => {
    const { page_size=10, page_num=1, type='法律法规规章' } = ctx.request.query;
    var start = page_size * (page_num - 1);
    var end = start + page_size;
    const sql = `
        select 
            id,
            name,
            p_time,
            e_time
        from policy_message
        where type='${type}'
        order by create_at desc 
        limit ${start},${end};
    `;
    const sql2 = `select count(*) from policy_message where type='${type}';`;
    var result = await exec(sql);
    var total = await exec(sql2);
    total = total[0]['count(*)'];
    ctx.response.body = {
        data: {
            list: result,
            total: total
        },
        errno: 0,
        errmsg: ''
    };
}
const searchList = async (ctx) => {
    const { page_size=10, page_num=1, keyword } = ctx.request.query;
    var start = page_size * (page_num - 1);
    var end = start + page_size;
    const sql = `
        select 
            id,
            name,
            p_time,
            e_time
        from policy_message
        where name like '%${keyword}%'
        order by create_at desc 
        limit ${start},${end};
    `;
    const sql2 = `select count(*) from policy_message where name like '%${keyword}%';`;
    var result = await exec(sql);
    var total = await exec(sql2);
    total = total[0]['count(*)'];
    ctx.response.body = {
        data: {
            list: result,
            total: total
        },
        errno: 0,
        errmsg: ''
    };
}
const checkDetail = async (ctx) => {
    const { id } = ctx.request.query;
    const sql = `
        select * from policy_message where id=${id};
    `;
    var result = await exec(sql);
    if (result.length) {
        ctx.response.body = {
            data: result[0],
            errno: 0,
            errmsg: ''
        };
    } else {
        ctx.response.body = tip[1006];
    }
}

module.exports = {
    checkIndexList,
    checkList,
    searchList,
    checkDetail
};