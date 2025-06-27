import { type Server as httpServer, createServer as createHTTPServer, type IncomingMessage, type ServerResponse } from "http";
import { type Server as tcpServer, createServer as createTCPServer } from "net";
import { log } from "../server";

export class ServerManager {
    servers: (httpServer | tcpServer)[] = [];

    constructor(listeningIp: string, httpPorts: number[], tcpPorts: number[]) {
        for (const port of httpPorts) {
            const server = createHTTPServer(this.onHTTPCreateServer);
            server.on("error", this.onHTTPerror);
            server.on("request", this.onHTTPRequest);
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

    onHTTPRequest(request: IncomingMessage, response: ServerResponse) {
        const requestLogger = log.child({
            port: request.socket.localPort ?? 'unknown'
        });
        requestLogger.info(`${request.method} ${request.url}`);
        response.end('ok');

    }

    onTCPConnection() { }

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
