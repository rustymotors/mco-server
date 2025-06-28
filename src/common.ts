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