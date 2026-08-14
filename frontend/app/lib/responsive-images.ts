const PRODUCT_FRAME_PATTERN =
  /^\/images\/sequence\/(frame_(?:0001|0030|0060|0090))\.webp$/;

export function productImageSrcSet(src: string): string | undefined {
  const match = PRODUCT_FRAME_PATTERN.exec(src);
  const frameName = match?.[1];
  if (!frameName) return undefined;

  const optimizedBase = `/images/optimized-v1/products/${frameName}`;

  return [
    `${optimizedBase}-256.webp 256w`,
    `${optimizedBase}-480.webp 480w`,
    `${optimizedBase}-768.webp 768w`,
    `${src} 1280w`,
  ].join(", ");
}
