// import { roomNumber } from "../signing/Signing.js";

import { getMedia } from "../webrtc/media/UserMedia.js";
import { startRecord, stopRecord } from "../record/recordTest.js";
import { check } from "../webrtc/signing/Signing.js";

/**
 * 展示控件
 */
function showControls() {
    //开关画面
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

    //查询所有登录用户
    let checkBtn = document.getElementById("check");
    checkBtn.addEventListener('click', function(event) {
        check();
    });

    //开关声音
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

    //ice检查
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

    //录制
    let recordBtn = document.querySelector('button#record');
    if (recordBtn != null) {
        recordBtn.addEventListener('click', async(event) => {
            let buttonText = event.currentTarget.innerText;
            if (buttonText === "开启录制") {
                event.currentTarget.innerText = "停止录制";
                let stream = await getMedia("UserMedia");
                startRecord(stream);
                
            } else {
                event.currentTarget.innerText = "开启录制";
                stopRecord();
                
            }
    
        });
    }
    // //播放
    // var input = document.getElementById("file"); //input file
    // input.onchange = function(event) {
    //     var file = event.currentTarget.files[0]
    //     if (file) {
    //         var reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = function(e) {
    //             let video = document.getElementById("screen-video");
    //             video.src = e.target.result;
    
    //         }
    //     }
    // }



}

export { showControls }