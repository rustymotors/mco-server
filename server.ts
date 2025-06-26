import pino from "pino"

let timeOutId;

function main() {
    timeOutId = setTimeout(main, 3000)
}

const log = pino({
    name: "mco-server"
})


log.info("Hello, from the mco-server!")

main()


