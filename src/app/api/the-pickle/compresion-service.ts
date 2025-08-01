import { brotliCompressSync, brotliDecompressSync } from "zlib";

export const brotliCompressor = {
  compress(content: string) {
    const compressed = brotliCompressSync(Buffer.from(content));
    if (!compressed) throw new Error("Compression failed");
    return Buffer.from(compressed).toString("base64");
  },
  decompress(b64: string) {
    const decompressed = brotliDecompressSync(Buffer.from(b64, "base64"));
    if (!decompressed) throw new Error("Decompression failed");
    return Buffer.from(decompressed).toString("utf-8");
  },
};
