import { log } from "../server"
import { NPSPacketParser } from "./NPSPacketParser"

    export function onTCPData(connectionId: string, data: Buffer) {
        const parser = new NPSPacketParser(connectionId)
        parser.read(data)
        log.info(`${parser.name}: ${parser.toString("hex")}`)
    }