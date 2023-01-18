import promptSync from "prompt-sync";
import type { Bytes, Word } from "./Bytes";
import type { ExecutionType as ExeType } from "./executors";

const prompt = promptSync();

export const Type = {
    UINT8: 0,
    INT8: 1,
    UINT16: 2,
    INT16: 3,
    UINT32: 4,
    INT32: 5,
    FLOAT32: 6,
    CHAR8: 7,
    CHAR16: 8,
    HEX8: 9,
    HEX16: 10,
    HEX32: 11,
    BIN8: 12,
    BIN16: 13,
    BIN32: 14,

    UINT64: 15,
    INT64: 16,
    FLOAT64: 17,
    CHAR32: 18,
    CHAR64: 19,
    HEX64: 20,
    BIN64: 21,
} as const;
export type Type = typeof Type[keyof typeof Type];

//~h Operations

function set(current: bigint, value: bigint): ['set', bigint];
function set(current: number, value: number): ['set', number];
function set(current: any, value: any): ['set', any] {
    return ['set', value];
}

function add(current: bigint, value: bigint): ['set', bigint];
function add(current: number, value: number): ['set', number];
function add(current: any, value: any): ['set', any] {
    return ['set', current + value];
}

function sub(current: bigint, value: bigint): ['set', bigint];
function sub(current: number, value: number): ['set', number];
function sub(current: any, value: any): ['set', any] {
    return ['set', current - value];
}

//~h Exports

export const Operator = {
    SET: 'set',
} as const;
export type Operator = typeof Operator[keyof typeof Operator];

/*
 * set 0
 *
 * inp 1
 * out 2
 * rda 3
 * 
 * jmp 4
 * jif 5
 * jni 6
 * 
 * add 7
 * sub 8
 * mul 9
 * div 10
 * mod 11
 * 
 * and 12
 * ior 13
 * xor 14
 * not 15
 * sls 16
 * srs 17
 * sru 18
 * 
 * flt 19
 * int 20
 * 
 */

export function isOperator(value: unknown): value is Operator {
    return Object.values(Operator).includes(value as Operator);
}

export type OperationResult<N extends number | bigint> = 
    ['set', N]
    ;

export type OperationFunction = {
    (current: number, value: number): OperationResult<number>;
    (current: bigint, value: bigint): OperationResult<bigint>;
}

export const opFunctions: Record<number, OperationFunction> = {
    0: set,
    1: add,
    2: sub,
} as const;