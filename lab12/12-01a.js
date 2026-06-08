const rpcws = require("rpc-websockets").Client;

const EVENT_NAME = "backup";
const socketClient = new rpcws("ws://localhost:4000");

socketClient.on("open", async () => {
  console.log('WebSocket Client is connected to WebSocket Server')
  await socketClient.subscribe(EVENT_NAME);
  console.log(`Subcribe on ${EVENT_NAME}`);
});

socketClient.on(EVENT_NAME, (data) => {
  console.log("Уведомление:", data);
});