# webrtc
webrtc
# Release notes
- v0.0.1
初始化版本
- v0.0.2
pc从集合中取出来时多了判空

- v0.0.3
重新上传了一下本地的文件，不知道更新了什么


1.导入依赖
import {
	P2PComunication
} from "https://webrtccommunication.ppamatrix.com:1447/rtc/js/webrtc/MediaCommunication.js"

2.创建连接对象，传入自己的id
let p2PComunication = new P2PComunication("1110-equipment");

3.监听已登录后连接对象
p2PComunication.addEventListener("onLogined", (message) => {
        //id 对方id
        //videoLabelId 视频标签，不能包含source
        //mediaType 媒体类型【UserMedia】用户媒体(摄像头)，【DisplayMedia】屏幕媒体
        //localConstraints 本地是否传输媒体，默认为音视频都传
        //remoteConstraints 对等方是否传输媒体，默认为音视频都传
        p2PComunication.connectPeerMedia(id, videoLabelId, mediaType,
        localConstraints = {
            audio: true,
            video: true
        },
        remoteConstraints = {
            audio: true,
            video: true
        })

});