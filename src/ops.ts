import promptSync from "prompt-sync";
import type { Bytes, Word } from "./Bytes";

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
} as const;
export type Type = typeof Type[keyof typeof Type];

//~h Operations

function clr(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const valueInt = value.getUint32(0);

    for(let i = 0; i < valueInt; i++) {
        memory.setUint8(addressInt + i, 0);
    }
    return undefined;
};

function inp(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const valueInt = value.getUint32(0);

    const input = prompt("");
    switch(valueInt) {
        case Type.UINT8: memory.setUint8(addressInt, parseInt(input)); break;
        case Type.INT8: memory.setInt8(addressInt, parseInt(input)); break;
        case Type.UINT16: memory.setUint16(addressInt, parseInt(input)); break;
        case Type.INT16: memory.setInt16(addressInt, parseInt(input)); break;
        case Type.UINT32: memory.setUint32(addressInt, parseInt(input)); break;
        case Type.INT32: memory.setInt32(addressInt, parseInt(input)); break;
        case Type.FLOAT32: memory.setFloat32(addressInt, parseFloat(input)); break;
        default: throw new Error(`Invalid value for inp operation! (Found: ${value})`);
    }

    return undefined;
}

function out(memory: Bytes, address: Word, value: Word): number | string {
    const addressInt = address.getUint32(0);
    const valueInt = value.getUint32(0);

    switch(valueInt) {
        case Type.UINT8: return memory.getUint8(addressInt);
        case Type.INT8: return memory.getInt8(addressInt);
        case Type.UINT16: return memory.getUint16(addressInt);
        case Type.INT16: return memory.getInt16(addressInt);
        case Type.UINT32: return memory.getUint32(addressInt);
        case Type.INT32: return memory.getInt32(addressInt);
        case Type.FLOAT32: return memory.getFloat32(addressInt);
        case Type.CHAR8: return String.fromCharCode(memory.getUint8(addressInt));
        case Type.CHAR16: return String.fromCharCode(memory.getUint16(addressInt));
        default: throw new Error(`Invalid value for out operation! (Found: ${value}`);
    }
};

function rdb(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const lengthInt = value.getUint32(0);

    const input = prompt("");
    for(let i = 0; i < Math.min(lengthInt, input.length); i++) {
        memory.setUint8(addressInt + i, input.charCodeAt(i));
    }

    return undefined;
}

function rdh(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const lengthInt = value.getUint32(0);

    const input = prompt("");
    for(let i = 0; i < Math.min(lengthInt, input.length); i++) {
        memory.setUint16(addressInt + (i * 2), input.charCodeAt(i));
    }

    return undefined;
}

function add(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);
    
    const sumInt = currentInt + valueInt;

    memory.setUint32(addressInt, sumInt);
    return undefined; 
};

function addf(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentFloat = memory.getFloat32(addressInt);
    const valueFloat = value.getFloat32(0);
    
    const sumFloat = currentFloat + valueFloat;

    memory.setFloat32(addressInt, sumFloat);
    return undefined; 
};

function sub(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);
    
    const differenceInt = currentInt - valueInt;

    memory.setUint32(addressInt, differenceInt);
    return undefined; 
};

function subf(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentFloat = memory.getFloat32(addressInt);
    const valueFloat = value.getFloat32(0);
    
    const differenceFloat = currentFloat - valueFloat;

    memory.setFloat32(addressInt, differenceFloat);
    return undefined; 
};

function mul(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);
    
    const productInt = currentInt * valueInt;

    memory.setUint32(addressInt, productInt);
    return undefined; 
};

function mulf(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentFloat = memory.getFloat32(addressInt);
    const valueFloat = value.getFloat32(0);
    
    const productFloat = currentFloat * valueFloat;

    memory.setFloat32(addressInt, productFloat);
    return undefined; 
};

function div(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);
    
    const quotientInt = currentInt / valueInt;

    memory.setUint32(addressInt, quotientInt);
    return undefined; 
};

