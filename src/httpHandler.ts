import { type IncomingMessage, type ServerResponse } from "http";
import { log } from "../server";
import { handleAuthLoginRoute } from "./AuthLogin";
import { handleShardListRoute } from "./ShardList";
import { readFileSync } from "fs";

function writeFileResponse(fileName: string, filePath: string, response: ServerResponse) {
    const data = readFileSync(filePath)
    response.setHeader("Content-Type", "octet-stream")
    response.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
    response.end(data)

}

function handleDownloadCertRoute(requet: IncomingMessage, response: ServerResponse) {
    // Point of note, Windows XP doesn't know what the .pem extension is
    writeFileResponse("rusty-motors-com.pem", "./data/rusty-motors-com.crt", response)
}

function handleDownloadKeyRoute(requet: IncomingMessage, response: ServerResponse) {
    writeFileResponse("pub.key", "./data/pub.key", response)
}


const routes: {path: string, handler: (request: IncomingMessage, response: ServerResponse) => void}[] = [
    {
        path: "/AuthLogin",
        handler: handleAuthLoginRoute
    },
    {
        path: "/ShardList/",
        handler: handleShardListRoute
    },
    {
        path: "/download/certificate",
        handler: handleDownloadCertRoute
    },
        {
        path: "/download/key",
        handler: handleDownloadKeyRoute
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
