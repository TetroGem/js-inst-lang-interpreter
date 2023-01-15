export type Byte = Bytes<1>;
export type Half = Bytes<2>;
export type Word = Bytes<4>;
export type Double = Bytes<8>;

export class Bytes<N extends number = number> {
    public static byte(): Byte {
        return new Bytes(1);
    }

    public static half(): Half {
        return new Bytes(2);
    }
    
    public static word(): Word {
        return new Bytes(4);
    }

    public static double(): Double {
        return new Bytes(8);
    }

    private readonly dataView: DataView;

    constructor(length: N) {
        this.dataView = new DataView(new ArrayBuffer(length));
    }

    private availableBytes(byteOffset: number, requestedLength: number): number {
        return Math.min(this.dataView.byteLength - byteOffset, requestedLength);
    }

    setBytes<L extends number>(byteOffset: number, bytes: Bytes<L>, length: L): void {
        if(length > bytes.length) throw new Error("Length is greater than bytes length");

        const availableBytes = this.availableBytes(byteOffset, length);
        for(let i = 0; i < availableBytes; i++) {
            this.dataView.setUint8(byteOffset + i, bytes.dataView.getUint8(i));
        }
    }

    getBytes<L extends number>(byteOffset: number, length: L): Bytes<L> {
        const bytes = new Bytes(length);
        const availableBytes = this.availableBytes(byteOffset, length);
        for(let i = 0; i < availableBytes; i++) {
            bytes.dataView.setUint8(i, this.dataView.getUint8(byteOffset + i));
        }
        return bytes;
    }

    setByte(byteOffset: number, byte: Byte): void {
        if(this.availableBytes(byteOffset, 1) === 1) this.dataView.setUint8(byteOffset, byte.dataView.getUint8(0));
        else this.setBytes(byteOffset, byte, 1);
    }

    getByte(byteOffset: number): Byte {
        if(this.availableBytes(byteOffset, 2) === 2) {
            const byte = Bytes.byte();
            byte.dataView.setUint8(0, this.dataView.getUint8(byteOffset));
            return byte;
        } else {
            return this.getBytes(byteOffset, 1);
        }
    }

    setHalf(byteOffset: number, half: Half): void {
        if(this.availableBytes(byteOffset, 2) === 2) this.dataView.setUint16(byteOffset, half.dataView.getUint16(0));
        else this.setBytes(byteOffset, half, 2);
    }

    getHalf(byteOffset: number): Half {
        if(this.availableBytes(byteOffset, 2) === 2) {
            const half = Bytes.half();
            half.dataView.setUint16(0, this.dataView.getUint16(byteOffset));
            return half;
        } else {
            return this.getBytes(byteOffset, 2);
        }
    }

    setWord(byteOffset: number, word: Word): void {
        if(this.availableBytes(byteOffset, 4) === 4) this.dataView.setUint32(byteOffset, word.dataView.getUint32(0));
        else this.setBytes(byteOffset, word, 4);
    }

    getWord(byteOffset: number): Word {
        if(this.availableBytes(byteOffset, 4) === 4) {
            const word = Bytes.word();
            word.dataView.setUint32(0, this.dataView.getUint32(byteOffset));
            return word;
        } else {
            return this.getBytes(byteOffset, 4);
        }
    }

    setDouble(byteOffset: number, double: Double): void {
        if(this.availableBytes(byteOffset, 8) === 8) this.dataView.setBigUint64(byteOffset, double.dataView.getBigUint64(0));
        else this.setBytes(byteOffset, double, 8);
    }

    getDouble(byteOffset: number): Double {
        if(this.availableBytes(byteOffset, 8) === 8) {
            const double = Bytes.double();
            double.dataView.setBigUint64(0, this.dataView.getBigUint64(byteOffset));
            return double;
        } else {
            return this.getBytes(byteOffset, 8);
        }
    }

    //~h exposed from DataView

    get length(): N {
        return this.dataView.byteLength as N;
    }

    setUint8(byteOffset: number, value: number): void {
        const byte = Bytes.byte();
        byte.dataView.setUint8(0, value);
        this.setByte(byteOffset, byte);
    }

    getUint8(byteOffset: number): number {
        return this.getByte(byteOffset).dataView.getUint8(0);
    }

    setUint16(byteOffset: number, value: number): void {
        const half = Bytes.half();
        half.dataView.setUint16(0, value);
        this.setHalf(byteOffset, half);
    }

    getUint16(byteOffset: number): number {
        return this.getHalf(byteOffset).dataView.getUint16(0);
    }

    setUint32(byteOffset: number, value: number): void {
        const word = Bytes.word();
        word.dataView.setUint32(0, value);
        this.setWord(byteOffset, word);
    }

    getUint32(byteOffset: number): number {
        return this.getWord(byteOffset).dataView.getUint32(0);
    }

    setInt8(byteOffset: number, value: number): void {
        const byte = Bytes.byte();
        byte.dataView.setInt8(0, value);
        this.setByte(byteOffset, byte);
    }

    getInt8(byteOffset: number): number {
        return this.getByte(byteOffset).dataView.getInt8(0);
    }

    setInt16(byteOffset: number, value: number): void {
        const half = Bytes.half();
        half.dataView.setInt16(0, value);
        this.setHalf(byteOffset, half);
    }

    getInt16(byteOffset: number): number {
        return this.getHalf(byteOffset).dataView.getInt16(0);
    }

    setInt32(byteOffset: number, value: number): void {
        const word = Bytes.word();
        word.dataView.setInt32(0, value);
        this.setWord(byteOffset, word);
    }

    getInt32(byteOffset: number): number {
        return this.getWord(byteOffset).dataView.getInt32(0);
    }

    setFloat32(byteOffset: number, value: number): void {
        const word = Bytes.word();
        word.dataView.setFloat32(0, value);
        this.setWord(byteOffset, word);
    }

    getFloat32(byteOffset: number): number {
        return this.getWord(byteOffset).dataView.getFloat32(0);
    }
}