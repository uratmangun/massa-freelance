export function parseCallArgs(args) {
    const bytesOrArgs = args ?? new Uint8Array();
    return bytesOrArgs instanceof Uint8Array
        ? bytesOrArgs
        : bytesOrArgs.serialize();
}
