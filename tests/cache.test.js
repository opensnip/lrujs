const LRUCache = require("../index.cjs");

describe("Request test", () => {
  let cache = null;
  beforeEach(() => {
    cache = new LRUCache({ maxSize: 4, ttl: 100 });
  });

  test("Set data in cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
  });

  test("Get data from cache", () => {
    cache.set("a", 10);
    expect(cache.get("a")).toEqual(10);
    cache.set("b", { a: 10, b: 20 });
    expect(cache.get("b")).toEqual({ a: 10, b: 20 });
    expect(cache.get("c")).toEqual(undefined);
  });

  test("Change get return value using callback function", () => {
    cache.set("a", undefined);
    expect(
      cache.get("a", (err, value) => {
        if (!err) return value;
        return null;
      })
    ).toEqual(undefined);
    expect(
      cache.get("b", (err, value) => {
        if (!err) return value;
        return null;
      })
    ).toEqual(null);
  });

  test("Check data exists in cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
    expect(cache.has("b")).toEqual(false);
  });

  test("Delete data from cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
    cache.delete("a");
    expect(cache.has("a")).toEqual(false);
  });

  test("Delete all data from cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    expect(cache.has("a")).toEqual(true);
    cache.clear();
    expect(cache.has("a")).toEqual(false);
  });

  test("Check ttl for cache", async () => {
    cache.set("a", 10);
    cache.set("b", 20, { ttl: 0 });
    expect(cache.has("a")).toEqual(true);
    expect(cache.has("b")).toEqual(true);
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 200);
    });
    expect(cache.has("a")).toEqual(false);
    expect(cache.has("b")).toEqual(true);
  });
});
