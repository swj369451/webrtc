/*
 * @Author: swj369451 swj369451@163.com
 * @Date: 2022-05-27 17:01:14
 * @LastEditors: swj369451 swj369451@163.com
 * @LastEditTime: 2022-07-03 15:39:22
 * @FilePath: \webrtc\js\MediaCommunication.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 音视频媒体通信
 */
import { getConnector, negotiate, disconnect } from "./connction/PeerConnctor.js"
import { getMedia } from "./media/UserMedia.js";
import { connectSocketServer } from "./signing/Signing.js";


/**
 * 连接到信令
 * 接收到新的流,流来自于哪里
 */
class P2PComunication {

    constructor(identification, peerInfo) {
        //设置标识名
        if (identification == null || identification == undefined || identification === "") {
            console.error("通信名不能为空");
            return;
        }
        this.identification = identification;
        window.identification = identification;
        //设置事件
        this.events = new Map();
        window.events = this.events;

        //连接信令
        connectSocketServer(this.identification, peerInfo);

        //安卓设备连接信令，目前只有共享桌面功能
        androidconsolein(identification);
    }
    /**
     * 添加事件,可执行的事件有
     * onconsoleined
     * onAddStream
     * onDiscounnect
     * @param {*} eventType 事件类型
     * @param {*} fun 执行的函数
     */
    addEventListener(eventType, fun) {
        this.events[eventType] = fun;
    }



    /**
     * 连接单个设备
     * @param {String} identification  对方通信名
     * @param {String} type  通信类型【UserMedia】音视频流通信，【DisplayMedia】屏幕共享
     * @param {Boolean} sender  是否发送本地媒体，默认发送
     */
    async connectPeer(identification, type, sender) {
        if (this.identification === identification) {
            console.warn(`无法连接自己`);
            return;
        }

        //判断参数
        if (type == undefined) {
            console.error("通信类型不能为空");
        }
        console.info(`与${identification}进行${type}通信,是否发送本地媒体【${sender}】`);

        //获取连接器，添加流
        let pc = await getConnector(identification);
        if (sender) {
            let stream = await getMedia(type);
            pc.addStream(stream);
        }
        // type = undefined;
        //协商
        await negotiate(pc, type);




    }
    /**
     * 连接单个设备
     * @param {String} id  对方通信名
     * @param {String} type  通信类型【UserMedia】音视频流通信，【DisplayMedia】屏幕共享
     * @param {Boolean} sender  是否发送本地媒体，默认发送
     */
    async connectPeerMedia(id, videoLabelId, mediaType,
        localConstraints = {
            audio: true,
            video: true
        },
        remoteConstraints = {
            audio: true,
            video: true
        }) {

        //判断参数
        if (this.identification === id) {
            console.warn(`无法连接自己`);
            return;
        }
        if (mediaType == undefined || mediaType == "") {
            console.error("通信类型不能为空");
            return;
        }
        let videoLabel = document.getElementById(videoLabelId);
        if (videoLabel == undefined || videoLabel == null) {
            console.error(`找不到视频标签[id=${videoLabelId}]`);
            return;
        }
        videoLabel.setAttribute("muted", "muted");
        let loadstart = false;
        videoLabel.addEventListener("loadstart", function () {
            loadstart = true;
        });
        videoLabel.addEventListener("canplay", function () {
            videoLabel.muted = true;
            if (videoLabel.paused && loadstart) {

                videoLabel.play();
            }
        });


        console.info(`与${id}进行${mediaType}通信,本地媒体限制【${localConstraints}】远程媒体限制【${remoteConstraints}】`);

        //获取连接器，添加流
        let pc = await getConnector(id);
        pc.videoLabel = videoLabel;
        pc.localConstraints = localConstraints;
        pc.remoteConstraints = remoteConstraints;


        if (!isAddStream(pc, mediaType)) {
            let stream = await getMedia(mediaType, localConstraints);
            if (stream != null && stream != undefined) {
                pc.addStream(stream);
            }
        } else {
            console.info(`已经和${id}进行${mediaType}通信`);
            return;
        }

        //协商
        negotiate(pc, mediaType);

        setTimeout(function () {

            if (pc.signalingState === "have-local-offer") {
                if (pc.videoLabel != null && pc.videoLabel != undefined) {
                    pc.videoLabel.style = "background-image: url(https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/images/trouble_chart.png); background-position: center center;background-size: cover;";
                }
            }
        }, 5000)
    }
    /**
     * 关闭与对方的连接
     * @param {*} identification 识别码
     */
    closePeer(identification) {
        disconnect(identification);
    }

    async muted(identification) {
        let pc =await getConnector(identification);
        // 获取本地音频轨道
        const audioTracks = pc.getSenders().map(sender => sender.track);

        // 设置麦克风静音
        audioTracks.forEach(track => {
            track.enabled = false; // 将麦克风静音
        });
    }

    async open(identification) {
        let pc =await getConnector(identification);
        // 获取本地音频轨道
        const audioTracks = pc.getSenders().map(sender => sender.track);

        // 设置麦克风静音
        audioTracks.forEach(track => {
            track.enabled = true; // 将麦克风静音
        });
    }

}
function isAddStream(pc, mediaType) {
    let result = false;
    pc.getLocalStreams().forEach(element => {
        if (element.type === mediaType) {
            result = true;
        }
    });
    return result;
}
function androidconsolein(identification) {
    let androidWebRTC = window.AndroidWebRTC;
    if (androidWebRTC != undefined) {
        androidWebRTC.init(identification);
    }
}

export { P2PComunication }
