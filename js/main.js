/*
 * @Author: swj369451 swj369451@163.com
 * @Date: 2022-05-27 17:01:14
 * @LastEditors: swj369451 swj369451@163.com
 * @LastEditTime: 2022-07-03 14:43:46
 * @FilePath: \webrtc\js\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';
import { showControls } from "./controls/CommunicationControl.js";
import { getUserMeida } from "./media/UserMedia.js";
import { P2PComunication } from "./MediaCommunication.js";
import { reocord } from "./record/recordTest.js";
import { castScreenStream } from "./screen/screensharing.js";
import { getLocalValue, setLocalValue } from "./storage/storage.js";

const COMMUNICATION_IDENTIFICATION = "communicationIdentification";

async function init() {

    let roomNumber = "1111";


    //展示本地摄像头到屏幕
    let userMediaSteam = await getUserMeida();
    document.querySelector('video').srcObject = userMediaSteam


    let indentification = getIdentification();

    //连接端到端音视频通话
    /**
     * 
     */
    let comunication = new P2PComunication(indentification);
    comunication.addEventListener("onLogined", (message) => {
        $('#info').text($('#info').text() + message)
    });
    // comunication.connectPeer();
    comunication.connectRoom(roomNumber, 'UserMedia');

    //展示通信控件
    showControls();

    //展示屏幕共享
    // let screenVideo = document.getElementById('screen-video');
    // castScreenStream(screenVideo);

    //24小时录制
    // reocord(userMediaSteam);
}
/**
 * 查询通信昵称
 */
function getIdentification() {
    let indentification = getLocalValue(COMMUNICATION_IDENTIFICATION);
    if (indentification == null || indentification == undefined) {
        indentification = prompt("请输入通信昵称");
        while (indentification == null || indentification == undefined || indentification === "") {
            indentification = prompt("请输入通信昵称");
        }
        setLocalValue(COMMUNICATION_IDENTIFICATION, `${indentification}#${getUUID()}`);
    } else {
        indentification = indentification.substring(0, indentification.indexOf("#"));
    }
    console.log(`用户通信昵称和唯一标识${indentification}`);
    $("#indentification").text($("#indentification").text() + indentification);
    return indentification;
}

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

init();