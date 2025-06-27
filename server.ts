import pino from "pino"
import { ServerManager } from "./src/ServerManager.js";

let timeOutId: NodeJS.Timeout | null = null;

function runMainLoop() {
    timeOutId = setTimeout(runMainLoop, 3000)
}

function stop() {
    if (timeOutId) {
        clearTimeout(timeOutId)
        timeOutId = null
    }
}
process.on("SIGINT", () => {
    log.info("Received SIGINT, stopping server...")
    stop()
    log.info("Server stopped.")
    process.exit(0)
})


export const log = pino({
    name: "mco-server"
})


log.info("Hello, from the mco-server!")
new ServerManager('0.0.0.0', [3000], [8226])
runMainLoop()


