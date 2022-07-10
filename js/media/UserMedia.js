'use strict';

import { getScreenStream } from "../screen/screensharing.js";

// Put variables in global scope to make them available to the browser console.
const constraints = {
    audio: true,
    video: true
};
let stream;

async function getMedia(type) {
    let stream;
    if (type === "UserMedia") {
        stream = await getUserMeida();
    } else if (type === "DisplayMedia") {
        stream = await getScreenStream();
    } else {
        console.error(`连接类型【${type}】不支持`);
    }
    return stream;
}

async function getUserMeida() {
    try {
        if (stream == undefined) {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            // stream.type = "UserMedia";
            navigator.mediaDevices.enumerateDevices().then((resolve) => {
                console.log('【当前可用设备】');
                console.log(resolve);
            })

            stream.onremovetrack = handleOnRemovetrack;
            stream.onaddtrack = handleOnAddtrack;
            handleSuccess(stream);
        }
        return stream;
    } catch (e) {
        handleError(e);
    }
}

function handleSuccess(stream) {
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    console.log('Got stream with constraints:', constraints);
    if (videoTracks[0] != null && audioTracks[0] != null) {
        console.log(`Using video device: 【${videoTracks[0].label}】,enabled：【${videoTracks[0].enabled}】,muted：【${videoTracks[0].muted}】`);
        console.log(`Using audio device: 【${audioTracks[0].label}】,enabled：【${audioTracks[0].enabled}】,muted：【${audioTracks[0].muted}】`);
    }
}

function handleError(error) {
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
    errorMsg(`getUserMedia error: ${error.name}`, error);
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
export { getUserMeida, stream, getMedia }