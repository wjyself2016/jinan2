const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../static/upload/excel/');
const xlsx = require('xlsx');

async function getExcelObjs(ctx) {
    const date = new Date();
    const map = {
        t: date.getTime(), // 时间戳
        y: date.getFullYear(), // 年
        m: date.getMonth() + 1, // 月
        d: date.getDate(), // 日
        h: date.getHours(), // 时
        i: date.getMinutes(), // 分
        s: date.getSeconds(), // 秒
    };
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path); // 创建可读流
    const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    const finallPath = `${filePath}/${'' + map.y + map.m + map.d}-${Math.random().toString().substring(2)}.${ext}`;
    const upStream = fs.createWriteStream(finallPath); // 创建可写流
    const getRes = await getFile(reader, upStream); //等待数据存储完成

    const datas = []; //可能存在多个sheet的情况
    if (!getRes) { //没有问题
        const workbook = xlsx.readFile(finallPath);
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
        for (const sheetName of sheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            datas.push(data);
        }
        return {
            status: true,
            datas
        };
    } else {
        return {
            status: false,
            msg: '上传文件错误'
        };
    }
}
function getFile(reader, upStream) {
    return new Promise(function (result) {
        let stream = reader.pipe(upStream); // 可读流通过管道写入可写流
        stream.on('finish', function (err) {
            result(err);
        });
    });
}

module.exports = {
    getExcelObjs
};