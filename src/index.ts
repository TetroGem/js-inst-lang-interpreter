import { Bytes } from "./Bytes";
import { convertBytes } from "./convert-bytes";
import { interpretOn } from "./interpreter";

const mem = new Bytes(12);

// 0 1 2 3 4 5 6 7
// a b _a_ _b_ _s_

const code = `
addf 0 32f4
addf 4 32f10

addf 8 32$0
addf 8 32$4

out 8 6

end 0 0
`;

interpretOn(code, mem);