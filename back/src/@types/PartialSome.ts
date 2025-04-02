export type PartialSome<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

export type PartialExceptSome<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P];
};
