'use strict';
import { showControls } from "./controls/CommunicationControl.js";
import { P2PComunication } from "./webrtc/MediaCommunication.js";
import { createVideoTag, deleteVideoTag } from "./tagTool.js";
import { getMedia } from "./webrtc/media/UserMedia.js";
// import { reportInfo } from "./report/report.js";
import { getConnector } from "./webrtc/connction/PeerConnctor.js";
import { check } from "./webrtc/signing/Signing.js";

async function init(info) {

    //展示本地摄像头到屏幕
    let userMediaSteam = await getMedia("UserMedia");
    document.querySelector('video').srcObject = userMediaSteam

    //展示屏幕共享
    // let screenVideo = document.getElementById('screen-video');
    // castScreenStream(screenVideo);
    // let identification = 1111;
    let identification = prompt("请输入通信昵称");
    $("#identification").text($("#identification").text() + identification);

    let comunication = new P2PComunication(identification);

    
    comunication.addEventListener("onLogined", (message) => {
        $('#info').text($('#info').text() + message)
    });
    comunication.addEventListener("onAddStream", (stream, identification) => {
        console.log("获取流");

        if(info!=null){
            info.forEach(element => {
                if(element.identification==identification){
                    document.getElementById(element.videoId).srcObject=stream;
                }
                
            });
        }
        let pc = getConnector(identification);
        // reportInfo(pc,identification);
        let video = document.createElement("video");
        video.setAttribute("autoplay", "autoplay");
        video.setAttribute("playsinline", "true");
        video.setAttribute("id", `video-${identification}`);
        video.setAttribute("style", "width: 20vw;");
        pc.videoLabel=video
    });
    comunication.addEventListener("onDiscounnect", (identification) => {
        deleteVideoTag(identification);
    });
    comunication.addEventListener("onMessage", (message) => {
        console.log()
    });
    

    $("#connect").click(function (e) {
        let identification = document.getElementById("input").value;
        let connectType = $('input[name="connectType"]:checked').val();
        let share = $('input[name="share"]:checked').val()==="1"?true:false;
        // comunication.connectPeer(identification, connectType, share);
        let localConstraints = {
            audio: true,
            video: true
        }
        if(!share){
            localConstraints = {
                audio: false,
                video: false
            }
        }

        let videoTag = createVideoTag(identification);
        comunication.connectPeerMedia(identification,`video-${identification}`,connectType,localConstraints);
    });
    $("#signInfo").click(function (e) {
       check();
    });
    if(info!=null){
        info.forEach(element => {
            comunication.connectPeer(element.identification, "UserMedia", false);
        });
    }
   

    //展示通信控件
    showControls();
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
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

export default{init}