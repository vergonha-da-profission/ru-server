const WebSocket = require('ws');

const auth = require('./helpers/authHelper');

const webSocketServer = new WebSocket.Server({ port: process.env.WS_PORT || 3030 });

const clientList = {};
exports.clientList = clientList;

const closeConnection = (ws) => {
  ws.terminate();
};

exports.sendTo = (event) => {
  const clients = clientList[event.userId];
  if (clients === undefined) {
    return;
  }
  clients.forEach((client) => {
    client.send({ balance: parseFloat(event.data) });
  });
};

const addNewClient = (ws, req) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    closeConnection(ws);
  }

  try {
    const token = authorization.split(' ')[1];
    const { userId } = auth.decodeToken(token);
    const items = clientList[userId] || [];
    items.push(ws);
    clientList[userId] = items;
  } catch (error) {
    closeConnection(ws);
  }
};

// Balance websocket
webSocketServer.on('connection', async (ws, req) => {
  addNewClient(ws, req);
});
