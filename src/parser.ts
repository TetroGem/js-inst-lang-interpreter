import type { Bytes } from "./Bytes";
import { execute } from "./executors";
import type { OperationResult } from "./ops";

export function runOn(program: ArrayBuffer, memory: Bytes) {
    let index = 0;
    const dataView = new DataView(program);
    while(index < dataView.byteLength) {
        const { opCode, returnSize, returnIsFloat, address, current, currentIsFloat, value, valueIsFloat, endIndex }
            = parseNextInstruction(dataView, index, memory);
        index = endIndex;
        const result = execute(opCode, current, currentIsFloat, value, valueIsFloat);
        applyResultTo(result, returnSize, returnIsFloat, memory, address);
    }
}

export function parseNextInstruction(dataView: DataView, index: number, memory: Bytes) {
    const opByte = dataView.getUint8(index);
    const opCode = opByte >>> 3;
    const returnSize = (opByte >>> 1) & 0b00000011;
    const returnIsFloat = !!(opByte & 0b00000001);

    index++;

    const arg1Byte = dataView.getUint8(index);
    const arg1PointerSize = (arg1Byte >>> 5) & 0b00000111;
    const arg1ValueSize = (arg1Byte >>> 3) & 0b00000011;
    const addressReach = (arg1Byte >>> 1) & 0b00000011;
    const arg1IsFloat = !!(arg1Byte & 0b00000001);

    index++;

    const arg2Byte = dataView.getUint8(index);
    const arg2PointerSize = (arg2Byte >>> 5) & 0b00000111;
    const arg2ValueSize = (arg2Byte >>> 3) & 0b00000011;
    const arg2IsFloat = !!(arg2Byte & 0b00000001);

    index++;

    let addressArg: number | bigint;
    switch(arg1ValueSize) {
        case 0: addressArg = dataView.getUint8(index); index++; break;
        case 1: addressArg = dataView.getUint16(index); index += 2; break;
        case 2: addressArg = dataView.getUint32(index); index += 4; break;
        case 3: addressArg = dataView.getBigUint64(index); index += 8; break;
        default: throw new Error(`Invalid arg1 value size (Found: ${arg1ValueSize}, Expected: 0, 1, 2, 3)`);
    }

    let addressNumber: number;
    switch(arg1PointerSize) {
        case 0: addressNumber = Number(addressArg); break;
        case 1: addressNumber = memory.getUint8(Number(addressArg)); break;
        case 2: addressNumber = memory.getUint16(Number(addressArg)); break;
        case 3: addressNumber = memory.getUint32(Number(addressArg)); break;
        case 4: addressNumber = Number(memory.getBigUint64(Number(addressArg))); break;
        default: throw new Error(`Invalid arg1 pointer size (Found: ${arg1PointerSize}, Expected: 0, 1, 2, 3, 4)`);
    }

    let currentNumber: number | bigint;
    switch(arg1IsFloat) {
        case false:
            switch(addressReach) {
                case 0: currentNumber = memory.getUint8(addressNumber); break;
                case 1: currentNumber = memory.getUint16(addressNumber); break;
                case 2: currentNumber = memory.getUint32(addressNumber); break;
                case 3: currentNumber = memory.getBigUint64(addressNumber); break;
                default: throw new Error(`Invalid arg1 address reach (for int) (Found: ${addressReach}, Expected: 0, 1, 2, 3)`);
            }
            break;
        case true:
            switch(addressReach) {
                case 2: currentNumber = memory.getFloat32(addressNumber); break;
                case 3: currentNumber = memory.getFloat64(addressNumber); break;
                default: throw new Error(`Invalid arg1 address reach (for float) (Found: ${addressReach}, Expected: 2, 3)`);
            }
    }

    let valueArg: number | bigint;
    if(arg2IsFloat && arg2PointerSize === 0) {
        switch(arg2ValueSize) {
            case 2: valueArg = dataView.getFloat32(index); index += 4; break;
            case 3: valueArg = dataView.getFloat64(index); index += 8; break;
            default: throw new Error(`Invalid arg2 value size (for float) (Found: ${arg2ValueSize}, Expected: 2, 3)`);
        }
    } else {
        switch(arg2ValueSize) {
            case 0: valueArg = dataView.getUint8(index); index++; break;
            case 1: valueArg = dataView.getUint16(index); index += 2; break;
            case 2: valueArg = dataView.getUint32(index); index += 4; break;
            case 3: valueArg = dataView.getBigUint64(index); index += 8; break;
            default: throw new Error(`Invalid arg2 value size (for address) (Found: ${arg2ValueSize}, Expected: 0, 1, 2, 3)`);
        }
    }

    let valueNumber: number | bigint;
    switch(arg2IsFloat) {
        case false:
            switch(arg2PointerSize) {
                case 0: valueNumber = valueArg; break;
                case 1: valueNumber = memory.getUint8(Number(valueArg)); break;
                case 2: valueNumber = memory.getUint16(Number(valueArg)); break;
                case 3: valueNumber = memory.getUint32(Number(valueArg)); break;
                case 4: valueNumber = memory.getBigUint64(Number(valueArg)); break;
                default: throw new Error(`Invalid arg2 pointer size (for int) (Found: ${arg2PointerSize}, Expected: 0, 1, 2, 3, 4)`);
            }
            break;
        case true:
            switch(arg2PointerSize) {
                case 0: valueNumber = valueArg; break;
                case 3: valueNumber = memory.getFloat32(Number(valueArg)); break;
                case 4: valueNumber = memory.getFloat64(Number(valueArg)); break;
                default: throw new Error(`Invalid arg2 pointer size (for float) (Found: ${arg2PointerSize}, Expected: 0, 3, 4)`);
            }
            break;
    }

    return {
        opCode,
        returnSize,
        returnIsFloat,
        address: addressNumber,
        current: currentNumber,
        currentIsFloat: arg1IsFloat,
        value: valueNumber,
        valueIsFloat: arg2IsFloat,
        endIndex: index,
    };
}

function applyResultTo(
    result: OperationResult<number | bigint>, returnSize: number, returnIsFloat: boolean,
    memory: Bytes, address: number
) {
    switch(result[0]) {
        case 'set':
            switch(returnIsFloat) {
                case false:
                    switch(returnSize) {
                        case 0: memory.setUint8(address, Number(result[1])); break;
                        case 1: memory.setUint16(address, Number(result[1])); break;
                        case 2: memory.setUint32(address, Number(result[1])); break;
                        case 3: memory.setBigUint64(address, BigInt(result[1])); break;
                        default: throw new Error(`Invalid return size (for int) (Found: ${returnSize}, Expected: 0, 1, 2, 3)`);
                    }
                    break;
                case true:
                    switch(returnSize) {
                        case 2: memory.setFloat32(address, Number(result[1])); break;
                        case 3: memory.setFloat64(address, Number(result[1])); break;
                        default: throw new Error(`Invalid return size (for float) (Found: ${returnSize}, Expected: 2, 3)`);
                    }
                    break;
            }
            break;
        default: throw new Error(`Invalid operation result type (Found: ${result[0]})`);
    }
}