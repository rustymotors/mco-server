import { type IncomingMessage, type ServerResponse } from "http";
import { log } from "../server";


export function onHTTPRequest(request: IncomingMessage, response: ServerResponse) {
    const localPort = request.socket.localPort ?? "unknown";
    if (localPort === "unknown") {
        log.error(`Unable to determine localPort for HTTP request: ${request.method} ${request.url}`);
    }
    const requestLogger = log.child({
        port: request.socket.localPort ?? 'unknown'
    });
    requestLogger.info(`${request.method} ${request.url}`);
    response.end('ok');

}
