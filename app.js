const express = require('express');
const app1 = express();
const app2 = express();
const port1 = 3000;
const port2 = 4000;

// Store clients for app1 and app2
let clients1 = [];
let clients2 = [];

// Helper function to send events to all connected clients
function sendEventsToAll(newData, clients) {
  clients.forEach(client =>
    { 
        console.log(`send message to ${client.id}`);
        client.res.write(`data: ${JSON.stringify(newData)}\n\n`) 
    }
  );
}

// SSE setup for app1
app1.get('/events', (req, res) => {
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
  clients1.push(newClient);

  req.on('close', () => {
    console.log(`${newClient.id} Connection closed`);
    clients1 = clients1.filter(client => client.id !== newClient.id);
  });
  console.log(`${newClient.id} New connection established for app1`);
});

// SSE setup for app2
app2.get('/events', (req, res) => {
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
  clients2.push(newClient);

  req.on('close', () => {
    console.log(`${newClient.id} Connection closed`);
    clients2 = clients2.filter(client => client.id !== newClient.id);
  });
  console.log(`${newClient.id} New connection established for app2`);
});

// Example route to trigger an event for all connected clients on app1
app1.post('/trigger', (req, res) => {
  const newData = { message: 'Hello this is SSE Server #1!' };
  sendEventsToAll(newData, clients1);
  console.log(`Trigger event for app1: ${JSON.stringify(newData)}`);
  console.log(`Clients size for app1: ${clients1.length}`);
  res.status(204).end();
});

// Example route to trigger an event for all connected clients on app2
app2.post('/trigger', (req, res) => {
  const newData = { message: 'Hello, this is SSE Server #2!' };
  sendEventsToAll(newData, clients2);
  console.log(`Trigger event for app2: ${JSON.stringify(newData)}`);
  console.log(`Clients size for app2: ${clients2.length}`);
  res.status(204).end();
});

app1.use(express.static(__dirname));
app2.use(express.static(__dirname));

app1.listen(port1, () => {
  console.log(`App1 listening on port ${port1}`);
});

app2.listen(port2, () => {
  console.log(`App2 listening on port ${port2}`);
});