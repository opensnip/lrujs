## Lrujs

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

Lrujs is a fast and lightweight lru (least-recently-used) caching library for javascript.

A LRU (least-recently-used) cache will automatically removes the least recently used data from cache when a new data is added to the cache and cache is full.

Lrujs support TTL (Time to live) and max cache size feature.
The default value for maxSize is 1000 and TTL is 0 milliseconds (0 means permanently), if you not set the max cache size and ttl then the default values are used.

Lrujs is also support TTL, but it is not a TTL cache, and does not make strong TTL guarantees. Lrujs will not automatically removes the expired items, but you can set a default TTL on the cache or on a single value. If you do so, it will treat expired items as missing, and delete them when they are fetched. You can set TTL in milliseconds.

## Features

- Super Fast
- Lightweight
- TTL support

## Installation

Install using npm:

```console
$ npm i @opensnip/lrujs
```

Install using yarn:

```console
$ yarn add @opensnip/lrujs
```

## Example

```js
const LRUCache = require("@opensnip/lrujs");

// Create cache object
const cache = new LRUCache();

// Add data in cache
cache.set("a", 10);

// Check data exists in cache
cache.has("a");

// Get data from cache
console.log(cache.get("a"));

// Get data from cache
cache.delete("a");

// Get all data from cache
cache.forEach(function (data) {
  console.log(data);
});
```

## Create a new cache object

```js
const LRUCache = require("@opensnip/lrujs");

// Create cache object
const cache = new LRUCache({
  maxSize: 10,
  ttl: 100,
});
```

## Set a new data

In lrujs any value (both objects and primitive values) may be used as either a key or a value.

```js
// Add new data in cache
cache.set("a", 10);

// Add new data in cache
cache.set("b", 10, { ttl: 200 }); // Expires after 200 ms
```

## Get data from cache

```js
// Add new data in cache
cache.set("a", 10);

// Get data
cache.get("a"); // 10
```

If key is not exists in the cache it will return the undefined value, but undefined also can be the value for a key for this kind of situation you can customise the return value of `cache.get` function or check data exists in the cache or not.

```js
// Add new data in cache
cache.set("a", undefined);

cache.get("a"); // undefined
cache.get("b"); // undefined

// Set return value of get function
cache.get("a", function (err, value) {
  if (err) return null;
  return value;
}); // undefined

cache.get("b", function (err, value) {
  if (err) return null;
  return value;
}); // null
```

## Check data exists in cache

```js
// Add new data in cache
cache.set("a", undefined);

// Check data exists or not
cache.has("a"); // true
cache.has("b"); // false
```

## Delete data from cache

```js
// Delete data
cache.delete("a");
```

## Delete all data from cache

```js
// Delete all data
cache.clear();
```

## Get all data from cache

```js
// Add new data in cache
cache.set("a", 10);

// Get all data
cache.forEach(function (data) {
  console.log(data); // {a: 10}
});
```

## License

[MIT License](https://github.com/opensnip/lrujs/blob/main/LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/@opensnip/lrujs
[npm-downloads-url]: https://npmcharts.com/compare/@opensnip/lrujs?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/@opensnip/lrujs
[npm-install-size-url]: https://packagephobia.com/result?p=@opensnip/lrujs
[npm-url]: https://npmjs.org/package/@opensnip/lrujs
[npm-version-image]: https://badgen.net/npm/v/@opensnip/lrujs
