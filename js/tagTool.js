let videoTagMap = new Map();
let app = document.getElementById("app");
function addVideo(socketId) {


    let divTag = document.createElement("div");
    divTag.setAttribute("id", socketId + "-div");
    addVideoTag(divTag, socketId);
    addConnectStateTag(divTag, socketId);
    app.append(divTag);
}

function addVideoTag(divTag, socketId) {
    let videoTag = document.createElement("video");

    videoTag.setAttribute("autoplay", "autoplay");
    videoTag.setAttribute("playsinline", "true");
    videoTag.setAttribute("id", socketId);
    videoTag.setAttribute("style", "width: 550px;");
    divTag.appendChild(videoTag);
    videoTagMap.set(socketId, videoTag);
}
function addConnectStateTag(divTag, socketId) {
    let messaeg = document.createElement("span");
    messaeg.setAttribute("id", socketId + "-connectState");
    divTag.append(messaeg);
}
function getVideoTag(socketId) {
    return videoTagMap.get(socketId);
}
function removeVideoTag(socketId) {
    document.getElementById(socketId).remove();
    document.getElementById(socketId + "-div").remove();
    document.getElementById(socketId + "-connectState").remove();
    videoTagMap.delete(socketId);
}

export { addVideo, getVideoTag, removeVideoTag }