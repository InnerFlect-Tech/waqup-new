/**
 * Node.js 18+ ships undici types that declare a restricted `FormData` global
 * missing `get`, `set`, `has`, `delete`, etc. This augmentation restores the
 * standard DOM FormData interface so route handlers can call formData.get().
 */
interface FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
  delete(name: string): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob, fileName?: string): void;
  forEach(
    callback: (value: FormDataEntryValue, key: string, parent: FormData) => void,
    thisArg?: unknown
  ): void;
  [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
  entries(): IterableIterator<[string, FormDataEntryValue]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<FormDataEntryValue>;
}
