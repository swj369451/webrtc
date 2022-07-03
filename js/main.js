/*
 * @Author: swj369451 swj369451@163.com
 * @Date: 2022-05-27 17:01:14
 * @LastEditors: swj369451 swj369451@163.com
 * @LastEditTime: 2022-07-03 14:43:46
 * @FilePath: \webrtc\js\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { showControls } from "./controls/CommunicationControl.js";
import { getUserMeida } from "./media/UserMedia.js";
import { connctP2PAudioVideoMediaChat } from "./MediaCommunication.js";
import { castScreenStream } from "./screen/screensharing.js";

async function init() {
    //展示本地摄像头到屏幕
    let userMediaSteam = await getUserMeida();
    document.querySelector('video').srcObject = userMediaSteam

    //连接端到端音视频通话
    connctP2PAudioVideoMediaChat();

    //展示通信控件
    showControls();

    //展示屏幕共享
    let screenVideo = document.getElementById('screen-video');
    castScreenStream(screenVideo);

}

init();