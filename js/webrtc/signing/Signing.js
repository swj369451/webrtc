/**
 * 信令服务器
 */
import { collectCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { receiveMediaFormatAnswer, receiveMediaOffer } from "../negotiation/MediaNegotiation.js";
import { disconnect } from "../connction/PeerConnctor.js"

let socketServerUrl = "https://signaling.ppamatrix.com:1446";
let socket;
let isConnected = false;
let isLogin = false;
let isConnecting =false;
let name;
/**
 * 连接socket服务器
 */
function connectSocketServer(identification,peerInfo) {

    // if (isConnected) {
    //     return;
    // }
    socket = io.connect(socketServerUrl);
    socket.identification=identification
    socket.on('connect', function () {
        loginSinaling(this.identification,peerInfo);
    });
    socket.on('log', function (array) {
        // console.log.apply(console, array);
    });
    socket.on('message', function (message) {
        if (window.events['onMessage'] != undefined && window.events['onMessage'] != null) {
            window.events['onMessage'](message);
        }
        console.log(`收到来自${message.from}的${message.type}类型消息`);
        if (message.type === 'offer') {
            receiveMediaOffer(message);
        } else if (message.type === 'answer') {
            receiveMediaFormatAnswer(message);
        } else if (message.type === 'candidate') {
            collectCandidateTransportAddresses(message);
            // console.log(`【收到的ice】=${message.candidate}`)
        } else if (message.type === 'disconnect') {
            disconnect(message.from);
        }
    });
    socket.on('logined', function () {
         isLogin = true;
        console.log('设备登录成功');
        if (window.events['onLogined'] != undefined && window.events['onLogined'] != null) {
            window.events['onLogined']('设备登录成功');
        }
        //isLogin = true;
    });
    socket.on('reconnect_failed', function (e) {
        console.log("重连失败:" + e);
    });
    socket.on('reconnect', function (e) {
        console.log("成功重连:" + e);
        isConnected = true;
		isConnecting=false;
        loginSinaling(this.identification);
    });
    socket.on('reconnecting', function (e) {
        console.log("正在重连:" + e);
    });
    socket.on('anything', function (e) {
        console.log(`${Date()}【${this.PeerIdentification}】` + e);
    });
    socket.on('disconnect', function () {
        console.log("断开连接:");
        isLogin = false;
        isConnected = false;
        tryConnect(this);
    });
}
function tryConnect(socket) {
    console.log("检测并尝试重新连接");
    if (!socket.connected) {
        let tryConnect = setInterval(function () {
			if(!isConnecting){
				isConnecting=true;
				console.log("重新连接中");
				socket.connect();
            }
            if (socket.connected && isConnected && isLogin) {
                console.log("已经重新连接，断开检测");
                clearInterval(tryConnect)
            }
        }, 5000);
    }

}
function loginSinaling(identification,peerInfo) {
    if(peerInfo==undefined){
            peerInfo=""
        }
    console.log(identification+"登录信令服务器");
    socket.emit('login', identification,peerInfo);
    // this.identification = identification;
    name = identification;
}

function sendMessage(message) {
    if (isConnected && (name != null || name != undefined || name !== "")) {
        message.from = name;
    }
    socket.emit('message', message);
}

function sendDiconnect(PeerIdentification) {
    sendMessage({
        type: 'disconnect',
        from: window.identification,
        to: PeerIdentification,
    });
}

function check() {
    socket.emit('check');
}



export { sendMessage, connectSocketServer, socket, sendDiconnect, check }
