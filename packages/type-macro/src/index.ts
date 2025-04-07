export function macro<T, P extends string>() {
  return (() => {
    throw new Error("Not implemented");
  }) as unknown as T & {
    __macro: P;
  };
}

export type Annotation<T extends string, U> = {
  __annotation?: {
    [key in T]: U;
  };
};
