/**
 * 对等连接器
 */

import { getUserMeida, stream } from "../media/UserMedia.js";
import { sendCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { communicationNegotiate, MeidaNegotiationOffer } from "../negotiation/CommunicationNegotiate.js"
import { socket } from "../signing/Signing.js";
import { addVideo, getVideoTag } from "../tagTool.js";

/**
 * 连接配置
 */
let serverConfig = {
    "iceServers": [
        {
            "urls": [
                "stun:101.35.181.216",
            ]
        },
        { "url": "turn:101.35.181.216", username: "test", credential: "123456" }
    ]
};
let PeerConnectionList = new Map();
window.PeerConnections=PeerConnectionList;
/**
 * 建立通信连接
 */
function establishCommunicationConntor() {
    console.log(`建立通信连接`)
    communicationNegotiate();
}

/**
 * 成员加入
 */
async function manJoined(room, peerId) {
    console.log(`【${peerId}】连接：接收到成员加入【${room}】房间`)
    //创建连接器
    await createPeerConnector(peerId);

    //发起媒体协商提议
    await MeidaNegotiationOffer(PeerConnectionList.get(peerId));
}

/**
 * 创建连接器
 */
async function createPeerConnector(peerId) {
    console.log(`【${peerId}】连接：建立与连接方的端到端连接器`)
    let pc = new RTCPeerConnection(serverConfig);
    PeerConnectionList.set(peerId, pc)
    let userSteam = await getUserMeida();
    await pc.addStream(userSteam);

    await addRTCPeerConnectEvent(pc, peerId);
    pc.to = peerId;
}

/**
 * 端到端连接器事件
 * @param {*} pc 
 * @param {*} socketId 
 */
function addRTCPeerConnectEvent(pc, socketId) {
    // pc.onconnectionstatechange = function (event) { handleConnectionstatechange(event, socketId); };
    pc.onicecandidate = function (event) { handleIceCandidate(event, socketId); };
    pc.onaddstream = function (event) { handleRemoteStreamAdded(event, socketId); };
    pc.onremovestream = function (event) { handleRemoteStreamRemoved(event, socketId); };
    pc.oniceconnectionstatechange = function (event) { handleiceconnectionstatechange(event, socketId); };
    pc.onicecandidateerror = function (event) { handleicecandidateerror(event, socketId); };
    pc.onconnectionstatechange = function (event) { handleconnectionstatechange(event, socketId); }

    // pc.onnegotiationneeded = function (event) { handleNegotiationneeded(event, socketId); };
}
function handleicecandidateerror(event, socketId) {
    console.log(event, socketId);
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
    // if (event.currentTarget.iceConnectionState === "disconnected") {
    //     PeerConnectionList.delete(from);
    //     removeVideoTag(from);
    // }
    // if (event.currentTarget.iceConnectionState === "failed") {
    //     PeerConnectionList.delete(from);
    //     removeVideoTag(from);
    // }
}

function handleRemoteStreamAdded(event, form) {
    console.log('Remote stream added.');
    addVideo(form)
    let videoTag = getVideoTag(form);
    videoTag.srcObject = event.stream;
    // console.log(event.stream.getVideoTracks());
    // console.log(event.stream.getAudioTracks());
}

function handleRemoteStreamRemoved(event, from) {
    console.log('Remote stream removed. Event: ', event);
    PeerConnectionList.delete(event.currentTarget.other);
    removeVideoTag(from);
}

function handleiceconnectionstatechange(event, from) {
    // if (event.currentTarget.iceConnectionState === "disconnected") {
    //     PeerConnectionList.delete(from);
    //     removeVideoTag(from);
    // }
    // if (event.currentTarget.iceConnectionState === "failed") {
    //     PeerConnectionList.delete(from);
    //     removeVideoTag(from);
    // }
}

export { establishCommunicationConntor, manJoined, createPeerConnector, PeerConnectionList }