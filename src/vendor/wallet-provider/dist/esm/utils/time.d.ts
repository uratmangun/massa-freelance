/**
 * This file defines a TypeScript module with various time-related Typescript methods.
 *
 * @remarks
 * - The classes and their methods implemented here are quite generic and might be useful in other contexts too
 *  but have been particularly developed for the purposes of this library
 * - If you want to work on this repo, you will probably be interested in this object
 *
 */
/**
 * This class provides an implementation of a timer calling a callback hook after it ticks.
 * @remarks
 * The timer is being resetted only after the execution of the callback method has finished
 */
export declare class Timeout {
    /**
     * Timeout constructor
     *
     * @param timeoutMil - The number of milliseconds for the timeout.
     * @param callback - a callback to execute.
     * @returns An instance of the Timeout class.
     */
    constructor(timeoutMil: number, callback: () => void);
    private isCleared;
    private isCalled;
    private timeoutHook;
    /**
     * A method to clear the timeout
     *
     * @returns void
     */
    clear(): void;
}
/**
 * This class provides an implementation of a continuous timer calling a callback hook after every given milliseconds.
 * @remarks
 * The timer is being resetted every given milliseconds
 * irregardless whether the execution of the method is still running or not
 */
export declare class Interval {
    /**
     * Interval constructor
     *
     * @param timeoutMil - The number of milliseconds for the interval.
     * @param callback - a callback to execute.
     * @returns An instance of the Interval class.
     */
    constructor(timeoutMil: number, callback: () => void);
    private isCleared;
    private isCalled;
    private intervalHook;
    /**
     * A method to clear the interval
     *
     * @returns void
     */
    clear(): void;
}
/**
 * A function that waits pauses the execution loop for a number of milliseconds
 *
 * @param timeMilli - The number of milliseconds to wait.
 * @returns void
 */
export declare const wait: (timeMilli: number) => Promise<void>;
/**
 * A function that awaits a promise with a timeout.
 *
 * @param promise - a promise to execute.
 * @param timeoutMs - The number of milliseconds to wait before a timeout.
 * @returns void
 *
 * @remarks
 * The promise is being polled with a timeout. Once the timeout is reached, if not fulfilled, the error is thrown.
 */
export declare function withTimeoutRejection<T>(promise: Promise<T>, timeoutMs: number): Promise<T>;
//# sourceMappingURL=time.d.ts.map