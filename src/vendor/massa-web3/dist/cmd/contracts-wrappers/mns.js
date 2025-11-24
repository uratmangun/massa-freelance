"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MNS = exports.MNS_CONTRACTS = void 0;
const basicElements_1 = require("../basicElements");
const smartContracts_1 = require("../smartContracts");
const dataEntryNotFound_1 = require("../errors/dataEntryNotFound");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
exports.MNS_CONTRACTS = {
    mainnet: 'AS1q5hUfxLXNXLKsYQVXZLK7MPUZcWaNZZsK7e9QzqhGdAgLpUGT',
    buildnet: 'AS12qKAVjU1nr66JSkQ6N4Lqu4iwuVc6rAbRTrxFoynPrPdP1sj3G',
};
/**
 * @class MNS
 * @extends SmartContract
 *
 * The MNS class provides methods to interact with the Massa Name System (MNS) smart contract.
 * It allows resolving domain names, reverse resolving addresses, allocating domains, freeing domains,
 * and updating domain targets.
 * MNS contract is available here: https://github.com/massalabs/massa-name-system/blob/main/smart-contract/assembly/contracts/main.ts
 *
 * @example
 * ```typescript
 * const mns = await MNS.mainnet(provider);
 * const address = await mns.resolve("example");
 * ```
 *
 */
// Constants are taken from the smart contract
// https://github.com/massalabs/massa-name-service/blob/main/smart-contract/assembly/contracts/main.ts
// eslint-disable-next-line  @typescript-eslint/no-magic-numbers
const DOMAIN_SEPARATOR_KEY = [0x42];
const TOKEN_ID_KEY_PREFIX = [0x1];
// eslint-disable-next-line  @typescript-eslint/no-magic-numbers
const TARGET_KEY_PREFIX = [0x02];
// eslint-disable-next-line  @typescript-eslint/no-magic-numbers
const DOMAIN_KEY_PREFIX = [0x3];
// eslint-disable-next-line  @typescript-eslint/no-magic-numbers
const ADDRESS_KEY_PREFIX_V2 = [0x6];
const OWNED_TOKENS_KEY = (0, basicElements_1.strToBytes)('ownedTokens');
class MNS extends smartContracts_1.SmartContract {
    constructor(provider, chainId) {
        const address = chainId === utils_1.CHAIN_ID.Mainnet
            ? exports.MNS_CONTRACTS.mainnet
            : exports.MNS_CONTRACTS.buildnet;
        super(provider, address);
    }
    static async init(provider) {
        const { chainId } = await provider.networkInfos();
        return new MNS(provider, chainId);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new MNS(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new MNS(provider, utils_1.CHAIN_ID.Buildnet);
    }
    // Resolve domain name (without ".massa") to address
    async resolve(name, options) {
        const res = await this.read('dnsResolve', new basicElements_1.Args().addString(name), options);
        return (0, basicElements_1.bytesToStr)(res.value);
    }
    // deprecated. Use getDomainsFromTarget instead
    async fromAddress(address, options) {
        const res = await this.read('dnsReverseResolve', new basicElements_1.Args().addString(address), options);
        return (0, basicElements_1.bytesToStr)(res.value).split(',');
    }
    async getDomainsFromTarget(target, final = false) {
        const targetBytes = (0, basicElements_1.strToBytes)(target);
        const filter = Uint8Array.from([
            ...DOMAIN_SEPARATOR_KEY,
            ...ADDRESS_KEY_PREFIX_V2,
            targetBytes.length,
            ...targetBytes,
        ]);
        const keys = await this.provider.getStorageKeys(this.address, filter, final);
        return keys.map((key) => (0, basicElements_1.bytesToStr)(key.slice(filter.length)));
    }
    async alloc(name, owner, options) {
        return this.call('dnsAlloc', new basicElements_1.Args().addString(name).addString(owner), options);
    }
    async getTokenId(name) {
        const key = Uint8Array.from([
            ...DOMAIN_SEPARATOR_KEY,
            ...TOKEN_ID_KEY_PREFIX,
            ...(0, basicElements_1.strToBytes)(name),
        ]);
        const data = await this.provider.readStorage(this.address, [key], true);
        if (data[0] == null) {
            throw new dataEntryNotFound_1.ErrorDataEntryNotFound({
                key: key,
                address: this.address,
                details: `mns Domain ${name} not found`,
            });
        }
        return basicElements_1.U256.fromBytes(data[0]);
    }
    async free(name, options) {
        const tokenId = await this.getTokenId(name);
        return this.call('dnsFree', new basicElements_1.Args().addU256(tokenId), options);
    }
    async updateTarget(name, newTarget, options) {
        return this.call('dnsUpdateTarget', new basicElements_1.Args().addString(name).addString(newTarget), options);
    }
    async getOwnedDomains(address, final = false) {
        const filter = Uint8Array.from([
            ...OWNED_TOKENS_KEY,
            ...(0, basicElements_1.strToBytes)(address),
        ]);
        const ownedKeys = await this.provider.getStorageKeys(this.address, filter, final);
        const domainKeys = ownedKeys.map((k) => {
            const tokenIdBytes = k.slice(filter.length);
            return Uint8Array.from([
                ...DOMAIN_SEPARATOR_KEY,
                ...DOMAIN_KEY_PREFIX,
                ...tokenIdBytes,
            ]);
        });
        const domainsBytes = await this.provider.readStorage(this.address, domainKeys, final);
        return domainsBytes.map((d, i) => {
            if (!d) {
                throw new dataEntryNotFound_1.ErrorDataEntryNotFound({
                    key: ownedKeys[i],
                    address: this.address,
                    details: `Domain with tokenId ${basicElements_1.U256.fromBytes(ownedKeys[i].slice(filter.length))} not found`,
                });
            }
            return (0, basicElements_1.bytesToStr)(d);
        });
    }
    async getTargets(domains, final = false) {
        const targetDataStoreEntries = domains.map((name) => Uint8Array.from([
            ...DOMAIN_SEPARATOR_KEY,
            ...TARGET_KEY_PREFIX,
            ...(0, basicElements_1.strToBytes)(name),
        ]));
        const targetsBytes = await this.provider.readStorage(this.address, targetDataStoreEntries, final);
        return targetsBytes.map(basicElements_1.bytesToStr);
    }
    async dnsAllocCost(domain, options) {
        const res = await this.read('dnsAllocCost', new basicElements_1.Args().addString(domain), options);
        if (res.info.error)
            throw new Error(res.info.error);
        return basicElements_1.U64.fromBytes(res.value);
    }
    async transferFrom(domain, currentOwner, newOwner, options) {
        const tokenId = await this.getTokenId(domain);
        const args = new basicElements_1.Args()
            .addString(currentOwner)
            .addString(newOwner)
            .addU256(tokenId);
        return await this.call('transferFrom', args, options);
    }
    async balanceOf(owner, options) {
        const res = await this.read('balanceOf', new basicElements_1.Args().addString(owner), options);
        return basicElements_1.U256.fromBytes(res.value);
    }
}
exports.MNS = MNS;
