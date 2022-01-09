const http = require('http');
const WebSocketServer = require('websocket').server;
const uuid = require('uuid').v4;
const WebSocketStatus = require('./constants/websocket-status');

const server = http.createServer();
const port = process.env.PORT || '3001';

const connections = [];

server.listen(port, () => {
    console.log('WS Listening on ', port);
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function (request) {
    if (request.origin !== 'http://localhost:4200') {
        request.reject();
        return;
    }

    const connection = request.accept('movie-party', request.origin);

    const id = uuid();
    connections.push({
        id,
        connection
    });

    connection.on('open', () => console.log('ws opened..!'));
    connection.on('close', () => console.log('ws closed..!'));

    // handle websocket messages
    connection.on('message', (message) => {
        if (message.type === 'binary') {
            handleWebSocketBinaryMessages(message.binaryData);
        } else {
            handleWebSocketUtf8Messages(message.utf8Data);
        }
    });

    sendPingMessage(id);
});


function sendPingMessage(id) {
    connections.find(conn => conn.id === id).connection.send(JSON.stringify({
        status: WebSocketStatus.CONNECTED,
        message: 'websocket connection successfully!',
        connectionId: id
    }));
}

function sendMessasge(data) {
    connections.find(conn => conn.id === data.connectionId).connection.send(JSON.stringify(data));
}

function handleWebSocketBinaryMessages(message) {
    console.log(message);
}

function handleWebSocketUtf8Messages(message) {
    console.log(message);
}

module.exports = {
    sendMessasge
};