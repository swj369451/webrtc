
调用方法
import {P2PComunication} from "https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/MediaCommunication.js";
let comunication = new P2PComunication(identification);
comunication.addEventListener("onLogined", (message) => {
    comunication.connectPeerMedia(identification, `video-${identification}`, "UserMedia", {audio: false,video: false});
});
