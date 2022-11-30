import { P2PComunication } from "./webrtc/MediaCommunication.js";
let json = []
let comunication;
function initialize(id, parentId){
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
                        canvas.drawImage($this, item.sx, item.sy, item.sw, item.sh, 0, 0, item.sw, item.sh);
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


/**
 * 
 * @param {*} canvasId canvaseId
 * @param {*} sx x轴偏移量
 * @param {*} sy y轴偏移量
 * @param {*} sw 截取宽度，canvas宽度和截取的宽度一样，不然会变形
 * @param {*} sh 截取高度，canvas高度和截取的高度一样，不然会变形
 */
 function distributedVideo(canvasId, sx, sy,sw,sh) {
    json.push({
        "canvasId": canvasId, "sx": sx, "sy": sy,"sw":sw,"sh":sh
    });
}

export {initialize,distributedVideo}