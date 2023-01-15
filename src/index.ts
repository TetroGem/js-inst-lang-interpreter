import { Bytes } from "./Bytes";
import { convertBytes } from "./convert-bytes";
import { interpretOn } from "./interpreter";

const mem = new Bytes(5);

// 0 1 2 3 4 5 6 7
// a b _a_ _b_ _s_

const code = `

add 4 8u10

addf 0 32f3

out 0 6
out 4 7

addf 0 32f2

out 0 6
out 4 7

divf 0 32f2

out 0 6
out 4 7

mulf 0 32f2

out 0 6
out 4 7

end 0 0

`;

interpretOn(code, mem);

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