const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const session = require('koa-session');
const router = require('./router');
const serve = require("koa-static");
// const cors = require('koa2-cors');
const { exec } = require('./db/mysql');
var tip = require('./utils/tip');
app.keys = ['jinan'];

app.use(serve(__dirname + "/static"));
// 解析文件
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 400 * 1024 * 1024 // 设置上传文件大小最大限制，默认4M
    }
}));
// 跨域设置
// app.use(
//     cors({
//         origin: function (ctx) {
//             return ctx.header.origin; // 如果允许种cookie，此处域名必须等于访问域名
//         },
//         maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//         credentials: true, //是否允许种Cookie
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X_Requested_With'], //设置服务器支持的所有头信息字段
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//     })
// );
// 错误信息
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
    }
});
// 登录状态校验
app.use( async (ctx, next) => {
    var { url } = ctx;
    if (url.indexOf('login') > -1) {
        await next();
    } else {
        var name = ctx.session.username;
        const sql = `select * from ren where username like '${name}';`;
        var result = await exec(sql);
        if (result.length) {
            await next();
        } else {
            ctx.response.body = tip[1003];
        }
    }
});
// 设置cookie
app.use(session({
    key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
    maxAge: 86400000,   /**  session 过期时间，以毫秒ms为单位计算 。*/
    autoCommit: true, /** 自动提交到响应头。(默认是 true) */
    overwrite: true, /** 是否允许重写 。(默认是 true) */
    httpOnly: true, /** 是否设置HttpOnly。(默认 true) */
    signed: true, /** 是否签名。(默认是 true) */
    rolling: false, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
}, app));
router(app);
app.listen(3000);
