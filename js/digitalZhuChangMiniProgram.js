'use strict';
import { showControls } from "./controls/CommunicationControl.js";
// import { getUserMeida } from "./media/UserMedia.js";
import { P2PComunication } from "./MediaCommunication.js";
import { reocord } from "./record/recordTest.js";
import { getLocalValue, setLocalValue } from "./storage/storage.js";
import { createVideoTag, deleteVideoTag } from "./tagTool.js";




async function init() {

    let indentification = guid();
    $("#indentification").text($("#indentification").text() + indentification);

    let comunication = new P2PComunication(indentification);
    comunication.addEventListener("onLogined", (message) => {
        $('#info').text($('#info').text() + message)
    });
    comunication.addEventListener("onAddStream", (stream, indentification) => {
        console.log("获取流");
        let videoTag = document.getElementById("gum-local");
        videoTag.srcObject = stream;
    });
    comunication.addEventListener("onDiscounnect", (indentification) => {
        deleteVideoTag(indentification);
    });


    let PeerConnctorIdentification = getQueryVariable("doorplateId");
    comunication.connectPeer(PeerConnctorIdentification, "UserMedia", false);

}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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