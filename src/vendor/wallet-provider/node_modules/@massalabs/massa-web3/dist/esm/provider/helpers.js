export function isProvider(provider) {
    return (typeof provider === 'object' && provider !== null && 'callSC' in provider);
}
