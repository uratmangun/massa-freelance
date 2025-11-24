import { getNetwork } from './getNetwork';
export const getMinimalFees = async (provider) => {
    const { minimalFees } = await getNetwork(provider);
    return BigInt(minimalFees);
};
//# sourceMappingURL=getMinimalFees.js.map