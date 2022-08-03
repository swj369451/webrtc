/**
 * 媒体协商
 */

import { getConnector, PeerConnectionList } from "../connction/PeerConnctor.js";
import { getMedia } from "../media/UserMedia.js";
import { sendMessage } from "../signing/Signing.js";


const offerOptions = {
    iceRestart: true,
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
/**
 * 发起offer
 * @param {*} pc  连接器
 * @param {*} type  通信类型
 */
async function createMediaOffer(pc, type) {
    try {
        const offer = await pc.createOffer(offerOptions);
        await onCreateOfferSuccess(pc, offer, type);
        console.log(`完成与【${pc.to}】的媒体格式提议`);
    } catch (e) {
        console.log(e);
    }
}

async function onCreateOfferSuccess(pc, desc, type) {

    // console.log(`Offer from pc1\n${desc.sdp}`);
    let isUnidirectional = {
        audio: false,
        video: false
    }
    let otherMediaConfig = {
        audio: true,
        video: true
    }
    try {
        setLocalMediaFormat(pc, desc);
        console.log(`【${pc.to}】连接：发送媒体格式提议`);
        sendMessage({
            type: desc.type,
            sdp: desc.sdp,
            from: window.identification,
            to: pc.to,
            isUnidirectional,
            otherMediaConfig,
            mediaType: type
        });
    } catch (e) {
        onSetSessionDescriptionError(e);
    }

}

function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
}

/**
 * 创建媒体格式应答
 * @param {*} pc 带有socketId的连接器
 */
function createMediaAnswer(pc, mediaType) {
    console.log(`【${pc.to}】连接：创建媒体格式应答`);
    if (pc.to == undefined || pc.to == null) {
        console.error(`连接器未设置对等方id`);
    }
    pc.createAnswer()
        .then(
            function (event) {
                setLocalMediaFormat(pc, event);

                console.log(`【${pc.to}】连接：发送媒体格式应答`);
                sendMessage({
                    type: event.type,
                    sdp: event.sdp,
                    from: window.identification,
                    to: pc.to,
                    mediaType: mediaType
                });
            },
            onCreateSessionDescriptionError
        );
}

/**
 * 接收媒体格式提议
 * @param {*} message 
 */
async function receiveMediaOffer(message) {
    console.log(`收到媒体通信协商【${message}】`);

    let pc = getConnector(message.from);
    if (message.mediaType != undefined) {

        let flag = true;
        pc.getLocalStreams().forEach(element => {
            if (element.type === message.mediaType) {
                flag = false;
            }
        });
        if (flag) {
            try {
                let stream = await getMedia(message.mediaType);
                // let pc = getConnector(message.from);
                pc.addStream(stream);
            } catch (error) {

            }

        }
    }

    setRemoteMediaFormat(pc, message);
    createMediaAnswer(pc, message.mediaType)
}
/**
 * 接收媒体格式应答
 * @param {*} message 
 */
async function receiveMediaFormatAnswer(message) {
    console.log(`【${message.from}】连接：接收媒体格式应答`);

    let pc = PeerConnectionList.get(message.from);
    //设置远程媒体格式
    if (pc !== undefined) {
        setRemoteMediaFormat(pc, message);
    }

}
/**
 * 设置本地媒体格式
 */
async function setLocalMediaFormat(pc, desc) {
    console.log(`【${pc.to}】连接：设置本地媒体格式`);
    await pc.setLocalDescription(new RTCSessionDescription(desc)).then(data => {
        console.log();
    }, error => {
        console.log(`【添加本地sdp错误】` + error)
    });
}
/**
 * 设置远程媒体格式
 */
function setRemoteMediaFormat(pc, message) {
    console.log(`【${pc.to}】连接：设置远程媒体格式`);
    pc.setRemoteDescription(new RTCSessionDescription(message)).then(data => {

    }, error => {
        console.log(`【添加远程sdp错误】` + error)
    });
}

function renegotiation(pc) {
    if (pc.currentLocalDescription.type === "answer") {
        createMediaAnswer(pc);
    } else {
        createMediaOffer(pc, "renegotiate");
    }
}


export { createMediaOffer, receiveMediaOffer, receiveMediaFormatAnswer, renegotiation }