import { sendCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { createMediaOffer } from "../negotiation/MediaNegotiation.js";
import { socket } from "../signing/Signing.js";
import { disconnect, getConnector, PeerConnectionList } from "./PeerConnctor.js";
/**
 * 端到端连接器事件
 * @param {*} pc 
 * @param {*} socketId 
 */
function addRTCPeerConnectEvent(pc, socketId) {

    pc.onicecandidate = function (event) { handleIceCandidate(event, socketId); };
    pc.onaddstream = function (event) { handleRemoteStreamAdded(event, socketId); };
    pc.onremovestream = function (event) { handleRemoteStreamRemoved(event, socketId); };
    pc.oniceconnectionstatechange = function (event) { handleiceconnectionstatechange(event, socketId); };
    pc.onicecandidateerror = function (event) { handleicecandidateerror(event, socketId); };
    pc.onconnectionstatechange = function (event) { handleconnectionstatechange(event, socketId); }
    pc.negotiationneeded = function (event) { handlenegotiationneeded(event, socketId); }
    pc.onsignalingstatechange = function (event) { handleSignalingstatechange(event, pc); }
}

function handlenegotiationneeded(event, socketId) {
    console.log();
}

function handleicecandidateerror(event, socketId) {
    console.warn(`【ice连接有误】：${event}${socketId}`);
}

function handleIceCandidate(event, from) {
    // console.log(`获取与【${from}】的候选地址`, event);
    if (event.candidate) {
        let candidateTransportAddresses = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            from: socket.identification,
            to: from
        }
        sendCandidateTransportAddresses(candidateTransportAddresses)
    } else {
        console.log('End of candidates.');
    }
}

function handleconnectionstatechange(event, from) {
    // if (event.currentTarget.iceConnectionState === "disconnected") {
    //     setTimeout(() => {
    //         if (event.currentTarget.iceConnectionState === "disconnected") {
    //             createMediaOffer(event.currentTarget);
    //             setTimeout(() => {
    //                 if (event.currentTarget.signalingState === "have-local-offer") {
    //                     disconnect(from);
    //                 }
    //             }, 2000);
    //             console.log(`【重连ice】重新与${from}连接ice`)
    //         }
    //     }, 1000);

    // }
    if (event.currentTarget.intervalId == null || event.currentTarget.intervalId == undefined) {
        const intervalId = setInterval(function () {
            if (event.currentTarget.iceConnectionState === "connected"
                || event.currentTarget.signalingState === "closed") {
                clearInterval(intervalId);
            }
            if (event.currentTarget.iceConnectionState !== "connected"
            && event.currentTarget.signalingState !== "closed") {
                setTimeout(() => {
                    if (event.currentTarget.iceConnectionState !== "connected") {
                        createMediaOffer(event.currentTarget);
                        console.log(`【重连ice】重新与${from}连接ice`)
                    }
                }, 200);
            }

        }, 1000);
        event.currentTarget.intervalId = intervalId;
    }


    // if (event.currentTarget.iceConnectionState === "failed") {
    //     disconnect(targetId);
    // }
}

function handleSignalingstatechange(event, pc) {

}

async function handleRemoteStreamAdded(event, form) {
    console.log('Remote stream added.');
    let pc = await getConnector(form);
    if (window.events['onAddStream'] != undefined && window.events['onAddStream'] != null) {
        window.events['onAddStream'](event.stream, form, pc);
    }

    if (pc == null || pc == undefined) {
        return;
    }

    if (pc.videoLabel != null || pc.videoLabel != undefined) {
        pc.videoLabel.srcObject = event.stream;
    }
    let receives = pc.getReceivers();
    receives.forEach((receive) => {
        if (receive.track.kind === "video" && receive.track.muted === true) {
            if (pc.videoLabel != null && pc.videoLabel != undefined) {
                pc.videoLabel.style = "background-image: url(https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/images/camera_chart.png); background-position: center center;background-size: cover;"
            }
        }
    })

}

function handleRemoteStreamRemoved(event, from) {
    console.log('Remote stream removed. Event: ', event);
    PeerConnectionList.delete(event.currentTarget.other);
    // removeVideoTag(from);
}

function handleiceconnectionstatechange(event, from) { }

export { addRTCPeerConnectEvent }
