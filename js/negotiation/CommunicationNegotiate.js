/**
 * 通信协商
 */

import { joinCommunicationRoom } from "../signing/Signing.js";
import { createMediaOffer } from "./MediaNegotiation.js";

/**
 * 发起通信协商
 */
function communicationNegotiate(roomNumber, indentification) {
    console.log(`发起通信协商`);
    joinCommunicationRoom(roomNumber, indentification);
    // connectSocketServer(indentification);

}

/**
 * 发起媒体协商提议
 */
function MeidaNegotiationOffer(pc) {
    //创建媒体格式提议
    createMediaOffer(pc)
}

export { communicationNegotiate, MeidaNegotiationOffer }