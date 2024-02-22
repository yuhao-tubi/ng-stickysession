const express = require('express');
const app = express();
const path = require('path');
const port = 4000;

// Store clients for app
let clients = [];

// Helper function to send events to all connected clients
function sendEventsToAll(newData, clients) {
  clients.forEach(client =>
    { 
        console.log(`send message to ${client.id}`);
        client.res.write(`data: ${JSON.stringify(newData)}\n\n`) 
    }
  );
}

// SSE setup for app
app.get('/events', (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  const newClient = {
    id: Date.now(),
    res
  };
  clients.push(newClient);

  req.on('close', () => {
    console.log(`${newClient.id} Connection closed`);
    clients = clients.filter(client => client.id !== newClient.id);
  });
  console.log(`${newClient.id} New connection established for app`);
});

// Example route to trigger an event for all connected clients on app
app.post('/trigger', (req, res) => {
  const newData = { message: 'Hello this is SSE Server #2!' };
  sendEventsToAll(newData, clients);
  console.log(`Trigger event for app: ${JSON.stringify(newData)}`);
  console.log(`Clients size for app: ${clients.length}`);
  res.status(204).end();
});

// 

app.use(express.static(path.resolve(__dirname, '../')));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
