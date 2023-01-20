import { OperationResult, opFunctions } from "./ops";
import type { SizeKey } from "./parser";
export function execute(
    opCode: number,
    current: number | bigint, currentSize: SizeKey, currentIsFloat: boolean,
    value: number | bigint, valueSize: SizeKey, valueIsFloat: boolean
) {
    const op = opFunctions[opCode];

    let result: OperationResult;
    if(currentIsFloat || valueIsFloat) {
        result = op({
            current: {
                number: Number(current),
                size: currentSize,
                isFloat: currentIsFloat,
            },
            value: {
                number: Number(value),
                size: valueSize,
                isFloat: valueIsFloat,
            },
        });
    } else {
        result = op({
            current: {
                number: BigInt(current),
                size: currentSize,
                isFloat: currentIsFloat,
            },
            value: {
                number: BigInt(value),
                size: valueSize,
                isFloat: valueIsFloat,
            },
        });
    }

    return result;
}

// 0x000000FF
// 0x00FF0000

// 00000 00                0        00         0        00
// op    return size arg1: pointer? size arg2: pointer? size

// 00000 00 0    000 00 00 0    000 00 00 0
// op, returnSize, returnFloat?, // arg1PointerSize, arg1Size, addressReach, isFloat? // arg2PointerSize, arg2Size, (unused), isFloat?