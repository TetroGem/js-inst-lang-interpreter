import { Bytes } from "./bytes";
import { interpretOn } from "./interpreter";

const mem = new Bytes(8);

const code = `
set 255 8u0 8u5
`;


interpretOn(code, mem);