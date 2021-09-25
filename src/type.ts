export enum Type {
  ISO = "iso"
}

export function isTypeFile(type: Type) {
  return type === Type.ISO;
}
