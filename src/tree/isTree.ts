type GenericObject = { [key: string]: any };

export default function isTree(obj: GenericObject) {
  const hasMainProperties = obj.name
  && !Number.isNaN(obj.size)
  && typeof obj.hash === "string"
  && !Number.isNaN(obj.modificatedAt)
  && !Number.isNaN(obj.createdAt);
  const hasOptionalProperties = (obj.createdAt === undefined || !Number.isNaN(obj.createdAt))
    && (obj.children === undefined || Array.isArray(obj.children));

  if (Array.isArray(obj.children)) {
    for (const c of obj.children) {
      if (!isTree(c))
        return false;
    }
  }

  return hasMainProperties && hasOptionalProperties;
}
