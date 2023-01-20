import promptSync from "prompt-sync";
import type { SizeKey } from "./parser";

const prompt = promptSync();

export const Type = {
    UINT8: 0,
    UINT16: 1,
    UINT32: 2,
    UINT64: 3,
    INT8: 4,
    INT16: 5,
    INT32: 6,
    INT64: 7,
    FLOAT32: 8,
    FLOAT64: 9,
    CHAR8: 10,
    CHAR16: 11,
    CHAR32: 12,
    CHAR64: 13,
    HEX8: 14,
    HEX16: 15,
    HEX32: 16,
    HEX64: 17,
    BIN8: 18,
    BIN16: 19,
    BIN32: 20,
    BIN64: 21,
    OCT8: 22,
    OCT16: 23,
    OCT32: 24,
    OCT64: 25,
    RAW: 26,
} as const;
export type Type = typeof Type[keyof typeof Type];

//~h Operations

function set(options: OperationOptions<bigint>): ['set', bigint];
function set(options: OperationOptions<number>): ['set', number];
function set(options: OperationOptions<any>): ['set', any] {
    return ['set', options.value.number];
}

function inp(options: OperationOptions<bigint>): ['set', bigint];
function inp(options: OperationOptions<number>): ['set', number];
function inp(options: OperationOptions<any>): ['set', any] {
    const input = prompt("");

    const inputType = Number(options.value.number);
    switch(inputType) {
        case Type.UINT8:
        case Type.UINT16:
        case Type.UINT32:
        case Type.UINT64:
        case Type.INT8:
        case Type.INT16:
        case Type.INT32:
        case Type.INT64:
            return ['set', BigInt(input.startsWith('0') ? input.slice(1) : input)];
        case Type.FLOAT32:
        case Type.FLOAT64:
            return ['set', Number(input.startsWith('0') ? input.slice(1) : input)];
        case Type.CHAR8:
        case Type.CHAR16:
        case Type.CHAR32:
        case Type.CHAR64:
            return ['set', BigInt(input.charCodeAt(0))];
        case Type.HEX8:
        case Type.HEX16:
        case Type.HEX32:
        case Type.HEX64:
            return ['set', BigInt('0x' + input)];
        case Type.BIN8:
        case Type.BIN16:
        case Type.BIN32:
        case Type.BIN64:
            return ['set', BigInt('0b' + input)];
        case Type.OCT8:
        case Type.OCT16:
        case Type.OCT32:
        case Type.OCT64:
            return ['set', BigInt('0o' + input)];
        case Type.RAW:
            return ['set', Number.isInteger(input) ? BigInt(input) : Number(input)];
        default:
            throw new Error(`Invalid input type (Found: ${options.value.number})`);
    }
}

function rds(options: OperationOptions<bigint>): ['wrs', string];
function rds(options: OperationOptions<number>): ['wrs', string];
function rds(options: OperationOptions<any>): ['wrs', string] {
    const input = prompt("");
    const maxLength = Number(options.value.number);
    const substring = input.substring(0, maxLength);
    return ['wrs', substring];
}

