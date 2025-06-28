import { log, BinaryIO } from "../common";

export class UserLogin implements BinaryIO {
    readonly name = "UserLogin"
    private data: Buffer = Buffer.alloc(0)
    private log
    
    constructor(connectionId: string) {
        this.log = log.child({
            connectionId,
            function: this.name
        })
    }

    get sizeOf() {
        return this.data.length
    }

    read(data: Buffer): void {
        this.data = data
    }

    write() :Buffer {
        const buffer = Buffer.alloc(this.sizeOf)

        return buffer
    }
}
