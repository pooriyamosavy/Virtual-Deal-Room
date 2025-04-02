export type MakeNullable<T> = {
  [K in keyof T]: T[K] | null | undefined;
};
