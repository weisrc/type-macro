import { expect, it } from "bun:test";
import { getErrors, is, withErrors, type Format } from "../src";

it("should validate objects", () => {
  const check = withErrors(is<{ name: string; age: number }>());

  expect(check({ name: "John", age: 30 })).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check({ name: "John" })).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "missing-property",
      target: "age",
      path: [],
    },
  ]);
  expect(check({ age: 30 })).toBe(false);
  expect(check({ name: "John", age: "30" })).toBe(false);
  expect(check("John")).toBe(false);
});

it("should validate arrays", () => {
  const check = withErrors(is<number[]>());

  expect(check([1, 2, 3])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check([1, "2", 3])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: [1],
    },
  ]);
  expect(check("123")).toBe(false);
});

it("should validate tuples", () => {
  const check = withErrors(is<[number, string]>());

  expect(check([1, "2"])).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check([1, 2])).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "string",
      path: [1],
    },
  ]);
  expect(check([1])).toBe(false);
  expect(check("123")).toBe(false);
});

it("should validate unions", () => {
  const check = withErrors(is<number | string>());

  expect(check(123)).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check("123")).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check(true)).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "string",
      path: [],
    },
    {
      type: "invalid-type",
      target: "number",
      path: [],
    },
  ]);
});

it("should validate intersections", () => {
  const check = is<{ name: string } & { age: number }>();

  expect(check({ name: "John", age: 30 })).toBe(true);
  expect(check({ name: "John" })).toBe(false);
  expect(check({ age: 30 })).toBe(false);
  expect(check("John")).toBe(false);
});

it("should validate optional properties", () => {
  const check = withErrors(is<{ name: string; age?: number }>());

  expect(check({ name: "John" })).toBe(true);
  expect(getErrors()).toEqual([]);
  expect(check({ name: "John", age: undefined })).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "number",
      path: ["age"],
    },
  ]);
  expect(check({ age: 30 })).toBe(false);
});

it("should validate discriminated unions", () => {
  type Dog = { type: "dog"; name: string };
  type Cat = { type: "cat"; age: number };
  type Pet = Dog | Cat;

  const check = withErrors(is<Pet>());
  expect(check({ type: "dog", name: "Rex" })).toBe(true);
  expect(getErrors()).toEqual([]);

  expect(check({ type: "cat", age: 5 })).toBe(true);
  expect(getErrors()).toEqual([]);

  expect(check({ type: "dog", age: 5 })).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "missing-property",
      target: "name",
      path: [],
    },
  ]);

  expect(check({ type: "cat", name: "Rex" })).toBe(false);
  expect(check({ type: "bird" })).toBe(false);
  expect(check({})).toBe(false);
  expect(check({ type: "dog" })).toBe(false);
});

it("should validate record types", () => {
  const check = withErrors(is<Record<string & Format<"email">, number>>());

  expect(check({ "abc@abc.org": 1, "john@example.org": 2 })).toBe(true);
  expect(getErrors()).toEqual([]);

  expect(check({ a: "1", b: 2 })).toBe(false);
  expect(getErrors()).toEqual([]);
  
  expect(check({ a: 1, b: "2" })).toBe(false);
  expect(getErrors()).toEqual([]);
  
  expect(check("123")).toBe(false);
  expect(getErrors()).toEqual([
    {
      type: "invalid-type",
      target: "object",
      path: [],
    },
  ]);
});
