//~h Operations

import type { Bytes, Word } from "./Bytes";

function clr(memory: Bytes, address: Word, value: Word): undefined {
    const addressInt = address.getUint32(0);
    const valueInt = value.getUint32(0);

    for(let i = 0; i < valueInt; i++) {
        memory.setUint8(addressInt + i, 0);
    }
    return undefined;
};

function out(memory: Bytes, address: Word, value: Word): number {
    const addressInt = address.getUint32(0);
    const valueInt = value.getUint32(0);

    switch(valueInt) {
        case 0: return memory.getUint8(addressInt);
        case 1: return memory.getInt8(addressInt);
        case 2: return memory.getUint16(addressInt);
        case 3: return memory.getInt16(addressInt);
        case 4: return memory.getUint32(addressInt);
        case 5: return memory.getInt32(addressInt);
        case 6: return memory.getFloat32(addressInt);
        default: throw new Error(`Invalid value for out operation! (Found: ${value}`);
    }
};

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

function jif(memory: Bytes, address: Word, value: Word): ['jmp', number] | undefined {
    const addressInt = address.getUint32(0);
    const conditionInt = memory.getUint32(addressInt);
    const targetLineInt = value.getUint32(0);

    return conditionInt === 0 ? undefined : ['jmp', targetLineInt];
}

function end(memory: Bytes, address: Word, value: Word): ['end'] {
    return ['end'];
}

//~h Exports

export const Operator = {
    CLEAR: 'clr',
    OUT: 'out',
    ADD: 'add',
    SUBTRACT: 'sub',
    ADD_FLOAT: 'addf',
    SUBTRACT_FLOAT: 'subf',
    JUMP_IF: 'jif',
    END: 'end',
} as const;
export type Operator = typeof Operator[keyof typeof Operator];

export function isOperator(value: unknown): value is Operator {
    return Object.values(Operator).includes(value as Operator);
}

type OperatorReturn = 
    undefined
    | number
    | ['jmp', number]
    | ['end'];

export const opFunctions: Record<Operator, (memory: Bytes, address: Word, value: Word) => OperatorReturn> = {
    clr, out, add, sub, addf, subf, jif, end,
} as const;