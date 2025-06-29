import { readFile, readFileSync } from "fs";
import { log, BinaryIO, NPSHeader, NPSContainer } from "../common";
import { SessionKey } from "../SessionKey";
import { privateDecrypt } from "crypto";

export class UserLogin implements BinaryIO {
    readonly name = "UserLogin"
    readonly connectionId
    private _header = new NPSHeader("")
    private _contextId: string = ""
    private _sessionKey= new SessionKey("")
    private _sessionKeyContainer = new NPSContainer("")
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

    private decryptSessionKey(encryptedSessionKetBlock: Buffer) {
        const privateKeyPath = "./data/private_key.pem"
        const privateKey = readFileSync(privateKeyPath)

        const decrypted = privateDecrypt(privateKey, Buffer.from(Buffer.from(encryptedSessionKetBlock, "hex").toString(), "hex"))

        log.info(decrypted.toString("hex"))

        return decrypted
    }

    read(data: Buffer): void {
        this._header = new NPSHeader(this.connectionId)
        this._header.read(data)
        let offset = this._header.sizeOf
        this.log.info(offset)
        const contextIdLength = data.readUInt16BE(offset)
        offset += 2
        this._contextId = data.subarray(offset, offset + contextIdLength).toString("utf8")
        offset += contextIdLength
        const sessionsKeyContainer = new NPSContainer(this.connectionId)
        sessionsKeyContainer.read(data.subarray(offset))

        const encryptedSessionKey = data.subarray(offset, offset + sessionsKeyContainer.sizeOf)

        this.decryptSessionKey(sessionsKeyContainer.data)

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
                contextId: this._contextId,
                sessionKeyContainer: this._sessionKeyContainer.toString()
            }
        )} `
    }
}
