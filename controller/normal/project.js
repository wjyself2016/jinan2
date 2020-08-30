const { exec } = require('../../db/mysql');
var tip = require('../../utils/tip');
var date = require('silly-datetime');

const checkList = async (ctx) => {
    const { 
        page_size=10, 
        page_num=1, 
        name,
        ratification_code,
        principal,
        organization,
        subject,
        pro_type,
        ratification_year_start,
        ratification_year_end,
        expenditure_start,
        expenditure_end,
        fund
    } = ctx.request.body;
    var pageStart = page_size * (page_num - 1);
    var pageEnd = pageStart + page_size;
    var condition = [];
    if (fund) {
        condition.push(`fund like '${fund}'`);
    }
    if (name) {
        condition.push(`name like '%${name}%'`);
    }
    if (ratification_code) {
        condition.push(`ratification_code like '%${ratification_code}%'`);
    }
    if (principal) {
        condition.push(`principal like '%${principal}%'`);
    }
    if (organization) {
        condition.push(`organization like '%${organization}%'`);
    }
    if (subject) {
        condition.push(`subject like '%${subject}%'`);
    }
    if (pro_type) {
        condition.push(`pro_type like '%${pro_type}%'`);
    }
    if (ratification_year_start || ratification_year_end) {
        var start = ratification_year_start || 0;
        var end = ratification_year_end || date.format(new Date(), 'YYYY');
        if (start <= end) {
            condition.push(`ratification_year >= ${start} and ratification_year <= ${end}`);
        }
    }
    if (expenditure_start || expenditure_end) {
        var start = expenditure_start || 0;
        var end = expenditure_end || 0;
        if (start <= end) {
            condition.push(`expenditure >= ${start} and expenditure <= ${end}`);
        }
    }
    var sqlStr = condition.join(' and ');
    if (condition.length) {
        sqlStr = 'where ' + sqlStr;
    }
    const sql = `
        select 
            id,
            name,
            ratification_code,
            principal,
            organization,
            subject,
            pro_type,
            ratification_year,
            expenditure,
            keyword
        from project_message
        ${sqlStr} 
        order by create_at desc 
        limit ${pageStart},${pageEnd};
    `;
    const sql2 = `
        select count(*) 
        from project_message
        ${sqlStr};
    `;
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
    checkList,
    checkDetail
};