import { log } from "../server"

    export function onTCPData(connectionId: string, data: Buffer) {
        const dataLogger = log.child({
            connectionId
        })
        dataLogger.info(`Data recieved: ${data.toString("hex")}`)
    }