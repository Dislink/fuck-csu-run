const { createHash } = require("crypto");

global.apiurl="http://run.csu.edu.cn/";
global.dataKey="f732e8b4c15a9d2e6f87b3c9a1d4e6f7";

const sign=function (data){
    return createHash('md5').update(data).digest('hex');
}

async function delay(ms) {
    return await new Promise((r)=>{setTimeout(r,ms)});
}

function sortKey(t, r) {
    var e = function(t) {
            var r = [];
            for (var e in t) r.push(e);
            r = r.sort();
            var n = {};
            for (var a in r) {
                var o = r[a];
                n[o] = t[o]
            }
            return n
        }(t),
        n = [];
    for (var a in e) "" != e[a] && "0" != e[a] && n.push(a + "=" + e[a]);
    return n.join("&") + "&key=" + r
}

/**
 * 
 * @param {object} user -- 用户 
 * @param {string} user.userid -- 用户id 
 * @param {string} user.openid -- openid 
 */
async function getHome(user) {
    return await (await fetch(`${global.apiurl}/f/api/getHome?openid=${user.openid}&userid=${user.userid}`, {
        method: "POST"
    })).json();
}

/**
 * 
 * @param {object} user -- 用户 
 * @param {string} user.userid -- 用户id 
 * @param {string} user.openid -- openid 
 * @returns e.g.
 * {"runScore":4.583,"scorePercent":45.8,"morningRunCount":1,"mileagePercent":36.8,"countPercent":36.1,"validCount":13.0,"retmsg":"执行成功！","mileage":46.38,"retcode":"000000"} --
 */
async function getPersonaldata(user) {  
    return await (await fetch(`${global.apiurl}/f/api/getPersonaldata?openid=${user.openid}&userid=${user.userid}`, {
        method: "POST"
    })).json();
}

/**
 * 
 * @param {object} options
 * @param {object.user} options.user -- 用户
 * @param {string} options.user.openid -- openid
 * @param {string} options.user.userid -- userid
 * @param {string} options.detailId -- 跑步detailId
 * @returns e.g. {"runStatus":"1","retmsg":"执行成功！","endStatus":0,"retcode":"000000"}
 */
async function getExerciseStatus(options) {
    return await (await fetch(`${global.apiurl}/f/api/getExerciseStatus?openid=${options.user.openid}&detailId=${options.detailId}`, {
        method: "POST"
    })).json();
}


/**
 * 
 * @param {object} user -- 用户
 * @param {string} user.openid -- openid
 * @param {string} user.userid -- userid
*/
async function runtermRecord(user) {
    return await (await fetch(`${global.apiurl}/f/api/runtermRecord?openid=${user.openid}&userid=${user.userid}&runType=0`, {
        method: "POST"
    })).json();
}


/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户
 * @param {string} options.detailId -- 跑步detailId
 */
async function getAllTrajectory(options) {
    return await (await fetch(`${global.apiurl}/f/api/getAllTrajectory?openid=${options.user.openid}&detailId=${options.detailId}`, {
        method: "POST"
    })).json();
}


/**
 * @param {object} options 
 * @param {object.user} options.user -- 用户对象 
 * @param {object.location} options.location -- 当前经纬度
 * @param {string} options.areaNo -- 要请求的区域号
 */
async function getRunLine(options) {
    let formData=new FormData();
    formData.set("openid", options.user.openid);
    formData.set("latitude", options.location.latitude);
    formData.set("longitude", options.location.longitude);
    formData.set("extendType", '0');
    formData.set("applyCount", '20');
    formData.set("areaNo", options.areaNo);
    formData.set("mileage",'0');
    return await (await fetch(`${global.apiurl}/f/api/getRunLine`, {
        method: "POST",
        body: formData
    })).json();
}

/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户 
 * @param {object.location} options.location -- 跑步起始坐标
 * @param {string} options.lineId -- 线路编号
 * @param {string} options.areaNo -- 区域号
 * @param {object.device} options.device -- 设备
 * @param {string} options.device.brand -- 设备品牌
 * @param {string} options.device.model -- 设备型号
 * @param {string} options.runEvidence -- 跑步证据图片路径
 * @param {number} options.runSimilarity -- 跑步证据图片相似度
 */
async function startRun(options) {
    let formData={
        openid: options.user.openid,
        runType: '1',//校园跑
        latitude: options.location.latitude,
        longitude: options.location.longitude,
        sign: sign(sortKey({openid: options.user.openid, runType: 1, longitude: options.location.longitude, latitude: options.location.latitude}, global.dataKey)),
        userid: options.user.userid,
        batchNo: '',
        lineId: options.lineId,
        areaNo: options.areaNo,
        brand: options.device.brand,
        model: options.device.model,
        runEvidence: options.runEvidence||'',
        runSimilarity: options.runSimilarity||0,
    };
    return await (await fetch(`${global.apiurl}/f/api/startRun`, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData)
    })).json();
}

/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户 
 * @param {object.location} options.location -- 打卡当前坐标
 * @param {string} options.detailId -- 跑步detailId
 * @param {string} options.deviceId -- 打卡标记设备id
 * @returns 
 */
