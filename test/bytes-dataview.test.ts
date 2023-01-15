import { Bytes } from "../src/Bytes";

describe('dataview', () => {
    it('store and get words', () => {
        const mem = new DataView(new ArrayBuffer(8));
        mem.setUint32(0, 2048);
        mem.setUint32(4, 60000);
        expect(mem.getUint32(0)).toBe(2048);
        expect(mem.getUint32(4)).toBe(60000);
    });

    it('use DataView to store byte, get as word, store as word, get byte', () => {
        const mem = new DataView(new ArrayBuffer(8));

        mem.setUint8(4, 5); // store 5u8 at 4
        expect(mem.getUint8(4)).toBe(5); // get u8 at 0, should be 5

        const wordInt = mem.getUint32(4); // get word from 4
        const wordDataView = new DataView(new ArrayBuffer(4)); // create new DataView just for this word
        wordDataView.setUint32(0, wordInt); // store word in DataView
        expect(wordDataView.getUint8(0)).toBe(5); // 5 should still be in first byte of word
        expect(wordDataView.getUint16(0)).toBeGreaterThan(5); // when reading from 0 as a u16, should be greater than 5 as 5 is in the upper byte

        wordDataView.setUint8(0, 10); // set first byte to 10 of word
        expect(wordDataView.getUint8(0)).toBe(10); // 10 should now be in first byte of word

        mem.setUint32(4, wordDataView.getUint32(0)); // reinsert word back into memory at address 4
        expect(mem.getUint8(4)).toBe(10); // get u8 at 4, should now be 10 as it was updated
    });

    it('use Bytes to store byte, get as word, store as word, get byte', () => {
        const mem = new Bytes(8);

        mem.setUint8(4, 5); // store 5u8 at 4
        expect(mem.getUint8(4)).toBe(5); // get u8 at 0, should be 5

        const word = mem.getWord(4); // get word at 4
        expect(word.getUint8(0)).toBe(5); // 5 should still be in first byte of word
        expect(word.getUint16(0)).toBeGreaterThan(5); // when reading from 0 as a u16, should be greater than 5 as 5 is in the upper byte

        word.setUint8(0, 10); // set first byte to 10 of word
        expect(word.getUint8(0)).toBe(10); // 10 should now be in first byte of word

        mem.setWord(4, word); // reinsert word back into memory at address 4
        expect(mem.getUint8(4)).toBe(10); // get u8 at 4, should now be 10 as it was updated
    });

    it('store word into Bytes at cutoff', () => {
        const mem = new Bytes(8);
        const word = mem.getWord(6); // get word at 6, last two bytes should always be 0 since it goes past the end of the buffer
        word.setUint8(0, 10); // set byte 0 to uint8 10
        word.setUint8(1, 20); // set byte 1 to uint8 20
        word.setUint8(2, 40); // set byte 2 to uint8 40
        word.setUint8(3, 80); // set byte 3 to uint8 80
        mem.setWord(6, word); // store word back into memory at address 6, last to bytes of whatever was in word should be ignored, bytes 6 and 7 should be set though
        expect(mem.getUint8(6)).toBe(10); // get u8 at 6, should be 10
        expect(mem.getUint8(7)).toBe(20); // get u8 at 7, should be 20
    });
});

export {};