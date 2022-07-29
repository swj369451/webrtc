/**
 * 信令服务器
 */

import { collectCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { receiveMediaFormatAnswer, receiveMediaOffer } from "../negotiation/MediaNegotiation.js";

let socketServerUrl = "https://signaling.ppamatrix.com:1446";
let socket;
let connected;
let name;
/**
 * 连接socket服务器
 */
function connectSocketServer(identification) {

   

    if (connected) {
        return;
    }
    socket = io.connect(socketServerUrl);

    socket.on('connect', function() {
        console.log("socket服务器连接成功");
        socket.emit('login', identification);
        name = identification;
        connected = true;
    });
    socket.on('log', function(array) {
        // console.log.apply(console, array);
    });
    socket.on('message', function(message) {
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

    socket.on('logined', function() {
        console.log('设备登录成功');
        if (window.events['onLogined'] != undefined && window.events['onLogined'] != null) {
            window.events['onLogined']('设备登录成功');
        }
    });
}

function sendMessage(message) {
    if (connected && (name != null || name != undefined || name !== "")) {
        message.from = name;
    }
    // console.log('Client sending message: ', message);
    socket.emit('message', message);
}

function sendDiconnect(PeerIdentification) {
    sendMessage({
        type: 'disconnect',
        from: window.indentification,
        to: PeerIdentification,
    });
}

function check() {
    socket.emit('check');
}



export { sendMessage, socket, connectSocketServer, sendDiconnect, check }