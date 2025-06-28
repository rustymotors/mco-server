import pino from "pino"

export const log = pino({
    name: "mco-server"
})


export interface BinaryIO {
    name: string,
    read: (data: Buffer) => void,
    write: () => Buffer
    sizeOf: number
    toString: (encoding?: "hex") => string
}


export class LengthError extends Error {
    readonly expected
    readonly actual

    constructor(expectedLength: number, actualLength: number) {
        super()
        this.name = "LengthError"
        this.message = `Value not the expected length! Expected ${expectedLength}, got ${actualLength}`
        this.expected = expectedLength
        this.actual = actualLength
    }
}

export class NPSHeader implements BinaryIO {
    msgId: number = 0
    msgLength: number = 0
    msgVersion: 0 | 1 = 0
    readonly name: string
    private log: pino.Logger

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