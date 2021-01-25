/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const WebSocket = require('ws');

const auth = require('./helpers/authHelper');

const webSocketServer = new WebSocket.Server({ port: process.env.WS_PORT || 3030 });

const balanceList = {};
const transactionList = {};

const closeConnection = (ws) => {
  ws.terminate();
};

exports.sendToTransaction = (event) => {
  const clients = transactionList[event.userId];
  if (clients === undefined) {
    return;
  }
  const objToSend = JSON.stringify({ ...event });

  if (clients !== undefined && objToSend !== undefined) {
    clients.forEach((client) => {
      client.send(objToSend);
    });
  }
};

exports.sendToBalance = (event) => {
  const clients = balanceList[event.userId];
  if (clients === undefined) {
    return;
  }
  const objToSend = JSON.stringify({ balance: parseFloat(event.data) });

  if (clients !== undefined && objToSend !== undefined) {
    clients.forEach((client) => {
      client.send(objToSend);
    });
  }
};

const addNewClient = (ws, req) => {
  const { authorization } = req.headers;
  const forEvent = req.headers['x-for-event'];
  if (authorization === undefined || !forEvent) {
    closeConnection(ws);
  }

  try {
    const token = authorization.split(' ')[1];
    const { userId } = auth.decodeToken(token);
    const list = forEvent === 'balance' ? balanceList : transactionList;
    const items = list[userId] || [];
    items.push(ws);
    list[userId] = items;
  } catch (error) {
    closeConnection(ws);
  }
};

// Balance websocket
webSocketServer.on('connection', async (ws, req) => {
  addNewClient(ws, req);
});
