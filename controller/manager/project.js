const { exec } = require('../../db/mysql');
var tip = require('../../utils/tip');
var date = require('silly-datetime');
const uploadExcelSrv = require('../../utils/uploadExcelSrv');

const add = async (ctx) => {
    const { 
        name,                   // 项目名称
        ratification_code,      // 批准号
        ratification_year,      // 批准年度
        pro_type,               // 项目类别
        principal,              // 项目负责人
        organization,           // 依托单位
        expenditure,            // 资助经费
        keyword,                // 关键词
        fund,                   // 基金类型
        subject,                // 学科分类
        msg                     // 摘要
    } = ctx.request.body;
    const sql = `
        insert into project_message(
            name,
            ratification_code,
            ratification_year,
            pro_type,
            principal,
            organization,
            expenditure,
            keyword,
            fund,
            subject,
            msg,
            create_at,
            update_at,
            creater
        ) 
        values(
            '${name}',
            '${ratification_code}',
            '${ratification_year}',
            '${pro_type}',
            '${principal}',
            '${organization}',
            '${expenditure}',
            '${keyword}',
            '${fund}',
            '${subject}',
            '${msg}',
            '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
            '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
            '${ctx.session.username}'
        );
    `;
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
                insert into project_message(
                    name,
                    ratification_code,
                    ratification_year,
                    pro_type,
                    principal,
                    organization,
                    expenditure,
                    keyword,
                    fund,
                    subject,
                    msg,
                    create_at,
                    update_at,
                    creater
                )
                values 
            `;
            var str = [];
            objs.forEach(item => {
                str.push(`(
                    '${item['项目名称']}',
                    '${item['批准号']}',
                    '${item['批准年度']}',
                    '${item['项目类别']}',
                    '${item['项目负责人']}',
                    '${item['依托单位']}',
                    '${item['资助经费']}',
                    '${item['关键词']}',
                    '${item['基金类型'] || ''}',
                    '${item['学科分类']}',
                    '${item['摘要']}',
                    '${currentTime}',
                    '${currentTime}',
                    '${creater}'
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
        name,                   // 项目名称
        ratification_code,      // 批准号
        ratification_year,      // 批准年度
        pro_type,               // 项目类别
        principal,              // 项目负责人
        organization,           // 依托单位
        expenditure,            // 资助经费
        keyword,                // 关键词
        fund,                   // 基金类型
        subject,                // 学科分类
        msg                     // 摘要
    } = ctx.request.body;
    const sql = `
        update project_message set 
            name = '${name}',
            ratification_code = '${ratification_code}',
            ratification_year = '${ratification_year}',
            pro_type = '${pro_type}',
            principal = '${principal}',
            organization = '${organization}',
            expenditure = '${expenditure}',
            keyword = '${keyword}',
            fund = '${fund}',
            subject = '${subject}',
            msg = '${msg}',
            update_at = '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}'
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
        delete from project_message
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
            ratification_code,
            ratification_year,
            pro_type,
            principal,
            create_at,
            organization,
            expenditure,
            fund,
            keyword
        from project_message
        order by create_at desc 
        limit ${start},${end};
    `;
    const sql2 = `select count(*) from project_message;`;
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
        select * from project_message where id=${id};
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