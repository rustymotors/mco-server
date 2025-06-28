import Database from "better-sqlite3";

export type UnknownRecord = Record<string, unknown>

export enum PlayerType {
    System = 1,
    Admin = 2,
    Player = 3,
    DeletedPlayer = 4,
    Esceow = 5
}

export enum DriverClass {
    C = 0,
    B = 1,
    A = 2
}

export enum STOCK_MUSCLE_CLASS { }

export enum MODIFIED_CLASSIC_CLASS { }

export enum MODIFIED_MUSCLE_CLASS { }


export abstract class DatabaseModel {
    /**
     * Data primary key id
     * Value is false if this record does not yet exist in the database
    */
    readonly id: number | false = false
    protected db: Database.Database
    protected lastError: null
    protected history: UnknownRecord[];

    constructor(db: Database.Database) {
        this.db = db
        this.lastError = null
        this.history = []
    }

    get record(): Record<string, unknown> {
        return this.record
    }

    getLastError(): Error | null {
        throw new Error('Not Implimented')
    }

    getHistory(): UnknownRecord[] {
        return this.history
    }


    create(values: UnknownRecord): number | null {
        this.history.push(values)
        throw new Error('Not Implimented')
    }

    find<T extends DatabaseModel>(column: string, condition: unknown): T | null {
        this.history.push({ where: condition })
        throw new Error('Not Implimented')
    }

    delete(): boolean {
        this.history.push({ delete: true })
        throw new Error('Not Implimented')
    }

    save(): boolean {
        throw new Error('Not Implimented')
    }





}