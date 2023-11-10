
'use strict';

/**
 * 获取媒体
 * @param {*} type  媒体类型，有两种，分别是摄像头【UserMedia】和桌面共享【DisplayMedia】
 * @param {*} constraints 媒体限制
 * @returns 
 */
async function getMedia(type, constraints = { audio: true, video: true }) {
    // 获取媒体流
    if (type === "UserMedia") {
        return getUserMedia(constraints)
    } else if (type === "DisplayMedia") {
        return getScreenStream(constraints);
    } else {
        console.error(`不支持获取媒体类型【${type}】`);
        return null;
    }
}
/**
 * 获取用户媒体
 * @param {*} constraints 
 * @returns 
 */
function getUserMedia(constraints) {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                resolve(stream)
                stream.type = "UserMedia";
                stream.onremovetrack = handleOnRemovetrack;
                stream.onaddtrack = handleOnAddtrack;
            })
            .catch((error) => {
                reject(error)
                handleError(error, constraints)
            })
    })
}

/**
 * 获取屏幕流
 */
function getScreenStream(constraints) {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getDisplayMedia(constraints)
            .then((stream) => {
                stream.type = "DisplayMedia"
                resolve(stream)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

async function enumerateDevices() {
    navigator.mediaDevices.enumerateDevices().then((resolve) => {
        console.log('【当前可用设备】');
        console.log(resolve);
    })
}

function handleSuccess(stream) {
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    if (videoTracks[0] != null && audioTracks[0] != null) {
        console.log(`Using video device: 【${videoTracks[0].label}】,enabled：【${videoTracks[0].enabled}】,muted：【${videoTracks[0].muted}】`);
        console.log(`Using audio device: 【${audioTracks[0].label}】,enabled：【${audioTracks[0].enabled}】,muted：【${audioTracks[0].muted}】`);
    }
}

function handleError(error, constraints) {
    let errorNode = document.getElementById("errorNote")
    errorNode.innerHTML = "【媒体错误】" + error.name;

    if (error.name === 'OverconstrainedError') {
        const v = constraints.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'NotAllowedError') {
        errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
    } else if (error.name === 'NotReadableError') {
        errorNode.innerHTML = "【硬件错误】摄像头被占用";
        console.error(`【硬件错误】摄像头被占用`);
    }

}

function errorMsg(msg, error) {
    console.error(`获取音视频流失败${msg}`);
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}

let handleOnRemovetrack = function onRemovetrack(e) {
    console.error(`【事件】流移除轨道${e}`);
}
let handleOnAddtrack = function onAddtrack(e) {
    console.error(`【事件】流轨道添加${e}`);
}
export { getMedia }