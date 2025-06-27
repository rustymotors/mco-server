import { type Server as httpServer, createServer as createHTTPServer, } from "http";
import { type Server as tcpServer, createServer as createTCPServer, Socket } from "net";
import { log } from "../server";
import { randomUUID } from "crypto";
import { onHTTPRequest } from "./httpHandler";
import { onTCPData } from "./tcpHanlder";

export class ServerManager {
    servers: (httpServer | tcpServer)[] = [];

    constructor(listeningIp: string, httpPorts: number[], tcpPorts: number[]) {
        for (const port of httpPorts) {
            const server = createHTTPServer(this.onHTTPCreateServer);
            server.on("error", this.onHTTPerror);
            server.on("request", onHTTPRequest);
            server.listen({
                host: listeningIp,
                port
            }, () => { return this.onHTTPListen(port); });
            this.servers.push(server);
        }

        for (const port of tcpPorts) {
            const server = createTCPServer(this.onTCPConnection);
            server.on("error", this.onTCPError);
            server.listen({
                host: listeningIp,
                port
            }, () => { return this.onTCPListen(port); });
            this.servers.push(server);
        }


    }

    onTCPConnection(socket: Socket) {
        const connectionId = randomUUID()
        const connectionLogger = log.child({
            connectionId
        })
        connectionLogger.info('New connection')
        socket.on("data", (data: Buffer) => { return onTCPData(connectionId, data) })

    }

    onHTTPerror() { }

    onTCPError() { }

    onHTTPCreateServer() { }

    onTCPCreateServer() {
    }

    onHTTPListen(port: number) {
        log.info(`HTTP server listening on port ${port}`);
    }

    onTCPListen(port: number) {
        log.info(`TCP server listening on port ${port}`);
    }
}
