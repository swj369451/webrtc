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
import { createVideoTag, deleteVideoTag } from "./tagTool.js";

// const COMMUNICATION_IDENTIFICATION = "communicationIdentification";

async function init() {

    //展示本地摄像头到屏幕
    let userMediaSteam = await getUserMeida();
    document.querySelector('video').srcObject = userMediaSteam


    let indentification = prompt("请输入通信昵称");
    $("#indentification").text($("#indentification").text() + indentification);

    let comunication = new P2PComunication(indentification);
    comunication.addEventListener("onLogined", (message) => {
        $('#info').text($('#info').text() + message)
    });
    comunication.addEventListener("onAddStream", (stream, indentification) => {
        console.log("获取流");
        let videoTag = createVideoTag(indentification);
        videoTag.srcObject = stream;
    });
    comunication.addEventListener("onDiscounnect", (indentification) => {
        deleteVideoTag(indentification);
    });

    $("#connect").click(function(e) {
        let indentification = document.getElementById("input").value;
        comunication.connectPeer(indentification, "UserMedia", false);
    });

    //展示通信控件
    showControls();

    //展示屏幕共享
    // let screenVideo = document.getElementById('screen-video');
    // castScreenStream(screenVideo);

    //24小时录制
    // reocord(userMediaSteam);
}


init();