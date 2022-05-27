/**
 * 通信协商
 */

 import { joinCommunicationRoom } from "../signing/Signing.js";
import { createMediaFormatOffer } from "./MediaNegotiation.js";

 /**
  * 发起通信协商
  */
 function communicationNegotiate(){
     console.log(`发起通信协商`);
     joinCommunicationRoom();
 }
 
 /**
  * 发起媒体协商提议
  */
 function MeidaNegotiationOffer(pc){
     //创建媒体格式提议
     createMediaFormatOffer(pc)
 }
 
 export {communicationNegotiate,MeidaNegotiationOffer}