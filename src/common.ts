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
    readonly connectionId: string
    private log: pino.Logger

    constructor(connectionId: string) {
        this.connectionId = connectionId
        this.name = "NPSHeader"
        this.log = log.child({
            connectionId,
            function: this.name
        })

    }

    get sizeOf() {
        return this.msgVersion === 1 ? 12 : 4
    }

    read(data: Buffer) {
        if (data.length < 4) {
            throw new LengthError(4, data.length)
        }

        this.msgId = data.readUInt16BE(0)
        this.msgLength = data.readUInt16BE(2)

        if (this.msgVersion === 1 && data.length < 12) {
            throw new LengthError(12, data.length)
        }


        if (data.length >= 12) {
            const packetv1Suffix = data.subarray(4, 8).toString("hex")
            const v1Suffix = Buffer.from([0x01, 0x01, 0x00, 0x00]).toString("hex")
            if (packetv1Suffix === v1Suffix) {
                this.msgVersion = 1
            }
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

    toString(encoding?: "hex"): string {
        if (encoding === "hex") {
            return this.write().toString("hex")
        }
        return `${this.name}: ${JSON.stringify(
            {
                connectionId: this.connectionId,
                msgId: this.msgId,
                messageLength: this.msgLength,
                messageVersion: this.msgVersion,
                sizeOf: this.sizeOf
            }
        )}`
    }

}

export class NPSContainer implements BinaryIO {
    readonly name: string
    readonly connectionId: string
    private _data = Buffer.alloc(0)
    private log: pino.Logger

    constructor(connectionId: string) {
        this.connectionId = connectionId
        this.name = "NPSContainer"
        this.log = log.child({
            connectionId,
            function: this.name
        })

    }

    get dataLength() {
        return this._data.length
    }

    get sizeOf() {
        return this._data.length + 4
    }

    get data() {
        return this._data
    }

    read(data: Buffer) {
        if (data.length < 4) {
            throw new LengthError(4, data.length)
        }

        const dataLength = data.readUInt32BE(0)

        if (data.length <= dataLength + 4) {
            throw new LengthError(dataLength + 4, data.length)
        }

        this._data = data.subarray(4, dataLength + 4)
    }

    write(): Buffer {
        const buffer = Buffer.alloc(this.sizeOf)
        buffer.writeUInt32BE(this._data.length, 2)

        this._data.copy(buffer, 4)

        return buffer
    }

    toString(encoding?: "hex"): string {
        if (encoding === "hex") {
            return this.write().toString("hex")
        }
        return `${this.name}: ${JSON.stringify(
            {
                connectionId: this.connectionId,
                dataLength: this._data.length,
                data: this._data.toString("hex"),
                sizeOf: this.sizeOf
            }
        )}`
    }

}