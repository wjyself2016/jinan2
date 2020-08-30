const request = require('request');
const { getToken } = require('../../utils/getToken');
const _ = require('lodash');
const hyfl = require('../../dic/hyfl');
const xkfl = require('../../dic/xkfl');
var tip = require('../../utils/tip');

const getRegionData = async (ctx) => {
    var indexName = 0;
    const { type } = ctx.request.query;
    switch (type) {
        case '期刊': 
            indexName = 10001;
            break;
        case '会议':
            indexName = 10002;
            break;
        case '成果':
            indexName = 10006;
            break;
        case '专利': 
            indexName = 10004;
            break;
        case '机构':
            indexName = 10022;
            break;
        case '产品': 
            indexName = 10011;
            break;
    }
    var url = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=${indexName}&aggFields=ORGPROVINCE`;
    const token = await getToken(99002);
    var data = await getRegionDataWF(url, token);
    ctx.body = {
        data: data,
        errmsg: '',
        errno: 0
    };
}
const getRegionOutputData = async (ctx) => {
    var url1 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10001&aggFields=ORGTYPE&aggSize=6`;
    var url2 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10002&aggFields=ORGTYPE&aggSize=6`;
    var url3 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10004&aggFields=ORGTYPE&aggSize=6`;
    var url4 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10006&aggFields=ORGTYPE&aggSize=6`;
    const token = await getToken(99002);
    var data1 = await getDataWF(url1 , token);
    var data2 = await getDataWF(url2, token);
    var data3 = await getDataWF(url3, token);
    var data4 = await getDataWF(url4, token);
    var qikan = _.get(data1, 'data.aggregations.orgtype.buckets',[]);
    var huiyi = _.get(data2, 'data.aggregations.orgtype.buckets',[]);
    var zhuanli = _.get(data3, 'data.aggregations.orgtype.buckets',[]);
    var chengguo =  _.get(data4, 'data.aggregations.orgtype.buckets',[]);
    var result = {
        '期刊': [
            qikan.find((item) => {return item.key === 'GX'}).doc_count,     // 大学
            qikan.find((item) => {return item.key === 'KY'}).doc_count,     // 院所
            qikan.find((item) => {return item.key === 'QY'}).doc_count,     // 企业
        ],
        '会议': [
            huiyi.find((item) => {return item.key === 'GX'}).doc_count,
            huiyi.find((item) => {return item.key === 'KY'}).doc_count,
            huiyi.find((item) => {return item.key === 'QY'}).doc_count,
        ],
        '专利': [
            zhuanli.find((item) => {return item.key === 'GX'}).doc_count,
            zhuanli.find((item) => {return item.key === 'KY'}).doc_count,
            zhuanli.find((item) => {return item.key === 'QY'}).doc_count,
        ],
        '成果': [
            chengguo.find((item) => {return item.key === 'GX'}).doc_count,
            chengguo.find((item) => {return item.key === 'KY'}).doc_count,
            chengguo.find((item) => {return item.key === 'QY'}).doc_count,
        ]
    }
    ctx.body = {
        data: result,
        errmsg: '',
        errno: 0
    };
}
const getRegionOrgData = async (ctx) => {
    var url1 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10013&aggFields=PROV&aggSize=34`; // 大学
    var url2 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10011&aggFields=PROV&aggSize=34`; // 企业
    var url3 = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10022&aggFields=PROV&aggSize=34`; // 院所
    const token = await getToken(99002);
    var data1 = await getRegionOrgDataWF(url1, token);
    var data2 = await getRegionOrgDataWF(url2, token);
    var data3 = await getRegionOrgDataWF(url3, token);

    var result = {
        '大学': data1,
        '企业': data2,
        '院所': data3
    }
    
    ctx.body = {
        data: result,
        errmsg: '',
        errno: 0
    };
}
const getRegionOrgProvData = async (ctx) => {
    var url = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10013,10011,10022&aggFields=PROV&aggSize=34`;
    const token = await getToken(99002);
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.aggregations.prov.buckets');
    ctx.body = {
        data: data,
        errmsg: '',
        errno: 0
    };
}
const getRankData = async (ctx) => {
    const {
        page_size=10, 
        page_num=1, 
        type
    } = ctx.request.query;
    var url = `http://api.kefuju.cn/open/api/PreciseSearch?indexName=10061&queryString=YEAR:0 AND EID:I AND ORGTYPE:${type}&sortField=MARK.D&from=${(page_num - 1) * page_size}&size=${page_size}`;
    var total = 0;
    const token = await getToken(99001);
    if (type == 'KY') {
        const token2 = await getToken(99004);
        total = await getCount(10022, token2);
        total = _.get(total, 'data[0].value');
    } else if (type == 'QY') {
        const token2 = await getToken(99004);
        total = await getCount(10011, token2);
        total = _.get(total, 'data[0].value');
    } else if (type == 'GX') {
        total = 879;
    }
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.sources');
    ctx.body = {
        data: {
            list: data,
            total: total
        },
        errmsg: '',
        errno: 0
    };
}
const getRankClassifyData = async (ctx) => {
    const { type } = ctx.request.query;
    var url = `http://api.kefuju.cn/open/api/AggregationSearch?indexName=10061&aggFields=ENDCLASS&queryString=YEAR:0 AND EID:I AND ORGTYPE:${type}&aggSize=10`;
    const token = await getToken(99002);
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.aggregations.endclass.buckets');
    if (type === 'KY') {
        data.forEach((item) => {
            item.key = xkfl[item.key];
        });
    } else if (type === 'QY') {
        data.forEach((item) => {
            item.key = hyfl[item.key];
        });
    }
    ctx.body = {
        data: data,
        errmsg: '',
        errno: 0
    };
}

