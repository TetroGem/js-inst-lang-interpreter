import type { Byte, Bytes, Double, Half, Word } from "./Bytes";
import { OperationFunction, OperationResult, opFunctions } from "./ops";

export type ExecutionType = 32 | 16 | 8 | 64;

export function execute(
    opCode: number,
    current: number | bigint, currentIsFloat: boolean,
    value: number | bigint, valueIsFloat: boolean
) {
    const op = opFunctions[opCode];

    let result: OperationResult<number | bigint>;
    if(currentIsFloat || valueIsFloat) {
        result = op(Number(current), Number(value));
    } else {
        result = op(BigInt(current), BigInt(value));
    }

    return result;
}

// 0x000000FF
// 0x00FF0000

// 00000 00                0        00         0        00
// op    return size arg1: pointer? size arg2: pointer? size

// 00000 00 0    000 00 00 0    000 00 00 0
// op, returnSize, returnFloat?, // arg1PointerSize, arg1Size, addressReach, isFloat? // arg2PointerSize, arg2Size, (unused), isFloat?