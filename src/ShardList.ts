import { log } from "../server";
import { IncomingMessage, ServerResponse } from "node:http";

export class ShardEntry {
	name: string;
	description: string;
	id: number;
	loginServerIp: string;
	loginServerPort: number;
	lobbyServerIp: string;
	lobbyServerPort: number;
	mcotsServerIp: string;
	statusId: number;
	statusReason: string;
	serverGroupName: string;
	population: number;
	maxPersonasPerUser: number;
	diagnosticServerHost: string;
	diagnosticServerPort: number;
	/**
	 *
	 * @param {string} name
	 * @param {string} description
	 * @param {number} id
	 * @param {string} loginServerIp
	 * @param {number} loginServerPort
	 * @param {string} lobbyServerIp
	 * @param {number} lobbyServerPort
	 * @param {string} mcotsServerIp
	 * @param {number} statusId
	 * @param {string} statusReason
	 * @param {string} serverGroupName
	 * @param {number} population
	 * @param {number} maxPersonasPerUser
	 * @param {string} diagnosticServerHost
	 * @param {number} diagnosticServerPort
	 */
	constructor(
		name: string,
		description: string,
		id: number,
		loginServerIp: string,
		loginServerPort: number,
		lobbyServerIp: string,
		lobbyServerPort: number,
		mcotsServerIp: string,
		statusId: number,
		statusReason: string,
		serverGroupName: string,
		population: number,
		maxPersonasPerUser: number,
		diagnosticServerHost: string,
		diagnosticServerPort: number,
	) {
		this.name = name;
		this.description = description;
		this.id = id;
		this.loginServerIp = loginServerIp;
		this.loginServerPort = loginServerPort;
		this.lobbyServerIp = lobbyServerIp;
		this.lobbyServerPort = lobbyServerPort;
		this.mcotsServerIp = mcotsServerIp;
		this.statusId = statusId;
		this.statusReason = statusReason;
		this.serverGroupName = serverGroupName;
		this.population = population;
		this.maxPersonasPerUser = maxPersonasPerUser;
		this.diagnosticServerHost = diagnosticServerHost;
		this.diagnosticServerPort = diagnosticServerPort;
	}

	/**
	 * Return the entry in a formatted string
	 *
	 * @return {string}
	 */
	formatForShardList(): string {
		return `[${this.name}]
      Description=${this.description}
      ShardId=${this.id}
      LoginServerIP=${this.loginServerIp}
      LoginServerPort=${this.loginServerPort}
      LobbyServerIP=${this.lobbyServerIp}
      LobbyServerPort=${this.lobbyServerPort}
      MCOTSServerIP=${this.mcotsServerIp}
      StatusId=${this.statusId}
      Status_Reason=${this.statusReason}
      ServerGroup_Name=${this.serverGroupName}
      Population=${this.population}
      MaxPersonasPerUser=${this.maxPersonasPerUser}
      DiagnosticServerHost=${this.diagnosticServerHost}
      DiagnosticServerPort=${this.diagnosticServerPort}`;
	}
}


export class ShardList {
    private shards: ShardEntry[] = []

    constructor(initiualShards?: ShardEntry[]) {
        if (initiualShards) {
            for (const shard of initiualShards) {
                this.addShard(shard)
            }
        }
    }

    addShard(entry: ShardEntry) {
        this.shards.push(entry)
    }

    getAllShardsForWeb(): string {
        const shardList = []

        for (const shard of this.shards) {
            shardList.push(shard.formatForShardList())
        }

        return shardList.join("\n")
    }
}

export async function handleShardListRoute(request: IncomingMessage, response: ServerResponse) {

    const shardList = new ShardList([
        new ShardEntry(
            "Starter Shard",
            "A shard",
            1,
            "rusty-motors.com",
            8226,
            "rusty-motors.com",
            7003,
            "rusty-motors.com",
            0,
            "",
            "Group-1",
            0,
            2,
            "rusty-motors.com",
            80
        )
    ])

    response.setHeader("Content-Type", "text/plain")
    response.statusCode = 200
    log.info(shardList.getAllShardsForWeb())
    response.end(shardList.getAllShardsForWeb())

}