import type { Bytes } from "./bytes";
import { opFunctions, type Operator, isOperator } from "./ops";

export function interpretOn(code: string, memory: Bytes) {
    const insts = code.split('\n');
    for(const inst of insts) {
        if(inst.length === 0) continue;
        parseInstTo(inst, memory);
    }
}

function parseInstTo(inst: string, memory: Bytes) {
    const [op, arg1, arg2] = splitInst(inst); 
    const result = opFunctions[op](memory, arg1, arg2);
    if(result !== undefined) console.log(result);
}

function splitInst(inst: string): [op: Operator, arg1: number, arg2: number] {
    const parts = inst.split(' ');
    if(parts.length !== 3) throw new Error(`Invalid parts count! (Found: ${parts.length}, Expected: 3)`);
    
    const [op, arg1_str, arg2_str] = parts;
    const arg1 = Number.parseInt(arg1_str);
    const arg2 = Number.parseInt(arg2_str);

    if(!isOperator(op)) throw new Error(`op is not an Operator! (Found: ${op})`);
    if(Number.isNaN(arg1)) throw new Error(`arg1 is not a number! (Found: ${arg1_str})`);
    if(Number.isNaN(arg2)) throw new Error(`arg2 is not a number! (Found: ${arg2_str})`);

    return [op, arg1, arg2];
}