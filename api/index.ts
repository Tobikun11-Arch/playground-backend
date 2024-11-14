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
    origin: ['http://localhost:3000', 'https://web-socket-three.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};
app.use(cors(corsOptions));

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://web-socket-three.vercel.app/'],
        methods: ['GET', 'POST']
    }
})

const users = new Map<string, string>()

io.on("connection", (socket: Socket) => {
    console.log("client connected: ", socket.id) //if it was connected

    socket.on('register', (name: string) => {
        console.log("name: ", name)
        users.set(socket.id, name)

        console.log(`User Registered: ${name} (${socket.id})`)
        socket.broadcast.emit('user joined', `${name} has joined the chat.`)
    })

    socket.on('chat message', (msg: string) => { //message from client
        const senderName = users.get(socket.id) || 'Anonymous'
        io.emit('chat message', { sender: senderName, text: msg })
    })

    socket.on('disconnect', ()=> { //if the client disconnect their connection
        const name = users.get(socket.id)
        users.delete(socket.id)
        if(name) {
            io.emit('user left', `${name} has left the chat.`);
            console.log(`User disconnected: ${name} (${socket.id})`);
        }
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