async function runPunchCard(options) {
    let formData={
        openid: options.user.openid,
        detailId: options.detailId,
        deviceId: options.deviceId,
        sign: sign(sortKey({openid: options.user.openid, detailId: options.detailId, deviceId: options.deviceId}, global.dataKey)),
        longitude: options.location.longitude,
        latitude: options.location.latitude
    };
    return await (await fetch(`${global.apiurl}/f/api/runPunchCard`, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData)
    })).json();
}

/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户 
 * @param {string} options.detailId -- 跑步detailId
 */
async function getPunchCard(options) {
    let formData={
        openid: options.user.openid,
        userid: options.user.userid,
        detailId: options.detailId,
        sign: sign(sortKey({userid: options.user.userid, detailId: options.detailId}, global.dataKey)),
    };
    return await (await fetch(`${global.apiurl}/f/api/getPunchCard`, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData)
    })).json();
}

/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户 
 * @param {number} options.mileage -- 结束里程 
 * @param {number} options.seqNo -- 坐标点索引（长度-1） 
 * @param {string} options.detailId -- 跑步detailId
 * @param {string?} options.remarks -- 无效时显示的文本
 * @returns 
 */
async function stopRun(options) {
    let formData={
        openid: options.user.openid,
        detailId: options.detailId,
        runType: 1,
        endTime: (Date.parse(new Date))/1e3,
        mileage: options.mileage,
        extentStatus: 1,
        continueCount: 0,
        positionCount: 0,
        seqNo: options.seqNo,
        remarks: options.remarks||'',
        suspendTime: 0,
        suspendCount: 0,
        sign: sign(sortKey({openid: options.user.openid, detailId: options.detailId, latitude: '', longitude: '', endTime: (Date.parse(new Date))/1e3, mileage: options.mileage, runType: 1}, global.dataKey)),
        latitude: '',
        longitude: ''
    };
    return await (await fetch(`${global.apiurl}/f/api/stopRun`, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData)
    })).json();
}

/**
 * 
 * @param {object} options 
 * @param {object.user} options.user -- 用户 
 * @param {string} options.detailId -- 跑步detailId
 * @param {Array<String>} options.fileImg -- 跑步轨迹坐标点
 * @returns 
 */
async function uploadFile(options) {
    let formData=new FormData();
    let currentTime=new Date().valueOf();
    formData.set("openid", options.user.openid);
    formData.set("fileType", 2);
    formData.set("imageType", 1);
    formData.set("schoolId", '');
    formData.set("batchNo", currentTime);
    formData.set("sign", sign(sortKey({openid: options.user.openid, fileType: 2, imageType: 1, batchNo: currentTime}, global.dataKey)));
    formData.set("detailId", options.detailId);
    formData.set("uploadImagetype",'');
    formData.set("fileImg", new Blob([options.fileImg.join("\n")]), `${options.detailId}.txt`)
    return await (await fetch(`${global.apiurl}/f/api/uploadFile`, {
        method: "POST",
        body: formData
    })).json();
}


/**
 *
 * @param {object} options
 * @param {object.user} options.user -- 用户
 * @param {string} options.detailId -- 跑步detailId
 * @param {string} options.batchNo -- batchNo时间戳
 * @param {Blob} options.fileImg -- 证据图片
 * @param {number} options.uploadImagetype -- 上传图片类型
 * @param {number} options.uploadCount -- 上传图片数量
 * @param {number} options.fileType -- 文件类型
 * @param {number} options.imageType -- 图片类型
 * @param {string} options.schoolId -- 学校id
 * @returns
 */
async function uploadRunEvidence(options) {
    let formData=new FormData();
    formData.set("openid", options.user.openid);
    formData.set("batchNo", options.batchNo);
    formData.set("sign", sign(sortKey({openid: options.user.openid, batchNo: options.batchNo}, global.dataKey)));
    formData.set("detailId", options.detailId);
    formData.set("uploadImagetype", options.uploadImagetype||1);
    formData.set("uploadCount", options.uploadCount||1);
    formData.set("fileType", options.fileType||1);
    formData.set("imageType", options.imageType||5);
    formData.set("schoolId", options.schoolId||'');
    formData.set("fileImg", options.fileImg, `${options.detailId}.jpg`)
    return await (await fetch(`${global.apiurl}/f/api/uploadRunEvidence`, {
        method: "POST",
        body: formData
    })).json();
}
const maps={
    "1387205314898046976":"trackPoints_南校.json",
    "1414774360522981376":"trackPoints_湘雅.json",
    "1415493259723898880":"trackPoints_本部.json",
    "1415493325914210304":"trackPoints_新校.json",
    "1415493372307406848":"trackPoints_铁道.json",
    "1387205314898046971":"trackPoints_测试.json"
};

const areas={
    "南校区":"1387205314898046976",
    "湘雅校区":"1414774360522981376",
    "校本部":"1415493259723898880",
    "新校区":"1415493325914210304",
    "铁道校区":"1415493372307406848",
    "测试校区":"1387205314898046971"
};