function out(options: OperationOptions<bigint>): ['out', string];
function out(options: OperationOptions<number>): ['out', string];
function out(options: OperationOptions<any>): ['out', string] {
    const { current, value } = options;

    const currentView = new DataView(new ArrayBuffer(8));
    switch(current.isFloat) {
        case false:
            currentView.setBigUint64(0, current.number as bigint);
            break;
        case true:
            switch(current.size) {
                case 2: currentView.setFloat32(4, current.number as number); break;
                case 3: currentView.setFloat64(0, current.number as number); break;
                default: throw new Error(`Invalid current size key (Found: ${current.size}, Expected: 2 | 3)`);
            }
            break;
        default: throw new Error(`Invalid current isFloat value (Found: ${current.isFloat}, Expected: boolean)`);
    }

    const outputType = Number(value.number);
    let output: string;
    switch(outputType) {
        case Type.UINT8: output = currentView.getUint8(7).toString(); break;
        case Type.UINT16: output = currentView.getUint16(6).toString(); break;
        case Type.UINT32: output = currentView.getUint32(4).toString(); break;
        case Type.UINT64: output = currentView.getBigUint64(0).toString(); break;
        case Type.INT8: output = currentView.getInt8(7).toString(); break;
        case Type.INT16: output = currentView.getInt16(6).toString(); break;
        case Type.INT32: output = currentView.getInt32(4).toString(); break;
        case Type.INT64: output = currentView.getBigInt64(0).toString(); break;
        case Type.FLOAT32: output = currentView.getFloat32(4).toString(); break;
        case Type.FLOAT64: output = currentView.getFloat64(0).toString(); break;
        case Type.CHAR8: output = String.fromCharCode(currentView.getUint8(7)); break;
        case Type.CHAR16: output = String.fromCharCode(currentView.getUint16(6)); break;
        case Type.CHAR32: output = String.fromCharCode(currentView.getUint32(4)); break;
        case Type.CHAR64: output = String.fromCharCode(Number(currentView.getBigUint64(0))); break;
        case Type.HEX8: output = currentView.getUint8(7).toString(16); break;
        case Type.HEX16: output = currentView.getUint16(6).toString(16); break;
        case Type.HEX32: output = currentView.getUint32(4).toString(16); break;
        case Type.HEX64: output = currentView.getBigUint64(0).toString(16); break;
        case Type.BIN8: output = currentView.getUint8(7).toString(2); break;
        case Type.BIN16: output = currentView.getUint16(6).toString(2); break;
        case Type.BIN32: output = currentView.getUint32(4).toString(2); break;
        case Type.BIN64: output = currentView.getBigUint64(0).toString(2); break;
        case Type.OCT8: output = currentView.getUint8(7).toString(8); break;
        case Type.OCT16: output = currentView.getUint16(6).toString(8); break;
        case Type.OCT32: output = currentView.getUint32(4).toString(8); break;
        case Type.OCT64: output = currentView.getBigUint64(0).toString(8); break;
        case Type.RAW: output = current.number.toString(); break;
        default: throw new Error(`Invalid output type (Found: ${outputType})`);
    }
    return ['out', output];
}

function jmp(options: OperationOptions<bigint>): ['jmp', number];
function jmp(options: OperationOptions<number>): ['jmp', number];
function jmp(options: OperationOptions<any>): ['jmp', number] {
    return ['jmp', Number(options.value.number)];
}

function jif(options: OperationOptions<bigint>): ['jmp', number] | null;
function jif(options: OperationOptions<number>): ['jmp', number] | null;
function jif(options: OperationOptions<any>): ['jmp', number] | null {
    if(Number(options.current.number) === 0) return null;
    return ['jmp', Number(options.value.number)];
}

function jni(options: OperationOptions<bigint>): ['jmp', number] | null;
function jni(options: OperationOptions<number>): ['jmp', number] | null;
function jni(options: OperationOptions<any>): ['jmp', number] | null {
    if(Number(options.current.number) !== 0) return null;
    return ['jmp', Number(options.value.number)];
}

function end(options: OperationOptions<bigint>): ['end'];
function end(options: OperationOptions<number>): ['end'];
function end(options: OperationOptions<any>): ['end'] {
    return ['end'];
}

function add(options: OperationOptions<bigint>): ['set', bigint];
function add(options: OperationOptions<number>): ['set', number];
function add(options: OperationOptions<any>): ['set', any] {
    return ['set', options.current.number + options.value.number];
}

function sub(options: OperationOptions<bigint>): ['set', bigint];
function sub(options: OperationOptions<number>): ['set', number];
function sub(options: OperationOptions<any>): ['set', any] {
    return ['set', options.current.number - options.value.number];
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
 * rds 3
 * 
 * jmp 4
 * jif 5
 * jni 6
 * 
 * end 7
 * 
 * add 8
 * sub 9
 * mul 10
 * div 11
 * mod 12
 * 
 * and 13
 * ior 14
 * xor 15
 * not 16
 * sls 17
 * srs 18
 * sru 19
 * 
 */

export function isOperator(value: unknown): value is Operator {
    return Object.values(Operator).includes(value as Operator);
}

export type OperationResult<N extends number | bigint> = 
    ['set', N]
    | ['out', string]
    | ['jmp', number]
    | ['wrs', string]
    | ['end']
    | null
    ;

export type OperationOptions<N extends number | bigint> = Readonly<{
    current: Readonly<{
        number: N;
        size: SizeKey;
        isFloat: boolean;
    }>,
    value: Readonly<{
        number: N;
        size: SizeKey;
        isFloat: boolean;
    }>,
}>;

export type OperationFunction = {
    (options: OperationOptions<number>): OperationResult<number>;
    (options: OperationOptions<bigint>): OperationResult<bigint>;
};

export const opFunctions: Record<number, OperationFunction> = {
    0: set,
    1: inp,
    2: out,
    3: rds,
    4: jmp,
    5: jif,
    6: jni,
    7: end,
    8: add,
    9: sub,
} as const;