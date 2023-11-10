'use strict';
import { showControls } from "./controls/CommunicationControl.js";
import { P2PComunication } from "./webrtc/MediaCommunication.js";
import { createVideoTag, deleteVideoTag } from "./tagTool.js";
import { getMedia } from "./webrtc/media/UserMedia.js";
// import { reportInfo } from "./report/report.js";
import { getConnector } from "./webrtc/connction/PeerConnctor.js";

async function init() {

    // 展示本地摄像头到屏幕
    getMedia("UserMedia")
        .then(stream => {
            // console.log(stream)
            document.getElementById('local-camera').srcObject = stream
        });

    //展示屏幕共享
    // getMedia("DisplayMedia")
    //     .then(stream => {
    //         console.log(stream)
    //         document.getElementById('local-screen').srcObject = stream
    //     })
    //     .catch((error) => {
    //         console.error("getUserMedia failed:", error);
    //     });

    let identification = "0002";
    let comunication = new P2PComunication(identification);
    comunication.addEventListener("onLogined", (message) => {
        $('#info').text($('#info').text() + message)
    });
    comunication.addEventListener("onAddStream", (stream, identification) => {
        console.log("获取流");
        let video = document.getElementById("peep")
        video.srcObject = stream;
    });
    comunication.addEventListener("onDiscounnect", (identification) => {
        deleteVideoTag(identification);
    });
    comunication.addEventListener("onRemoteStateChange", (identification, state) => {

    });

    $("#connect").click(function (e) {
        let identification = document.getElementById("input").value;
        let connectType = $('input[name="connectType"]:checked').val();
        let share = $('input[name="share"]:checked').val() === "1" ? true : false;
        // comunication.connectPeer(identification, connectType, share);
        let localConstraints = {
            audio: true,
            video: true
        }
        if (!share) {
            localConstraints = {
                audio: false,
                video: false
            }
        }

        let videoTag = createVideoTag(identification);
        comunication.connectPeerMedia(identification, `video-${identification}`, connectType, localConstraints);
        comunication.muted(identification);
        const button = document.getElementById("muted");
        // 添加点击事件处理函数
        button.addEventListener("click", function () {
            comunication.muted(identification);
        });

        const open = document.getElementById("open");
        // 添加点击事件处理函数
        open.addEventListener("click", function () {
            comunication.open(identification);
        });
    });
    //展示通信控件
    showControls();
}
init();
//格式化日期
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default { init }
