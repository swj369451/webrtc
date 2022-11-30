'use strict';
import { distributedVideo, initialize } from "https://webrtccommunication.ppamatrix.com:1447/rtc/js/Distributed.js";
import { P2PComunication } from "./webrtc/MediaCommunication.js";


let comunication
let json = []
async function init(dw, dh, id, parentId) {

    let sw = 572;
    let sh = 303;

    // let dw = 300;
    // let dh = 150;
    json.push({
        "canvasId": "canvas1", "sx": "200", "sy": "81","sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas2", "sx": 200 + (sw + 2) * 1, "sy": "81","sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas3", "sx": 200 + (sw + 2) * 2, "sy": "81","sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas4", "sx": "200", "sy": 81 + (sh + 2) * 1,"sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas5", "sx": 200 + (sw + 2) * 1, "sy": 81 + (sh + 2) * 1,"sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas6", "sx": 200 + (sw + 2) * 2, "sy": 81 + (sh + 2) * 1,"sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas7", "sx": "200", "sy": 81 + (sh + 2) * 2,"sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas8", "sx": 200 + (sw + 2) * 1, "sy": 81 + (sh + 2) * 2,"sw":sw,"sh":sh
    });
    json.push({
        "canvasId": "canvas9", "sx": 200 + (sw + 2) * 2, "sy": 81 + (sh + 2) * 2,"sw":sw,"sh":sh
    });

    let randomNumber = Math.random();
    comunication = new P2PComunication(randomNumber);
    let video;


    video = document.createElement("video");
    video.setAttribute("playsinline", "true");
    video.setAttribute("id", `video`);
    video.setAttribute("muted", "true");
    video.muted = true;
    document.getElementById(parentId).append(video);
    video.style.display = "none";

    comunication.addEventListener("onAddStream", (stream, identification) => {
        video.addEventListener('play', function () {
            // video.style.display = "none";
            var $this = this; //cache
            (function loop() {
                if (!$this.paused && !$this.ended) {

                    json.forEach(function (item) {
                        let canvas = document.getElementById(item.canvasId).getContext('2d');
                        canvas.drawImage($this, item.sx, item.sy, item.sw, item.sh, 0, 0, dw, dh);
                    })
                    setTimeout(loop, 1000 / 60); // drawing at 30fps
                }
            })();
        }, 0);

        video.addEventListener("canplay", function () {
            this.muted = true;
            if (video.paused) {
                video.play();
            }
        });
    });
    comunication.addEventListener("onLogined", (message) => {
        comunication.connectPeerMedia(id, "video", "DisplayMedia", { video: false, audio: false });
    });
}



// init(300, 150, "4", "app");

initialize("4", "app");
distributedVideo("canvas10", 0,0,100,100);
distributedVideo("canvas9", 100,200,100,100);
export default { init }
