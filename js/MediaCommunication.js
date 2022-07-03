/*
 * @Author: swj369451 swj369451@163.com
 * @Date: 2022-05-27 17:01:14
 * @LastEditors: swj369451 swj369451@163.com
 * @LastEditTime: 2022-07-03 15:39:22
 * @FilePath: \webrtc\js\MediaCommunication.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 音视频媒体通信
 */

import { establishCommunicationConntor, establishConnector } from "./connction/PeerConnctor.js"
import { getScreenStream } from "./screen/screensharing.js";


/**
 * 连接端到端音视频通话
 */
function connctP2PAudioVideoMediaChat() {
    console.log(`连接端到端音视频通话`)
    establishCommunicationConntor();
}

/**
 * 共享屏幕
 * 屏幕共享给所有人，指定人，指定房间
 * @param roomCode 房间号
 * @param personId 人员id
 */
async function sharingScreen(roomCode) {
    console.log(`屏幕共享给【${roomCode}】房间`)
    let screenStream = await getScreenStream();
    establishConnector(screenStream);
}




export { connctP2PAudioVideoMediaChat, sharingScreen }