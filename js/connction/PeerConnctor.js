/**
 * 对等连接器
 */

import { getUserMeida, stream } from "../media/UserMedia.js";
import { sendCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { communicationNegotiate, MeidaNegotiationOffer } from "../negotiation/CommunicationNegotiate.js"
import { createMediaFormatOffer } from "../negotiation/MediaNegotiation.js";
import { socket } from "../signing/Signing.js";
import { createVideoTag, deleteVideoTag } from "../tagTool.js";

/**
 * 连接配置
 */
let serverConfig = {
    "iceServers": [{
            "urls": "stun:101.35.181.216"
        },
        // { "urls": "turn:101.35.181.216", username: "test", credential: "123" }
        { "urls": "turn:139.9.45.150", username: "test", credential: "123" }
    ],
    "iceTransportPolicy": "relay"
};
let PeerConnectionList = new Map();
window.PeerConnections = PeerConnectionList;
/**
 * 建立通信连接
 */
function establishCommunicationConntor() {
    console.log(`建立通信连接`)
    communicationNegotiate();
}
/**
 * 建立屏幕共享连接
 */
function establishConnector(stream) {
    console.log(`建立通信连接器`)
    PeerConnectionList.get(PeerConnectionList.keys().next().value).addStream(stream);
    PeerConnectionList.get(PeerConnectionList.keys().next().value)
}

/**
 * 成员加入
 */
async function manJoined(room, peerId) {
    console.log(`【${peerId}】连接：接收到成员加入【${room}】房间`)
        //创建连接器
    let pc = await createPeerConnector(peerId);

    // let pc = PeerConnectionList.get(peerId)

    //发起媒体协商提议
    await MeidaNegotiationOffer(pc);
}

/**
 * 创建连接器
 */
async function createPeerConnector(peerId) {
    console.log(`【${peerId}】连接：建立与连接方的端到端连接器`);
    let pc = new RTCPeerConnection(serverConfig);
    PeerConnectionList.set(peerId, pc)
    let userSteam = await getUserMeida();
    if (userSteam != undefined) {
        await pc.addStream(userSteam);
    }

    await addRTCPeerConnectEvent(pc, peerId);
    pc.to = peerId;
    return pc;
}

/**
 * 端到端连接器事件
 * @param {*} pc 
 * @param {*} socketId 
 */
function addRTCPeerConnectEvent(pc, socketId) {
    // pc.onconnectionstatechange = function (event) { handleConnectionstatechange(event, socketId); };
    pc.onicecandidate = function(event) { handleIceCandidate(event, socketId); };
    pc.onaddstream = function(event) { handleRemoteStreamAdded(event, socketId); };
    pc.onremovestream = function(event) { handleRemoteStreamRemoved(event, socketId); };
    pc.oniceconnectionstatechange = function(event) { handleiceconnectionstatechange(event, socketId); };
    pc.onicecandidateerror = function(event) { handleicecandidateerror(event, socketId); };
    pc.onconnectionstatechange = function(event) { handleconnectionstatechange(event, socketId); }
    pc.negotiationneeded = function(event) { handlenegotiationneeded(event, socketId); }

    // pc.onnegotiationneeded = function (event) { handleNegotiationneeded(event, socketId); };
    pc.ontrack = ({ track, streams }) => {
        console.log(1);
    }
}

function handlenegotiationneeded(event, socketId) {
    console.log();
}

function handleicecandidateerror(event, socketId) {
    console.warn(`【ice连接有误】：${event}${socketId}`);
}

function handleIceCandidate(event, from) {
    console.log(`获取与【${from}】的候选地址`, event);
    if (event.candidate) {
        let candidateTransportAddresses = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            from: socket.id,
            to: from
        }
        sendCandidateTransportAddresses(candidateTransportAddresses)
    } else {
        console.log('End of candidates.');
    }
}

function handleconnectionstatechange(event, from) {
    if (event.currentTarget.iceConnectionState === "disconnected") {

        if (event.currentTarget.currentLocalDescription.type === "offer") {
            createMediaFormatOffer(event.currentTarget, "renegotiate");
            setTimeout(() => {
                if (event.currentTarget.signalingState === "have-local-offer") {
                    close(from);
                }
            }, 5000);

        }
        console.log(`【重连ice】重新与${from}连接ice`)
    }

    if (event.currentTarget.iceConnectionState === "failed") {
        close(from);
    }
}

async function handleRemoteStreamAdded(event, form) {
    console.log('Remote stream added.');

    let videoTag = createVideoTag(form);
    videoTag.srcObject = event.stream;

    // reportInfo(event.currentTarget, form)
}

function handleRemoteStreamRemoved(event, from) {
    console.log('Remote stream removed. Event: ', event);
    PeerConnectionList.delete(event.currentTarget.other);
    removeVideoTag(from);
}

function handleiceconnectionstatechange(event, from) {}

function close(targetId) {
    console.log(`【对方掉线】${targetId}已掉线`)
    let pc = PeerConnectionList.get(targetId);
    if (pc != undefined) {
        pc.close();
        PeerConnectionList.delete(targetId);
        deleteVideoTag(targetId);
    }


}

export { establishCommunicationConntor, manJoined, createPeerConnector, PeerConnectionList, serverConfig, establishConnector }