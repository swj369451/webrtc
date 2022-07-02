/**
 * 媒体协商
 */

import { createPeerConnector, PeerConnectionList } from "../connction/PeerConnctor.js";
import { sendMessage, socket } from "../signing/Signing.js";


const offerOptions = {
    iceRestart: true,
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
/**
 * 创建媒体格式提议
 * @param {*} pc 
 * @param {*} toSocketid 
 */
async function createMediaFormatOffer(pc, renegotiate) {
    try {

        const offer = await pc.createOffer(offerOptions);

        await onCreateOfferSuccess(pc, offer, renegotiate);
        console.log(`【${pc.to}】连接：创建完成媒体格式提议`);
    } catch (e) {
        console.log(e);
    }
}

async function onCreateOfferSuccess(pc, desc, renegotiate) {

    console.log(`Offer from pc1\n${desc.sdp}`);

    try {
        setLocalMediaFormat(pc, desc);

        console.log(`【${pc.to}】连接：发送媒体格式提议`);
        sendMessage({
            type: desc.type,
            sdp: desc.sdp,
            from: socket.id,
            to: pc.to,
            renegotiate: renegotiate
        });
        // onSetLocalSuccess(pc);
    } catch (e) {
        onSetSessionDescriptionError(e);
    }

}

function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
}

/**
 * 创建媒体格式应答
 * @param {*} pc 
 */
function createMediaFormatAnswer(pc) {
    console.log(`【${pc.to}】连接：创建媒体格式应答`);
    pc.createAnswer().then(
        function(event) {
            setLocalMediaFormat(pc, event);

            console.log(`【${pc.to}】连接：发送媒体格式应答`);
            sendMessage({
                type: event.type,
                sdp: event.sdp,
                from: socket.id,
                to: pc.to
            });
        },
        onCreateSessionDescriptionError
    );
}

/**
 * 接收媒体格式提议
 * @param {*} message 
 */
async function receiveMediaFormatOffer(message) {
    console.log(`【${message.from}】连接：接收媒体格式提议`);

    if (message.renegotiate !== "renegotiate") {
        await createPeerConnector(message.from);
    }

    let pc = PeerConnectionList.get(message.from);
    if (pc != undefined) {
        //设置远程媒体格式
        setRemoteMediaFormat(pc, message);

        //创建媒体格式应答
        createMediaFormatAnswer(pc)
    }


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



export { createMediaFormatOffer, receiveMediaFormatOffer, receiveMediaFormatAnswer }