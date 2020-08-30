// 初始化表
// const { exec } = require('../db/mysql');
// var date = require('silly-datetime');
// const initUser = async () => {
//     // 初始化用户表
//     const sql = `
//     create table if not exists user (
//         id int auto_increment,
//         username varchar(20),
//         password varchar(100),
//         create_at datetime,
//         update_at datetime,
//         admin tinyint,
//         primary key(id)
//     );`;
//     await exec(sql);
//     let admin = await exec(`select * from user where admin like 1`);
//     // 添加管理员
//     if (!admin.length) {
//         var sql2 = `
//         insert into user(
//             username,
//             password,
//             create_at,
//             update_at,admin
//         ) 
//         values(
//             'kejitongji',
//             'Kejitongji3000', 
//             '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
//             '${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}',
//             1
//         );`;
//         await exec(sql2);
//     }
// }
// const initPolicy = async () => {
//     // 初始化政策信息表
//     const sql = `
//     create table if not exists policy_message (
//         id int auto_increment,
//         name varchar(200),
//         country varchar(50),
//         region varchar(50),
//         organization varchar(200),
//         business varchar(50),
//         policy varchar(50),
//         creater varchar(50),
//         type varchar(50),
//         p_time varchar(20),
//         e_time varchar(20),
//         msg longtext,
//         create_at datetime,
//         update_at datetime,
//         primary key(id)
//     );`;
//     await exec(sql);
// }
// const initInformation = async () => {
//     // 初始化资讯中心
//     const sql = `
//     create table if not exists information_center (
//         id int auto_increment,
//         name varchar(200),
//         business varchar(50),
//         creater varchar(50),
//         type varchar(50),
//         p_time varchar(20),
//         msg longtext,
//         create_at datetime,
//         update_at datetime,
//         primary key(id)
//     );`;
//     await exec(sql);
// }
// const initProject = async () => {
//     // 初始化资讯中心
//     const sql = `
//     create table if not exists project_message (
//         id int auto_increment,
//         name varchar(200),
//         pro_type varchar(50),
//         principal varchar(50),
//         organization varchar(200),
//         expenditure varchar(50),
//         creater varchar(50),
//         fund varchar(50),
//         subject varchar(200),
//         keyword varchar(200),
//         ratification_code varchar(20),
//         ratification_year varchar(20),
//         msg longtext,
//         create_at datetime,
//         update_at datetime,
//         primary key(id)
//     );`;
//     await exec(sql);
// }
// initUser();
// initPolicy();
// initInformation();
// initProject();
"use strict";