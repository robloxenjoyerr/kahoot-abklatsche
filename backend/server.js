import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import registerGameSocket from "./sockets/gameSocket.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../frontend/public")));


registerGameSocket(io)

server.listen(3000, () => console.log("Server läuft auf Port 3000"));