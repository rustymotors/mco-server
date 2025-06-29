import { log, BinaryIO, NPSHeader } from "../common";
import { SessionKey } from "../SessionKey";

export class UserLogin implements BinaryIO {
    readonly name = "UserLogin"
    readonly connectionId
    private _header = new NPSHeader("")
    private _contextId: string = ""
    private _sessionKey= new SessionKey("")
    private data: Buffer = Buffer.alloc(0)
    private log
    
    constructor(connectionId: string) {
        this.connectionId = connectionId
        this.log = log.child({
            connectionId,
            function: this.name
        })
    }

    get sizeOf() {
        return this.data.length
    }

    read(data: Buffer): void {
        this._header = new NPSHeader(this.connectionId)
        this._header.read(data)
        let offset = this._header.sizeOf
        this.log.info(offset)
        const contextIdLength = data.readUInt16BE(offset)
        offset += 2
        this._contextId = data.subarray(offset, offset + contextIdLength).toString("utf8")
        this.data = data
    }

    write() :Buffer {
        const buffer = Buffer.alloc(this.sizeOf)

        return buffer
    }

    toString(encoding?: "hex"): string {
        if (encoding === "hex") {
            return this.write().toString("hex")
        }
        return `${this.name}: ${JSON.stringify(
            {
                connectionId: this.connectionId,
                header: this._header.toString(),
                contextId: this._contextId
            }
        )} `
    }
}
