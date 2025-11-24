import { Operation } from '../operation';
import { CallSCOptions, ReadSCOptions, SmartContract } from '../smartContracts';
/**
 * @class MRC20
 *
 *
 * Class representing an MRC20 token smart contract.
 * Extends the SmartContract class to provide methods for interacting with an MRC20 token.
 * MRC20 contract is available here: https://github.com/massalabs/massa-standards/blob/main/smart-contracts/assembly/contracts/FT/token.ts
 *
 *  @example
 * ```typescript
 * const token = new MRC20(provider, <tokenAddr>);
 * const balance = await token.balanceOf(<accountAddr>);
 * console.log(`Your balance: ${balance}`);
 *
 * const transferOperation = await token.transfer(<recipientAddr>, BigInt(10000));
 * console.log(`Transfer operation id: ${transferOperation.id}`);
 * ```
 */
export declare class MRC20 extends SmartContract {
    private _version;
    private _name;
    private _symbol;
    private _decimals;
    version(options?: ReadSCOptions): Promise<string>;
    name(): Promise<string>;
    symbol(): Promise<string>;
    decimals(): Promise<number>;
    totalSupply(final?: boolean): Promise<bigint>;
    balanceOf(address: string, options?: ReadSCOptions): Promise<bigint>;
    balancesOf(addresses: string[], final?: boolean): Promise<{
        address: string;
        balance: bigint;
    }[]>;
    transfer(to: string, amount: bigint, options?: CallSCOptions): Promise<Operation>;
    allowance(ownerAddress: string, spenderAddress: string, options?: ReadSCOptions): Promise<bigint>;
    increaseAllowance(spenderAddress: string, amount: bigint, options?: CallSCOptions): Promise<Operation>;
    decreaseAllowance(spenderAddress: string, amount: bigint, options?: CallSCOptions): Promise<Operation>;
    transferFrom(spenderAddress: string, recipientAddress: string, amount: bigint, options?: CallSCOptions): Promise<Operation>;
}
