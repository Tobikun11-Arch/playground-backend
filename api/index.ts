//api/index.ts
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import express, { Request, Response } from 'express'
const app = express()
const port = 5000
const server = http.createServer(app);

dotenv.config();
const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};
app.use(cors(corsOptions));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on("connection", (socket: Socket) => {
    console.log("client connected: ", socket.id) //if it was connected

    socket.on('chat message', (msg: string) => { //message from client
        console.log("Message: ", msg)
        io.emit('chat messsage', msg)
    })

    socket.on('disconnect', ()=> { //if the client disconnect their connection
        console.log("Client disconnected", socket.id)
    })
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/users/data', (req: Request, res: Response) => {
    const users = [
        { 
            id: 1,
            prodName: "Shoes",
            prodPrice: 20,
            prodRate: 5,
                Customer: {
                    cus1: 'Joenel',
                    cus2: 'fernandez',
                    cus3: 'sevellejo'
                }
        }, {
            id: 2,
            prodName: "Pants",
            prodPrice: 50,
            prodRate: 10,
                Customer: {
                    cus1: 'John',
                    cus2: 'Jams',
                    cus3: 'Doe'
                }
        }
    ]

    return res.json({ users })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
