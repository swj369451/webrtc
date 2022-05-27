import { getUserMeida } from "./media/UserMedia.js";
import { connctP2PAudioVideoMediaChat } from "./MediaCommunication.js";



async function init() {
    let userMediaSteam = await getUserMeida();
    document.querySelector('video').srcObject = userMediaSteam

    //连接端到端音视频通话
     connctP2PAudioVideoMediaChat();
}


init();


