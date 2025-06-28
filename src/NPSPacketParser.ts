import { log } from "../server"
import { BinaryIO, LengthError, NPSHeader } from "./common"
import { SessionKey } from "./SessionKey";

export class NPSPacketParser implements BinaryIO {
    private log;
    protected name_;
    private _connectionId
    private data: Buffer = Buffer.alloc(0)
    private _sessionKey: SessionKey = new SessionKey()

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

        const header = new NPSHeader(this._connectionId)
        header.read(data)

        log.info(`MsgNo: ${header.msgId}`)
        header.msgVersion = 1
        let offset = header.sizeOf
        this._sessionKey.read(data.subarray(offset))

        this.data = data
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