// 机构排名
const getOrgDetailRankData = async (ctx) => {
    const { orgid } = ctx.request.query;
    var url = `http://api.kefuju.cn/open/api/PreciseSearch?indexName=10061&queryString=YEAR:0 AND EID:I AND ORGID:${orgid}`;
    const token = await getToken(99001);
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.sources[0].source', null);
    
    ctx.body = {
        data: data,
        errno: 0,
        errmsg: ''
    };

}
// 机构基础信息
const getOrgDetailInfoData = async (ctx) => {
    const { orgid, orgtype } = ctx.request.query;
    if (orgtype === 'GX') {
        indexName = 10013;
    } else if (orgtype === 'KY') {
        indexName = 10022;
    } else if (orgtype === 'QY') {
        indexName = 10011;
    } else {
        ctx.body = tip[1006];
    }
    var url = `http://api.kefuju.cn/open/api/PreciseSearch?indexName=${indexName}&queryString=ORGID:${orgid}`;
    console.log(url);
    const token = await getToken(99001);
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.sources[0].source', null);
    ctx.body = {
        data: data,
        errno: 0
    };
}
// 机构指标信息
const getOrgDetailIndicatorData = async (ctx) => {
    const { orgid, orgtype } = ctx.request.query;
    var url = `http://api.kefuju.cn/open/api/PreciseSearch?indexName=10061&queryString=YEAR:0 AND ORGID:${orgid}&size=170`;
    console.log(url);
    const token = await getToken(99001);
    var data = await getDataWF(url, token);
    data = _.get(data, 'data.sources', []);
    var obj = {};
    data.forEach(item => {
        obj[item.source.EID[0]] = item.source.QUANTITY;
    });
    ctx.body = {
        data: obj,
        errno: 0
    };
}

function getDataWF (url, token) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }, (err, res, body) => {
            var data = JSON.parse(body);
            resolve(data);
        });
    });
}
function getRegionDataWF (url, token) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }, (err, res, body) => {
            var data = JSON.parse(body);
            data = _.get(data, 'data.aggregations.orgprovince.buckets');
            var base = [
                {name: '北京',value: 0},
                {name: '天津',value: 0},  
                {name: '上海',value: 0},
                {name: '重庆',value: 0},  
                {name: '河北',value: 0},
                {name: '河南',value: 0},  
                {name: '云南',value: 0},
                {name: '辽宁',value: 0},  
                {name: '黑龙江',value: 0},
                {name: '湖南',value: 0},  
                {name: '安徽',value: 0},
                {name: '山东',value: 0},  
                {name: '新疆',value: 0},
                {name: '江苏',value: 0},  
                {name: '浙江',value: 0},
                {name: '江西',value: 0},  
                {name: '湖北',value: 0},
                {name: '广西',value: 0},  
                {name: '甘肃',value: 0},
                {name: '山西',value: 0},  
                {name: '内蒙古',value: 0},
                {name: '陕西',value: 0},  
                {name: '吉林',value: 0},
                {name: '福建',value: 0},  
                {name: '贵州',value: 0},
                {name: '广东',value: 0},  
                {name: '青海',value: 0},
                {name: '西藏',value: 0},  
                {name: '四川',value: 0},
                {name: '宁夏',value: 0},  
                {name: '海南',value: 0},
                {name: '台湾',value: 0},  
                {name: '香港',value: 0},
                {name: '澳门',value: 0},
                {name: '南海诸岛',value: 0}
            ];
            base.forEach(item => {
                var itemData = data.find((x) => {
                    return item.name === x.key;
                });
                if (itemData) {
                    item.value = itemData.doc_count;
                }
            });
            resolve(base);
        });
    });
}
function getRegionOrgDataWF (url, token) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }, (err, res, body) => {
            var data = JSON.parse(body);
            data = _.get(data, 'data.aggregations.prov.buckets');
            var 华北 = ['北京', '天津', '河北', '山西'];
            var 东北 = ['黑龙江', '吉林', '辽宁', '内蒙古'];
            var 华东 = ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '台湾'];
            var 中南 = ['河南', '湖北', '湖南', '广东', '广西', '海南', '香港', '澳门'];
            var 西南 = ['四川', '贵州', '云南', '西藏', '重庆'];
            var 西北 = ['陕西', '甘肃', '青海', '宁夏', '新疆'];
            var num = {
                华北: _getNum(data, 华北),
                东北: _getNum(data, 东北),
                华东: _getNum(data, 华东),
                中南: _getNum(data, 中南),
                西南: _getNum(data, 西南),
                西北: _getNum(data, 西北)
            };
            resolve(num);
        });
        function _getNum (data, dic) {
            var total = 0;
            dic.forEach(item => {
                var num = data.find((x) => {
                    return x.key === item;
                });
                if (num) {
                    total += num.doc_count;
                }
            });
            return total;
        }
    });
}
function getCount (indexName, token) {
    return new Promise((resolve, reject) => {
        request({
            url: `http://api.kefuju.cn/open/api/CountSearch?indexName=${indexName}`,
            method: 'GET',
            headers: {
                Authorization: token
            }
        }, (err, res, body) => {
            var data = JSON.parse(body);
            resolve(data);
        });
    });
}
module.exports = {
    getRegionData,
    getRegionOutputData,
    getRegionOrgData,
    getRegionOrgProvData,
    getRankData,
    getRankClassifyData,
    getOrgDetailInfoData,
    getOrgDetailRankData,
    getOrgDetailIndicatorData
};