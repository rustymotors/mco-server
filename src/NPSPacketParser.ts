import { log } from "../server"
import { BinaryIO, LengthError, NPSHeader } from "./common"
import { UserLogin } from "./packets/UserLogin";

type PacketMessage = new (connectionId: string) => BinaryIO
const PacketMessageMap: Map<number, PacketMessage> = new Map()
PacketMessageMap.set(0x501, UserLogin)

export class NPSPacketParser implements BinaryIO {
    private log;
    protected name_;
    private _connectionId
    private data: Buffer = Buffer.alloc(0)

    constructor(connectionId: string) {
        this.name_ = "NPSPacketParser"
        this.log = log.child({
            connectionId,
            function: this.name
        })
        this._connectionId = connectionId
    }

    get name() {
        return this.name_
    }

    get sizeOf() {
        return this.data.length
    }

    read(data: Buffer) {
        if (data.length < 4) {
            throw new LengthError(4, data.length)
        }

        log.info(`Raw packet: ${data.toString("hex")}`)

        const header = new NPSHeader(this._connectionId)
        header.read(data)

        log.info(`MsgNo: ${header.msgId}`)
        header.msgVersion = 1

        const packetMessage = PacketMessageMap.get(header.msgId)
        if (typeof packetMessage != "undefined") {
            const packet = new packetMessage(this._connectionId)
            packet.read(data)
            log.info(packet.toString())
        }
    }

    write() {
        return this.data
    }

    toString(encoding?: "hex"): string {
        if (encoding === "hex") {
            return this.data.toString('hex')
        }
        return `NPS`
    }

}
