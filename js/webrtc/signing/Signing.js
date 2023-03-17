/**
 * 信令服务器
 */
import { collectCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { receiveMediaFormatAnswer, receiveMediaOffer } from "../negotiation/MediaNegotiation.js";


let socketServerUrl = "https://signaling.ppamatrix.com:1446";
let socket;
let isConnected;
let name; 1
/**
 * 连接socket服务器
 */
function connectSocketServer(identification) {

    if (isConnected) {
        return;
    }
    socket = io.connect(socketServerUrl);

    socket.on('connect', function () {
        console.log("socket服务器连接成功");
        socket.emit('login', identification);
        this.identification = identification;
        name = identification;
        isConnected = true;
    });
    socket.on('log', function (array) {
        // console.log.apply(console, array);
    });
    socket.on('message', function (message) {
        console.log(`收到来自${message.from}的${message.type}类型消息`);
        if (message.type === 'offer') {
            receiveMediaOffer(message);
        } else if (message.type === 'answer') {
            receiveMediaFormatAnswer(message);
        } else if (message.type === 'candidate') {
            collectCandidateTransportAddresses(message);
            // console.log(`【收到的ice】=${message.candidate}`)
        } else if (message.type === 'disconnect') {
            // disconnect(message.from);
        }
    });
    socket.on('logined', function () {
        console.log('设备登录成功');
        if (window.events['onLogined'] != undefined && window.events['onLogined'] != null) {
            window.events['onLogined']('设备登录成功');
        }
    });
    socket.on('reconnect_failed', function (e) {
        console.log("重连失败:" + e);
    });
    socket.on('reconnect', function (e) {
        console.log("成功重连:" + e);
        // login(this.peerid);
        login(this.identification);
    });
    socket.on('reconnecting', function (e) {
        console.log("正在重连:" + e);
    });
    socket.on('anything', function (e) {
        console.log(`${Date()}【${this.PeerIdentification}】` + e);
    });
}
function login(identification) {
    console.log("socket服务器连接成功");
    socket.emit('login', identification);
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