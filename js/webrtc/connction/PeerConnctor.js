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
        //  { "urls": "turn:101.35.181.216", username: "test", credential: "123" },
        { "urls": "turn:139.9.45.150", username: "test", credential: "123" },
        { "urls": "turn:139.9.227.139", username: "test", credential: "123" },
    ],
    //  "iceTransportPolicy": "relay"
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

async function createConnector(identification) {
    // const p = new Promise((resolve, reject) => {
    // await $.get('https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/connction/RTCConfiguration.json',
    //     function (data) {
    //         // 请求成功时的处理逻辑
    //         console.log(data);
    //         serverConfig = data;
    //         let pc = new RTCPeerConnection(serverConfig);
    //         addRTCPeerConnectEvent(pc, identification);
    //         pc.to = identification;
    //         PeerConnectionList.set(identification, pc);
    //         resolve(pc);
    //     })
    //     .fail(function (xhr, status, error) {
    //         // 失败就用默认的地址
    //     });
    let pc;
    await fetch('https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/connction/RTCConfiguration.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            // serverConfig = data;
            pc = new RTCPeerConnection(serverConfig);
            addRTCPeerConnectEvent(pc, identification);
            pc.to = identification;
            PeerConnectionList.set(identification, pc);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    // })
    return pc;
}

async function getConnector(identification) {
    let pc = PeerConnectionList.get(identification);
    if (pc == null || pc == undefined) {
        pc = await createConnector(identification);
    }
    return pc
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
