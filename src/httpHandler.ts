import { type IncomingMessage, type ServerResponse } from "http";
import { log } from "../server";
import { handleAuthLoginRoute } from "./AuthLogin";
import { handleShardListRoute } from "./ShardList";

const routes: {path: string, handler: (request: IncomingMessage, response: ServerResponse) => void}[] = [
    {
        path: "/AuthLogin",
        handler: handleAuthLoginRoute
    },
    {
        path: "/ShardList/",
        handler: handleShardListRoute
    }
]


export function onHTTPRequest(request: IncomingMessage, response: ServerResponse) {
    const localPort = request.socket.localPort ?? "unknown";
    if (localPort === "unknown") {
        log.error(`Unable to determine localPort for HTTP request: ${request.method} ${request.url}`);
    }
    const requestLogger = log.child({
        port: request.socket.localPort ?? 'unknown'
    });
    requestLogger.info(`${request.method} ${request.url}`);

    const routeHandler = routes.find((route) => request.url?.startsWith(route.path))

    if (routeHandler) {
        return routeHandler.handler(request, response)
    }

    response.statusCode = 404
    response.end('Not Found')

}
