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
import { establishCommunicationConntor, addStream, PeerConnectionList, getConnector, negotiate } from "./connction/PeerConnctor.js"
import { getMedia, getUserMeida } from "./media/UserMedia.js";
import { getScreenStream } from "./screen/screensharing.js";
import { connectSocketServer } from "./signing/Signing.js";



/**
 * 共享屏幕
 * 屏幕共享给所有人，指定人，指定房间
 */
async function sharingScreen(roomCode) {
    console.log(`屏幕共享给【${roomCode}】房间`)
    let screenStream = await getScreenStream();
    addStream(screenStream, Array.from(PeerConnectionList.values()));
}

/**
 * 连接到信令
 * 接收到新的流,流来自于哪里
 */
class P2PComunication {
    constructor(indentification) {
        if (indentification == null || indentification == undefined || indentification === "") {
            console.error("通信名不能为空");
            return;
        }
        this.indentification = indentification;
        window.indentification = indentification;
        this.events = new Map();
        window.events = this.events;
        connectSocketServer(this.indentification);
    }
    addEventListener(eventName, event) {
        this.events[eventName] = event;
    }

    /**
     * 连接单个设备
     * @param {String} indentification  对方通信名
     * @param {String} type  通信类型【UserMedia】音视频流通信，【DisplayMedia】屏幕共享
     * @param {Boolean} sender  是否发送本地媒体，默认发送
     */
    async connectPeer(indentification, type, sender = ture) {
        //判断参数
        if (type == undefined) {
            console.error("通信类型不能为空");
        }
        console.log(`与${indentification}进行${type}通信,是否发送本地媒体【${sender}】`);

        //获取连接器，添加流
        let pc = getConnector(indentification);
        if (sender) {
            let stream = await getMedia(type);
            pc.addStream(stream);
        }
        // type = undefined;
        //协商
        negotiate(pc, type);
    }

    /**
     * 连接到房间
     * @param {*} roomNumber   房间号
     * @param {*} type   通信类型【UserMedia】音视频流通信，【DisplayMedia】屏幕共享
     */
    connectRoom(roomNumber, type) {

        if (type === "UserMedia") {
            console.log(`连接端到端音视频通话`);
            establishCommunicationConntor(roomNumber, indentification);
        } else if (type === "DisplayMedia") {
            console.error("共享桌面到房间开发中");
        } else {
            console.error(`连接类型【${type}】不支持`);
        }

    }

}


export { sharingScreen, P2PComunication }