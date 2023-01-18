import { Bytes } from "./Bytes";
import { convertBytes } from "./convert-bytes";
import { interpretOn } from "./interpreter";
import { runOn } from "./parser";
import fs from 'fs';
import path from 'path';

const memory = new Bytes(9);
const filename = path.resolve(process.argv[2]);

fs.open(filename, 'r', (err, fd) => {
    if(err) throw err;

    fs.read(fd, (err, bytesRead, buffer) => {
        if(err) throw err;

        const program = buffer.buffer.slice(0, bytesRead);
        // console.log(memory);
        runOn(program, memory);
        // console.log(memory);
    });
});

// 0 1 2 3 4 5 6 7
// a b _a_ _b_ _s_

// const code = `

// add 8 

// `;

// interpretOn(code, mem);

// Fibonacci
/*

inp 6 0

add 0 16u1
add 2 16u1

out 0 2
out 2 2

jni 8$6 16
add 4 16$0
add 4 16$2

out 4 2

clr 0 2
add 0 16$2
clr 2 2
add 2 16$4
clr 4 2

sub 6 8u1
jmp 0 5


end 0 0
*/

// hello world
/*
add 64 8ch
add 65 8ce
add 66 8cl
add 67 8cl
add 68 8co

out 64 7
out 65 7
out 66 7
out 67 7
out 68 7

add 69 8u32
out 69 7

add 70 16cw
add 72 16co
add 74 16cr
add 76 16cl
add 78 16cd

out 70 8
out 72 8
out 74 8
out 76 8
out 78 8

end 0 0
*/