import { sendCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { createMediaOffer } from "../negotiation/MediaNegotiation.js";
import { socket } from "../signing/Signing.js";
import { createVideoTag, deleteVideoTag } from "../tagTool.js";
import { PeerConnectionList } from "./PeerConnctor.js";
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
            createMediaOffer(event.currentTarget, "renegotiate");
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
export { addRTCPeerConnectEvent }