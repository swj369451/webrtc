import { createPeerConnector } from "./connction/PeerConnctor.js";
import { getUserMeida } from "./media/UserMedia.js";
import { connctP2PAudioVideoMediaChat } from "./MediaCommunication.js";

async function init() {
    let userMediaSteam = await getUserMeida();
    document.querySelector('video').srcObject = userMediaSteam

    //连接端到端音视频通话
    connctP2PAudioVideoMediaChat();

}

let videoBtn = document.getElementById("videoBtn");
videoBtn.addEventListener('click', function(event) {
    let text = event.currentTarget.innerText;
    let changeText = "";
    let flag = true;
    if (text === "关闭画面") {
        changeText = "开启画面";
        flag = false;

    } else {
        changeText = "关闭画面";
        flag = true;
    }

    event.currentTarget.innerText = changeText;
    window.PeerConnections.forEach(function(ps) {
        ps.getSenders().forEach(function(sender) {
            if (sender.track.kind === "video") {
                sender.track.enabled = flag;
            }
        })
    })

});

let audioBtn = document.getElementById("audioBtn");
audioBtn.addEventListener('click', function(event) {
    let text = event.currentTarget.innerText;
    let changeText = "";
    let flag = true;
    if (text === "关闭声音") {
        changeText = "开启声音";
        flag = false;
    } else {
        changeText = "关闭声音";
        flag = true;
    }

    event.currentTarget.innerText = changeText;
    window.PeerConnections.forEach(function(ps) {
        ps.getSenders().forEach(function(sender) {
            if (sender.track.kind === "audio") {
                sender.track.enabled = flag;
            }
        })
    })

});

let iceBtn = document.getElementById("iceBtn");
let container = document.getElementById("container");
iceBtn.addEventListener('click', function(event) {
    let text = event.currentTarget.innerText;
    let changeText = "";
    let flag = 'block';
    if (text === "隐藏ice信息") {
        changeText = "显示ice信息";
        flag = 'none';
    } else {
        changeText = "隐藏ice信息";
        flag = 'block';
    }

    event.currentTarget.innerText = changeText;
    container.setAttribute("style", `display:${flag};`)

});


init();