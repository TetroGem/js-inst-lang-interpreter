type ByteArrayConstructor =
    Uint8ArrayConstructor
    | Uint16ArrayConstructor
    | Uint32ArrayConstructor
    | Int8ArrayConstructor
    | Int16ArrayConstructor
    | Int32ArrayConstructor
    | Float32ArrayConstructor
    ;

export function convertBytes(value: number, fromType: ByteArrayConstructor, toType: ByteArrayConstructor): number {
    const bytes = new fromType([value]).buffer;

    let elementBytes: ArrayBuffer | null = null;
    if(bytes.byteLength < toType.BYTES_PER_ELEMENT) {
        const insertOffset = Math.max(toType.BYTES_PER_ELEMENT - bytes.byteLength, 0);
        const subbyteOffset = Math.min(bytes.byteLength - toType.BYTES_PER_ELEMENT, 0);

        const subbyte = new Uint8Array(bytes.slice(subbyteOffset));
        const element = new Uint8Array(toType.BYTES_PER_ELEMENT);
        element.set(subbyte, 0);
        elementBytes = element.buffer;
    } else {
        elementBytes = bytes;
    }

    if(elementBytes === null) throw new Error("Element bytes is null!");
    const converted = new toType(elementBytes);
    return converted[0];
}