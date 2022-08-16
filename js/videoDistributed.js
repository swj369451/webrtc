'use strict';
import { P2PComunication } from "./webrtc/MediaCommunication.js";

async function init(dw, dh, id, parentId) {

    let sw = 572;
    let sh = 303;

    // let dw = 300;
    // let dh = 150;

    let json = [{
        "canvasId": "canvas1", "sx": "200", "sy": "81"
    },
    {
        "canvasId": "canvas2", "sx": 200 + (sw + 2) * 1, "sy": "81"
    },
    {
        "canvasId": "canvas3", "sx": 200 + (sw + 2) * 2, "sy": "81"
    },
    {
        "canvasId": "canvas4", "sx": "200", "sy": 81 + (sh + 2) * 1
    },
    {
        "canvasId": "canvas5", "sx": 200 + (sw + 2) * 1, "sy": 81 + (sh + 2) * 1
    },
    {
        "canvasId": "canvas6", "sx": 200 + (sw + 2) * 2, "sy": 81 + (sh + 2) * 1
    },
    {
        "canvasId": "canvas7", "sx": "200", "sy": 81 + (sh + 2) * 2
    },
    {
        "canvasId": "canvas8", "sx": 200 + (sw + 2) * 1, "sy": 81 + (sh + 2) * 2
    },
    {
        "canvasId": "canvas9", "sx": 200 + (sw + 2) * 2, "sy": 81 + (sh + 2) * 2
    },
    ];



    let identification = Math.random();
    let comunication = new P2PComunication(identification);
    let video;


    video = document.createElement("video");
    // video.setAttribute("autoplay", "autoplay");
    video.setAttribute("playsinline", "true");
    video.setAttribute("id", `video`);
    video.setAttribute("muted", "true");
    // video.setAttribute("style", "width: 0px; height:0px");
    video.setAttribute("controls", "true");
    video.muted=true;
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
                        canvas.drawImage($this, item.sx, item.sy, sw, sh, 0, 0, dw, dh);
                    })
                    setTimeout(loop, 1000 / 60); // drawing at 30fps
                }
            })();
        }, 0);

        video.addEventListener("canplay", function () {
            if (video.paused) {
                video.play();
            }
        });
    });
    comunication.addEventListener("onLogined", (message) => {
        comunication.connectPeerMedia(id, "video", "DisplayMedia", { video: false, audio: false });
    });







}

init(300, 150, "2", "app");

export default { init }
