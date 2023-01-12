function insertBits(targetBits: number, insertBits: number, insertMask: number) {
    return targetBits ^ ((targetBits ^ insertBits) & insertMask)
}

export class Bytes {
    private bytes: Uint8Array

    constructor(bytes: number) {
        this.bytes = new Uint8Array(bytes);
    }

    setUInt8(address: number, value: number) {
        this.bytes[address] = value;
    }

    getUInt8(address: number) {
        return this.bytes[address];
    }

    setSInt8(address: number, value: number) {
        const sint8 = new Int8Array([value]);
        const uint8 = new Uint8Array(sint8)[0];
        this.setUInt8(address, uint8);
    }

    getSInt8(address: number) {
        const uint8 = this.bytes[address];
        const sint8 = new Int8Array(uint8)[0]
        return sint8;
    }
}