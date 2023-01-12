import type { Bytes } from "./bytes";

export const Operator = {
    SET: 'set',
    GET: 'get',
} as const;
export type Operator = typeof Operator[keyof typeof Operator];

export function isOperator(value: unknown): value is Operator {
    return Object.values(Operator).includes(value as Operator);
}

export const opFunctions = {
    set: function(memory: Bytes, address: number, value: number): undefined {
        memory.setUInt8(address, value);
        return undefined;
    },
    get: function(memory: Bytes, address: number, value: number): number {
        return memory.getUInt8(address);
    }
} as const;