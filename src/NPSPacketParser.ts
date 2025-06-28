import { log } from "../server"
import { LengthError } from "./common"

// 0501013c010100000000013c002038626662343631373066306434623139613137333135663566623135333731610000010031433235324232463636304534333343423145394243354639463736323837413246433135373845423536303443423941353045413941314141314230333143333137323333353844443646364130323333464643424534304633414334433144463344363531323945314439373232393644454339443934373032354536313834453935393734363332433938413230313730343444303839383946383131344143334243354546304536463539324434364137373545363845363543373642393131303037383833344145393742394345323046363742324344373938443636393842413534463646393744353142464139434632333641343436363034000432313736fea31c19

interface BinaryIO {
    name: string,
    read: (data: Buffer) => void,
    write: () => Buffer
    sizeOf: number
    toString: (encoding?: "hex") => string
}

export class NPSHeader implements BinaryIO {
    msgId: number = 0
    msgLength: number = 0
    msgVersion: 0 | 1 = 0
    readonly name: string
    private log

    constructor(connectionId: string) {
        this.name = "NPSHeader"
        this.log = log.child({
            connectionId,
            function: this.name
        })
        
    }

    get sizeOf() {
        return this.msgVersion === 0 ? 4 : 12
    }

    read(data: Buffer) {
        if (data.length < 4) {
            throw new  LengthError(4, data.length)
        }
        
        this.msgId = data.readUInt16BE(0)
        this.msgLength = data.readUInt16BE(2)

        if (this.msgVersion === 1 && data.length < 12) {
            throw new LengthError(12, data.length)
        }
    }

    write(): Buffer {
        const buffer = Buffer.alloc(this.sizeOf)
        buffer.writeUInt16BE(this.msgId, 0)
        buffer.writeUInt16BE(this.msgLength, 2)

        if (this.msgVersion === 1) {
            buffer.writeUInt16BE(0x0101, 4)
            buffer.writeUInt16BE(0x0000, 6)
            buffer.writeUInt32BE(this.msgLength, 8)
        }

        return buffer
    }

}

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

        const header = new NPSHeader(this._connectionId)
        header.read(data)
        
        log.info(`MsgNo: ${header.msgId}`)


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
