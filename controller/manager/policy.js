const { exec } = require('../../db/mysql');
var tip = require('../../utils/tip');
var date = require('silly-datetime');
const uploadExcelSrv = require('../../utils/uploadExcelSrv');

const add = async (ctx) => {
    const { 
        name, 
        p_time, 
        e_time, 
        country, 
        region, 
        organization, 
        business, 
        policy, 
        msg,
        type
    } = ctx.request.body;
    const sql = `
        insert into policy_message(
            name,
            p_time,
            e_time,
            country,
            region,
            organization,
            business,
            policy,
            create_at,
            update_at,
            creater,
            msg,
            type
        ) 
        values(
            '${name}',
            '${p_time}',
            '${e_time}',
            '${country}',
            '${region}',
            '${organization}',
            '${business}',
            '${policy}',
            '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
            '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
            '${ctx.session.username}',
            '${msg}',
            '${type}'
        );
    `;
    // console.log(sql);
    await exec(sql);
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}
const batchAdd = async (ctx) => {
    const getRes = await uploadExcelSrv.getExcelObjs(ctx);
    if (getRes.status) {
        if (getRes.datas.length > 1) {
            ctx.body = tip[1008];
        } else { //得到的是数组
            const objs = getRes.datas[0];
            var currentTime = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
            var creater = ctx.session.username;
            var sql = `
                insert into policy_message(
                    name,
                    p_time,
                    e_time,
                    country,
                    region,
                    organization,
                    business,
                    policy,
                    create_at,
                    update_at,
                    creater,
                    msg,
                    type
                )
                values 
            `;
            var str = [];
            objs.forEach(item => {
                str.push(`(
                    '${item['政策名称']}',
                    '${date.format(new Date(1900, 0, item['发布时间'] - 1), 'YYYY-MM-DD')}',
                    '${date.format(new Date(1900, 0, item['生效时间'] - 1), 'YYYY-MM-DD')}',
                    '${item['国别']}',
                    '${item['地区']}',
                    '${item['发布机构']}',
                    '${item['行业']}',
                    '${item['政策类型']}',
                    '${currentTime}',
                    '${currentTime}',
                    '${creater}',
                    '${item['正文']}',
                    '${item['政策分类'] || ""}'
                )`)
            });
            sql += str.join(',') + ';';
            await exec(sql);
            ctx.response.body = {
                data: objs,
                errno: 0,
                errmsg: ''
            };
        }
    } else {
        ctx.response.body = tip[1007];
    }
}
const update = async (ctx) => {
    const { 
        id, 
        name, 
        p_time, 
        e_time, 
        country, 
        region, 
        organization, 
        business, 
        policy, 
        msg,
        type
    } = ctx.request.body;
    const sql = `
        update policy_message set 
            name = '${name}',
            p_time = '${p_time}',
            e_time = '${e_time}',
            country = '${country}',
            region = '${region}',
            organization = '${organization}',
            business = '${business}',
            policy = '${policy}',
            update_at = '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
            msg = '${msg}',
            type='${type}'
        where
            id = '${id}';
    `; 
    await exec(sql);
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}
const deleteItem = async (ctx) => {
    const { id } = ctx.request.body;
    const sql = `
        delete from policy_message
        where id = '${id}';
    `; 
    await exec(sql);
    ctx.response.body = {
        data: null,
        errno: 0,
        errmsg: ''
    };
}
const checkList = async (ctx) => {
    const { page_size=10, page_num=1 } = ctx.request.query;
    var start = page_size * (page_num - 1);
    var end = start + page_size;
    const sql = `
        select 
            id,
            name,
            p_time,
            e_time,
            country,
            region,
            create_at,
            organization 
        from policy_message
        order by create_at desc 
        limit ${start},${end};
    `;
    const sql2 = `select count(*) from policy_message;`;
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
    // console.log(id);
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
    add,
    batchAdd,
    update,
    deleteItem,
    checkList,
    checkDetail
};