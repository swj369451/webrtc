/**
 * 信令服务器
 */

import { manJoined } from "../connction/PeerConnctor.js";
import { collectCandidateTransportAddresses } from "../negotiation/CandidateNegotiate.js";
import { receiveMediaFormatAnswer, receiveMediaOffer } from "../negotiation/MediaNegotiation.js";

let socketServerUrl = "https://signaling.ppamatrix.com:1446";
let roomNumber;
let socket;

/**
 * 加入通信房间
 */
function joinCommunicationRoom(roomNumber, indentification) {
    roomNumber = roomNumber;
    if (socket == undefined) {
        connectSocketServer(roomNumber, indentification);
    }

}

/**
 * 连接socket服务器
 */
function connectSocketServer(roomNumber, indentification) {
    socket = io.connect(socketServerUrl);

    socket.on('connect', function() {
        console.log("socket服务器连接成功");
        socket.emit('create or join', roomNumber);
        socket.emit('login', indentification);
    });

    socket.on('created', function(room) {
        console.log('Created room ' + room);
    });
    socket.on('full', function(room) {
        console.log('Room ' + room + ' is full');
    });
    socket.on('join', function(room, socketId) {
        console.log(socketId + ' made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        // establishPeerConnection(room, socketId);
        manJoined(room, socketId);
    });
    socket.on('joined', function(room) {
        console.log('joined: ' + room);
    });
    socket.on('log', function(array) {
        console.log.apply(console, array);
    });
    socket.on('message', function(message) {
        console.log('Client received message:', message);
        if (message.type === 'offer') {
            receiveMediaOffer(message);
        } else if (message.type === 'answer') {
            receiveMediaFormatAnswer(message);
        } else if (message.type === 'candidate') {
            collectCandidateTransportAddresses(message);
            console.log(`【收到的ice】=${message.candidate}`)
        } else if (message === 'bye') {
            // handleRemoteHangup();
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
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}



export { joinCommunicationRoom, sendMessage, socket, roomNumber }