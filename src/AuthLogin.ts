import { IncomingMessage, ServerResponse } from "node:http"
import { DatabaseSync } from "node:sqlite"
import { compare, hashSync } from "bcrypt"
import { log } from "../server"

const initialUsers: { customerId: number, username: string, password: string }[] = [
    { customerId: 5551212, username: "admin", password: "admin" }
]

export class AuthLogin {
    protected db: DatabaseSync

    constructor() {
        this.db = new DatabaseSync("authUsers.db", {

        })
        try {
            this.db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, customerId INTEGER UNIQUE ON CONFLICT IGNORE NOT NULL, username TEXT UNIQUE ON CONFLICT IGNORE NOT NULL, passwordHash TEXT NOT NULL)')
            for (const user of initialUsers) {
                const hashedPassword = hashSync(user.password, 10)
                const sql = `INSERT INTO users (customerId, username, passwordHash) VALUES ('${user.customerId}', '${user.username}', '${hashedPassword}')`
                this.db.exec(sql)
            }
        } catch (error: unknown) {
            log.error(`Unable to create initial users table: ${(error as Error).message}`)
        }
    }




    handleRequest(username: string): { customerId: number, username: string, passwordHash: string } | null {
        const query = this.db.prepare('SELECT customerId, username, passwordHash from users where username = ? LIMIT 1')
        const record = query.get(username)

        return record ? {
            customerId: record['customerId'] as number,
            username: record['username'] as string,
            passwordHash: record['passwordHash'] as string,
        } : null



    }
}

export async function handleAuthLoginRoute(request: IncomingMessage, response: ServerResponse) {

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
    if (typeof username === "undefined" || typeof password === "undefined") {
        authLogger.info(`username: ${username}, password: ${password}`)
        response.statusCode = 404;
        response.end('Not Found')
        return
    }

    const authLogin = new AuthLogin()
    authLogger.info(`username: ${username}, password: ${password}`)

    // I'm fairly sure user and password can't be undefined at this point, but I should confirm,
    const record = authLogin.handleRequest(username!)

    if (record === null) {
        log.error(`Unable to locate records for user ${username}`)
        response.statusCode = 404
        response.end('not found')
        return
    }

    const passwordMatches = await compare(password!, record.passwordHash)
    if (passwordMatches) {
        response.statusCode = 200
        response.end('Auth')
        return
    }


    response.statusCode = 404
    response.end('not found')
}


