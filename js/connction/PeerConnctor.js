/**
 * 对等连接器
 */

import { getUserMeida, stream } from "../media/UserMedia.js";
import { sendCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { communicationNegotiate, MeidaNegotiationOffer } from "../negotiation/CommunicationNegotiate.js"
import { createMediaFormatOffer } from "../negotiation/MediaNegotiation.js";
import { reportInfo } from "../report/report.js";
import { socket } from "../signing/Signing.js";
import { addVideo, createVideoTag, deleteVideoTag, getVideoTag } from "../tagTool.js";

/**
 * 连接配置
 */
let serverConfig = {
    "bundlePolicy": "max-bundle",
    "iceServers": [
        {
            "urls": "stun:101.35.181.216"
        },
        { "urls": "turn:101.35.181.216", username: "test", credential: "123" }
    ]
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
    console.log(`【${peerId}】连接：建立与连接方的端到端连接器`)
    let pc = new RTCPeerConnection(serverConfig);
    PeerConnectionList.set(peerId, pc)
    let userSteam = await getUserMeida();
    await pc.addStream(userSteam);

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
    pc.onicecandidate = function (event) { handleIceCandidate(event, socketId); };
    pc.onaddstream = function (event) { handleRemoteStreamAdded(event, socketId); };
    pc.onremovestream = function (event) { handleRemoteStreamRemoved(event, socketId); };
    pc.oniceconnectionstatechange = function (event) { handleiceconnectionstatechange(event, socketId); };
    pc.onicecandidateerror = function (event) { handleicecandidateerror(event, socketId); };
    pc.onconnectionstatechange = function (event) { handleconnectionstatechange(event, socketId); }
    pc.negotiationneeded = function (event) { handlenegotiationneeded(event, socketId); }

    // pc.onnegotiationneeded = function (event) { handleNegotiationneeded(event, socketId); };
    pc.ontrack = ({ track, streams }) => {
        console.log(1);
    }
}
function handlenegotiationneeded(event, socketId) {
    console.log();
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
    // let flag=false;
    // event.currentTarget.getReceivers().forEach(function(receiver){

    //     if(receiver.transport.iceTransport.state=="disconnected"){
    //         flag=true;
    //     }else{
    //         flag=false;
    //     }
    // })

    if (event.currentTarget.iceConnectionState === "disconnected") {
        setTimeout(() => {
            if (event.currentTarget.iceConnectionState === "disconnected") {
                // createMediaFormatOffer(event.currentTarget);
                createMediaFormatOffer(event.currentTarget,"renegotiate");
                console.log(`【重连ice】重新与${from}连接ice`)

                setTimeout(() => {
                    if (event.currentTarget.signalingState === "have-local-offer") {
                        close(from);

                    }
                }, 5000);
            }
        }, 10000);
    }


    // if ((event.currentTarget.iceConnectionState === "disconnected" && flag) ||event.currentTarget.iceConnectionState === "failed") {
    //     PeerConnectionList.delete(from);
    //     // removeVideoTag(from);
    //     deleteVideoTag(from);
    // }
    if (event.currentTarget.iceConnectionState === "failed") {
        close(from);
        // PeerConnectionList.get(from).close();
        // PeerConnectionList.delete(from);
        // // removeVideoTag(from);
        // deleteVideoTag(from);
    }
}

async function handleRemoteStreamAdded(event, form) {
    console.log('Remote stream added.');

    let videoTag = createVideoTag(form);
    videoTag.srcObject = event.stream;

    reportInfo(event.currentTarget, form)
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
function close(targetId) {
    console.log(`【对方掉线】${targetId}已掉线`)
    let pc = PeerConnectionList.get(targetId);
    if(pc!=undefined){
        pc.close();
        PeerConnectionList.delete(targetId);
        deleteVideoTag(targetId);
    }
    
    
}

export { establishCommunicationConntor, manJoined, createPeerConnector, PeerConnectionList, serverConfig }