/**
 * 对等连接器
 */
import { getUserMeida } from "../media/UserMedia.js";
import { communicationNegotiate, MeidaNegotiationOffer } from "../negotiation/CommunicationNegotiate.js"
import { createMediaOffer } from "../negotiation/MediaNegotiation.js";
import { sendDiconnect } from "../signing/Signing.js";
import { deleteVideoTag } from "../tagTool.js";
import { addRTCPeerConnectEvent } from "./PeerConnctorEvent.js";

/**
 * 信令和中转服务器配置
 */
let serverConfig = {
    "bundlePolicy": 'max-bundle',
    "iceServers": [
        { "urls": "stun:101.35.181.216" },
        { "urls": "turn:139.9.45.150", username: "test", credential: "123" }
    ],
    "iceTransportPolicy": "relay"
};
let PeerConnectionList = new Map();
window.PeerConnections = PeerConnectionList;
/**
 * 建立通信连接
 */
function establishCommunicationConntor(roomNumber, indentification) {
    console.log(`建立通信连接`)
    communicationNegotiate(roomNumber, indentification);
}
/**
 * 给连接器添加新流
 */
function addStream(stream, PeerConnectionList) {
    console.log(`添加新流`)
    PeerConnectionList.forEach(element => {
        element.addStream(stream);
        // //重新发起协商
        createMediaOffer(element, "renegotiate");
    });
}
/**
 * 进行协商
 * @param {*} stream      媒体流
 * @param {*} pc     连接器
 */
function negotiate(pc, type) {
    createMediaOffer(pc, type);
}

/**
 * 成员加入
 */
async function manJoined(room, peerId) {
    console.log(`【${peerId}】连接：接收到成员加入【${room}】房间`)
        //创建连接器
    let pc = await createPeerConnector(peerId);

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

function createConnector(indentification) {
    let pc = new RTCPeerConnection(serverConfig);
    addRTCPeerConnectEvent(pc, indentification);
    pc.to = indentification;
    PeerConnectionList.set(indentification, pc);
    return pc;
}

function getConnector(indentification) {
    let pc = PeerConnectionList.get(indentification);
    if (pc == null || pc == undefined) {
        pc = createConnector(indentification);
    }
    return pc;
}

function disconnect(indentification) {
    let pc = PeerConnectionList.get(indentification);
    if (pc != null && pc != undefined) {
        pc.close();
        PeerConnectionList.delete(indentification);
        sendDiconnect(pc.to);
    }

    if (window.events['onDiscounnect'] != undefined && window.events['onDiscounnect'] != null) {
        window.events['onDiscounnect'](indentification);
    }
}



export { establishCommunicationConntor, manJoined, createPeerConnector, PeerConnectionList, serverConfig, addStream, getConnector, disconnect, negotiate }