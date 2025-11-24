export function isStandalone() {
    // this is eventually set by wallet web-app
    return (typeof window !== 'undefined' && Boolean(window.massaWallet?.standalone));
}
//# sourceMappingURL=standalone.js.map