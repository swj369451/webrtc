/**
 * 候选传输地址
 * 
 */

import { PeerConnectionList } from "../connction/PeerConnctor.js"
import { sendMessage } from "../signing/Signing.js";


/**
 * Collect candidate transport addresses
 */
function collectCandidateTransportAddresses(message) {
    console.log(`【${message.from}】连接：接收候选传输地址`);

    let pc = PeerConnectionList.get(message.from);
    if (pc != undefined) {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate).then(data => {
            console.log(`【添加ice】`)
        }, error => {
            console.log(`【添加ice错误】` + error)
        });
    }



}

function sendCandidateTransportAddresses(candidate) {
    // console.log(`【${message.from}】连接：接收候选传输地址`);
    sendMessage(candidate);
}
export { collectCandidateTransportAddresses, sendCandidateTransportAddresses }