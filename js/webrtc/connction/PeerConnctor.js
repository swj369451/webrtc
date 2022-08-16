/**
 * 对等连接器
 */
import { createMediaOffer } from "../negotiation/MediaNegotiation.js";
import { sendDiconnect } from "../signing/Signing.js";
import { addRTCPeerConnectEvent } from "./PeerConnctorEvent.js";

/**
 * 信令和中转服务器配置
 */
let serverConfig = {
    // "bundlePolicy": 'max-bundle',
    // "iceCandidatePoolSize":10,
    "iceServers": [
        { "urls": "stun:stun.qq.com" },
        { "urls": "stun:signaling.ppamatrix.com" },
        { "urls": "turn:101.35.181.216", username: "test", credential: "123" }
    ],
    // "iceTransportPolicy": "relay"
};
let PeerConnectionList = new Map();
window.PeerConnections = PeerConnectionList;

/**
 * 进行协商
 * @param {*} stream      媒体流
 * @param {*} pc     连接器
 */
async function negotiate(pc, type) {
    createMediaOffer(pc, type);
}

function createConnector(identification) {
    let pc = new RTCPeerConnection(serverConfig);
    addRTCPeerConnectEvent(pc, identification);
    pc.to = identification;
    PeerConnectionList.set(identification, pc);
    return pc;
}

function getConnector(identification) {
    let pc = PeerConnectionList.get(identification);
    if (pc == null || pc == undefined) {
        pc = createConnector(identification);
    }
    return pc;
}

function disconnect(identification) {
    let pc = PeerConnectionList.get(identification);
    if (pc != null && pc != undefined) {
        //关闭pc
        pc.close();
        PeerConnectionList.delete(identification);
        
        //发送断开连接信息
        sendDiconnect(pc.to);

        //回调
        if (window.events['onDiscounnect'] != undefined && window.events['onDiscounnect'] != null) {
            window.events['onDiscounnect'](identification);
        }
    }

    
}

export { PeerConnectionList, serverConfig, getConnector, disconnect, negotiate }