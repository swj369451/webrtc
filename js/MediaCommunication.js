/**
 * 音视频媒体通信
 */

import { establishCommunicationConntor } from "./connction/PeerConnctor.js"


/**
 * 连接端到端音视频通话
 */
function connctP2PAudioVideoMediaChat() {
    console.log(`连接端到端音视频通话`)
    establishCommunicationConntor();
}
export { connctP2PAudioVideoMediaChat }