function divf(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentFloat = memory.getFloat32(addressInt);
    const valueFloat = value.getFloat32(0);
    
    const quotientFloat = currentFloat / valueFloat;

    memory.setFloat32(addressInt, quotientFloat);
    return undefined; 
};

function mod(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);
    
    const remainderInt = currentInt % valueInt;

    memory.setUint32(addressInt, remainderInt);
    return undefined; 
};

function modf(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentFloat = memory.getFloat32(addressInt);
    const valueFloat = value.getFloat32(0);
    
    const remainderFloat = currentFloat % valueFloat;

    memory.setFloat32(addressInt, remainderFloat);
    return undefined; 
};

function and(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const andInt = currentInt & valueInt;

    memory.setUint32(addressInt, andInt);
    return undefined;
}

function ior(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const orInt = currentInt | valueInt;

    memory.setUint32(addressInt, orInt);
    return undefined;
}

function xor(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const xorInt = currentInt ^ valueInt;

    memory.setUint32(addressInt, xorInt);
    return undefined;
}

function not(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const notInt = ~currentInt;

    memory.setUint32(addressInt, notInt);
    return undefined;
}

function shl(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const shiftInt = currentInt << valueInt;

    memory.setUint32(addressInt, shiftInt);
    return undefined;
}

function shr(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const currentInt = memory.getUint32(addressInt);
    const valueInt = value.getUint32(0);

    const shiftInt = currentInt >> valueInt;

    memory.setUint32(addressInt, shiftInt);
    return undefined;
}

function jmp(memory: Bytes, address: Word, value: Word): ['jmp', number] {
    const targetLineInt = value.getUint32(0);

    return ['jmp', targetLineInt];
}

function jif(memory: Bytes, condition: Word, value: Word): ['jmp', number] | undefined {
    const conditionInt = condition.getUint32(0);
    const targetLineInt = value.getUint32(0);

    return conditionInt !== 0 ? ['jmp', targetLineInt] : undefined;
}

function jni(memory: Bytes, condition: Word, value: Word): ['jmp', number] | undefined {
    const conditionInt = condition.getUint32(0);
    const targetLineInt = value.getUint32(0);

    return conditionInt === 0 ? ['jmp', targetLineInt] : undefined;
}

function end(memory: Bytes, address: Word, value: Word): ['end'] {
    return ['end'];
}

//~h Exports

export const Operator = {
    CLEAR: 'clr',
    INPUT: 'inp',
    OUT: 'out',
    READ_BYTES: 'rdb',
    READ_HALFS: 'rdh',
    JUMP: 'jmp',
    JUMP_IF: 'jif',
    JUMP_NOT_IF: 'jni',
    END: 'end',
    ADD: 'add',
    SUBTRACT: 'sub',
    ADD_FLOAT: 'addf',
    SUBTRACT_FLOAT: 'subf',
    MULTIPLY: 'mul',
    MULTIPLY_FLOAT: 'mulf',
    DIVIDE: 'div',
    DIVIDE_FLOAT: 'divf',
    MOD: 'mod',
    MOD_FLOAT: 'modf',
    AND: 'and',
    IOR: 'ior',
    XOR: 'xor',
    NOT: 'not',
    SHIFT_LEFT: 'shl',
    SHIFT_RIGHT: 'shr',
} as const;
export type Operator = typeof Operator[keyof typeof Operator];

export function isOperator(value: unknown): value is Operator {
    return Object.values(Operator).includes(value as Operator);
}

type OperatorReturn = 
    undefined
    | number
    | string
    | ['jmp', number]
    | ['end']
    ;

export const opFunctions: Record<Operator, (memory: Bytes, address: Word, value: Word) => OperatorReturn> = {
    clr, inp, out, rdb, rdh, jmp, jif, jni, end,
    add, sub, addf, subf, mul, mulf, div, divf, mod, modf,
    and, ior, xor, not, shl, shr,
} as const;