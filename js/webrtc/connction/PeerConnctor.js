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
    "bundlePolicy": 'max-bundle',
    // "iceCandidatePoolSize":10,
    "iceServers": [
        { "urls": "stun:stun.qq.com" },
        { "urls": "stun:signaling.ppamatrix.com" },
        { "urls": "turn:139.9.45.150", username: "test", credential: "123" }
    ],
    "iceTransportPolicy": "relay"
};
/**
 * 连接器集合
 */
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
/**
 * 创建连接器
 * @param {*} id 对等方id
 * @returns 
 */
function createConnector(id) {
    let pc = new RTCPeerConnection(serverConfig);
    addRTCPeerConnectEvent(pc, id);
    pc.to = id;
    PeerConnectionList.set(id, pc);
    return pc;
}

/**
 * 获取连接器
 * @param {*} id 对等方id
 * @returns 
 */
function getConnector(id) {
    let pc = PeerConnectionList.get(id);
    if (pc == null || pc == undefined) {
        pc = createConnector(id);
    }
    return pc;
}

/**
 * 断开连接器
 * @param {*} id 对等方id
 */
function disconnect(id) {
    let pc = PeerConnectionList.get(id);
    if (pc != null && pc != undefined) {
        //关闭pc
        pc.close();
        PeerConnectionList.delete(id);

        //发送断开连接信息
        sendDiconnect(pc.to);

        //回调
        if (window.events['onDiscounnect'] != undefined && window.events['onDiscounnect'] != null) {
            window.events['onDiscounnect'](id);
        }
    }


}

export { PeerConnectionList, serverConfig, getConnector, disconnect, negotiate }