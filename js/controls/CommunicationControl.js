import { sharingScreen } from "../MediaCommunication.js";

/**
 * 展示控件
 */
function showControls() {
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

    initScreensharing();
}
/**
 * 初始化屏幕共享功能
 */
function initScreensharing() {
    let screensharingBtn = document.getElementById("screensharingBtn");
    screensharingBtn.addEventListener('click', function(event) {
        let btnName;
        if (event.currentTarget.innerText === "开启屏幕共享") {
            btnName = "关闭屏幕共享";
            sharingScreen(11);
        } else {
            btnName = "开启屏幕共享"
        }
        event.currentTarget.innerText = btnName;

    });
}

export { showControls }