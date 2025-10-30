type ClassDictionary = Record<string, boolean | undefined | null>;
type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassValue[]
  | null
  | undefined
  | boolean;

function collectClasses(value: ClassValue, target: string[]) {
  if (!value) return;
  if (typeof value === "string" || typeof value === "number") {
    const trimmed = String(value).trim();
    if (trimmed) target.push(trimmed);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectClasses(item, target));
    return;
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([key, flag]) => {
      if (flag) target.push(key);
    });
  }
}

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  inputs.forEach((value) => collectClasses(value, classes));
  return classes.join(" ");
}
