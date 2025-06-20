const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

// Add connection tracking
let connectionCount = 0;

wss.on('connection', (ws) => {
  const clientId = ++connectionCount;
  console.log(`Client ${clientId} connected`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    message: `Welcome! You are client ${clientId}`,
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    console.log(`Received from client ${clientId}: ${message}`);
    
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'message',
          from: clientId,
          message: message.toString(),
          timestamp: new Date().toISOString()
        }));
      }
    });
  });

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
  });
});

console.log('WebSocket server running on ws://0.0.0.0:3000');