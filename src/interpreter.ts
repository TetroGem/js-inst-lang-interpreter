import { Bytes, Word } from "./Bytes";
import { convertBytes } from "./convert-bytes";
import { opFunctions, type Operator, isOperator } from "./ops";

export function interpretOn(code: string, memory: Bytes) {
    let running = true;
    let instPointer = 0;
    const insts = code.split('\n').filter(inst => inst.length > 0);

    while(running) {
        const inst = insts[instPointer];
        const result = runInstOn(inst, memory);
        if(result !== undefined) {
            if(typeof result === 'number') console.log(result);
            else if(Array.isArray(result)) {
                switch(result[0]) {
                    case 'jmp':
                        instPointer = result[1] - 1;
                        break;
                    case 'end':
                        running = false;
                        break;
                }
            }
        }
        instPointer++;
    }
}

function runInstOn(inst: string, memory: Bytes) {
    const [op, arg1, arg2] = parseInst(inst, memory);
    return opFunctions[op](memory, arg1, arg2);
}

function parseInst(inst: string, memory: Bytes): [op: Operator, arg1: Word, arg2: Word] {
    const parts = inst.split(' ');
    if(parts.length !== 3) throw new Error(`Invalid parts count! (Found: ${parts.length}, Expected: 3)`);
    
    const [op, arg1_str, arg2_str] = parts;
    const arg1 = parseArg(arg1_str, memory);
    const arg2 = parseArg(arg2_str, memory);

    if(!isOperator(op)) throw new Error(`op is not an Operator! (Found: ${op})`);

    return [op, arg1, arg2];
}

function parseArg(value: string, memory: Bytes): Word {
    return value.includes('$') ? parseReference(value, memory) : parseLiteral(value);
}

function parseReference(value: string, memory: Bytes): Word {
    const parts = value.split('$');
    if(parts.length !== 2) throw new Error(`Reference has invalid part count! (Found: ${parts}, Expected: length 2)`)

    const [bytes, address_raw] = parts;
    const address = parseInt(address_raw);

    const referenceValue = Bytes.word();
    switch(bytes) {
        case '8':
            referenceValue.setUint8(0, memory.getUint8(address));
            break;
        case '16':
            referenceValue.setUint16(0, memory.getUint16(address));
            break;
        case '32':
            referenceValue.setUint32(0, memory.getUint32(address));
            break;
        default:
            throw new Error(`Invalid byte length at reference! (Found: ${bytes}, Expected: 8, 16, 32)`);
    }

    return referenceValue;
}

const Literal = {
    UINT: 'u',
    INT: 'i',
    FLOAT: 'f',
} as const;
type Literal = typeof Literal[keyof typeof Literal];

function parseLiteral(value: string): Word {
    let literal: Literal | null = null;
    for(const l of Object.values(Literal)) {
        if(value.includes(l)) {
            literal = l;
            break;
        }
    }

    if(literal === null) {
        value = "32i" + value;
        literal = 'i';
    }

    const parts = value.split(literal);
    if(parts.length !== 2) throw new Error(`Literal has invalid part count! (Found: ${parts}, Expected: length 2)`);

    const [bytes, scalar_raw] = parts;
    const type = bytes + literal;

    const dataView = Bytes.word();
    switch(type) {
        case '8u':
            dataView.setUint8(0, parseInt(scalar_raw));
            break;
        case '16u':
            dataView.setUint16(0, parseInt(scalar_raw));
            break;
        case '32u':
            dataView.setUint32(0, parseInt(scalar_raw));
            break;
        case '8i':
            dataView.setInt8(0, parseInt(scalar_raw));
            break;
        case '16i':
            dataView.setInt16(0, parseInt(scalar_raw));
            break;
        case '32i':
            dataView.setInt32(0, parseInt(scalar_raw));
            break;
        case '32f':
            dataView.setFloat32(0, parseFloat(scalar_raw));
            break;
        default:
            throw new Error(`Invalid literal type! (Found: ${literal})`);
    }

    return dataView;
}