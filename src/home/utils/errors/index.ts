export class TimeoutError extends Error {
    readonly timeout = true

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
