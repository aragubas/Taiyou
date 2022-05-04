import { Socket, Server } from 'socket.io';

const server = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });


server.on("connection", async (client: Socket) => {
  client.send("ceira")

  client.on("message", (data: any) =>{
    console.log(data);
  })
  
});

server.listen(3313);
