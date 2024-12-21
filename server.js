const { Worker, isMainThread, threadId } = require('worker_threads');

const express = require('express');
const Ably = require('ably');
const envConfig = require('dotenv').config();
const serveStatic = require('serve-static');
const path = require('path');

const { ABLY_API_KEY } = envConfig.parsed;
const globalQuizChannelName = 'main-quiz-thread';
const activeQuizRooms = {};

console.log(envConfig, ABLY_API_KEY);

const ablyRealtime = new Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false
});

const app = express();
const listener = app.listen(process.env.PORT || 6969, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

let globalQuizChannel;

app.use('/', serveStatic(path.join(__dirname, 'quiz-application/dist')));

app.get('/auth', async (request, response) => {
    const uniqueId = function () {
        return Math.random().toString(16).slice(2);
    };

    try {
        const tokenRequest = await ablyRealtime.auth.createTokenRequest({ 
            clientId: uniqueId() 
        });

        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.send(JSON.stringify(tokenRequest));
      } catch (error) {
        response
          .status(500)
          .send('Error requesting token: ' + JSON.stringify(error));
      }
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'quiz-application/dist/index.html'));
});

app.get('/quiz', function (req, res) {
    let requestedRoomCode = getRequestRoomCode(req);
    if (activeQuizRooms[requestedRoomCode].didQuizStart === true) {
        res.sendFile(path.join(__dirname, 'realtime-quiz/dist/index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'realtime-quiz/dist/index.html'));
    }
});

app.get('/quiz/room-status', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let requestedRoomCode = getRequestRoomCode(req);
    res.send({
        isRoomClosed: activeQuizRooms[requestedRoomCode]
            ? activeQuizRooms[requestedRoomCode].didQuizStart
            : true
    });
});

function getRequestRoomCode(req) {
    return req.query.code;
}

ablyRealtime.connection.once('connected', () => {
    globalQuizChannel = ablyRealtime.channels.get(globalQuizChannelName);

    globalQuizChannel.presence.subscribe('enter', (player) => {
        console.log('New quiz host ', player.clientId);

        if (!isMainThread) {
            return;
        }

        const worker = new Worker('./room-server.js', {
            workerData: {
                hostNickname: player.data.nickname,
                hostRoomCode: player.data.roomCode,
                hostClientId: player.clientId
            }
        });

        console.log(`Created new thread ID ${threadId}`);
        
        workerListenMessage(worker);
        workerHandleError(worker);
        workerHandleExit(worker);
    });
});

function workerHandleError(worker) {
    worker.on('error', (error) => {
        console.log(`Worker exited due to an error ${error}`);
    });
}

function workerHandleExit(worker) {
    worker.on('exit', (code) => {
        console.log(`Worker in thread ID ${threadId} exited`);
        if (code !== 0) {
            console.log(`Worker exited due to an error code ${code}`);
        }
    });
}

function workerListenMessage(worker) {
    worker.on('message', (msg) => {
        if (msg.roomCode && !msg.killWorker) {
            activeQuizRooms[msg.roomCode] = {
                roomCode: msg.roomCode,
                totalPlayers: msg.totalPlayers,
                didQuizStart: msg.didQuizStart
            };
            return;
        } 
        
        if (msg.roomCode && msg.killWorker) {
            delete activeQuizRooms[msg.roomCode];
            return;
        } 
        
        activeQuizRooms[msg.roomCode].didQuizStart = msg.didQuizStart;
    });
}