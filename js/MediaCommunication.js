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
    constructor(identification) {

        //设置标识名
        if (identification == null || identification == undefined || identification === "") {
            console.error("通信名不能为空");
            return;
        }
        this.identification = identification;
        window.indentification = identification;
        //设置事件
        this.events = new Map();
        window.events = this.events;

        //连接信令
        connectSocketServer(this.identification);

        //安卓设备连接信令，目前只有共享桌面功能
        androidLogin(identification);
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
    async connectPeer(indentification, type, sender) {
        if (this.identification === indentification) {
            console.warn(`无法连接自己`);
            return;
        }

        //判断参数
        if (type == undefined) {
            console.error("通信类型不能为空");
        }
        console.log(`与${indentification}进行${type}通信,是否发送本地媒体【${sender}】`);

        //获取连接器，添加流
        let pc = getConnector(indentification);
        if (sender==="1") {
            let stream = await getMedia(type);
            pc.addStream(stream);
        }
        // type = undefined;
        //协商
        negotiate(pc, type);
    }
    closePeer(indentification) {
        disconnect(indentification);
    }

    // /**
    //  * 连接到房间
    //  * @param {*} roomNumber   房间号
    //  * @param {*} type   通信类型【UserMedia】音视频流通信，【DisplayMedia】屏幕共享
    //  */
    // connectRoom(roomNumber, type) {

    //     if (type === "UserMedia") {
    //         console.log(`连接端到端音视频通话`);
    //     } else if (type === "DisplayMedia") {
    //         console.error("共享桌面到房间开发中");
    //     } else {
    //         console.error(`连接类型【${type}】不支持`);
    //     }

    // }

}
function androidLogin(identification){
    let androidWebRTC = window.AndroidWebRTC;
    if(androidWebRTC!=undefined){
        androidWebRTC.init(identification);
    }
}

export { P2PComunication }