import { log } from "../server"

// 0501013c010100000000013c002038626662343631373066306434623139613137333135663566623135333731610000010031433235324232463636304534333343423145394243354639463736323837413246433135373845423536303443423941353045413941314141314230333143333137323333353844443646364130323333464643424534304633414334433144463344363531323945314439373232393644454339443934373032354536313834453935393734363332433938413230313730343444303839383946383131344143334243354546304536463539324434364137373545363845363543373642393131303037383833344145393742394345323046363742324344373938443636393842413534463646393744353142464139434632333641343436363034000432313736fea31c19

interface BinaryIO {
    name: string,
    read: (data: Buffer) => void,
    write: () => Buffer
    toString: (encoding?: "hex") => string
}

class NPSHeader implements BinaryIO {
}

export class NPSPacketParser implements BinaryIO {
    private log;
    protected name_;
    private data: Buffer = Buffer.alloc(0)

    constructor(connectionId: string) {
        this.name_ = "NPSPacketParser"
        this.log = log.child({
            connectionId,
            function: this.name
        })
    }

    get name() {
        return this.name_
    }

    read(data: Buffer) {
        if (data.length < 4) {
            throw new Error(`Not enough data for header! Need at least 4 bytes, got ${data.length}`)
        }

        const messageId = data.readInt16BE(0)

        log.info(`MsgNo: ${messageId}`)


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
