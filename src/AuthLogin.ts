import { IncomingMessage, ServerResponse } from "http"
import { DatabaseSync } from "node:sqlite"
import { log } from "../server"

export class AuthLogin {
    protected db: DatabaseSync

    constructor() {
        this.db = new DatabaseSync("authUsers.db")
        try {
            this.db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, passwordHash TEXT NOT NULL)')
        } catch (error: unknown) {
            log.error(`Unable to create initial users table: ${(error as Error).message}`)
        }
    }




    handleRequest() {
        this.db.exec(`Select 1;`)

    }
}

export function handleAuthLoginRoute(request: IncomingMessage, response: ServerResponse) {

    const authLogger = log.child({
        function: handleAuthLoginRoute
    })

    if (typeof request.url === "undefined") {
        // I don't think we should be able to get this far with url being empty but...
        authLogger.error('Error in handleAuthLoginRoute, url is empty!')
        return
    }

    const url = new URL(`http://localhost${request.url})`)

    const username = url.searchParams.get('username')
    const password = url.searchParams.get('password')
    if ( typeof username === "undefined" || typeof password === "undefined") {
        authLogger.info(`username: ${username}, password: ${password}`)
        response.statusCode = 404;
        response.end('Not Found')
        return
    }

    const authLogin = new AuthLogin()
    authLogger.info(`username: ${username}, password: ${password}`)
    response.statusCode = 404
    response.end('not found')
}


