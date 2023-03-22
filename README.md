## Lrujs

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

Lrujs is a fast and lightweight least-recently-used cache for [Node.js](http://nodejs.org)

## Features

- Super Fast
- Lightweight
- TTL support

## Installation

Install using npm:

```console
$ npm i lrujs
```

Install using yarn:

```console
$ yarn add lrujs
```

## Example

```js
const LRUCache = require("lrujs");

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

## Introduction

Lrujs is a fast and lightweight caching library for javascript, lrujs support TTL (Time to live) and max cache size feature.
The default value for maxSize is 1000 and TTL is 0 milliseconds (0 means permanently), if you not set the max cache size and ttl then the default values are used.

Lrujs is also support TTL, but it is not a TTL cache, and does not make strong TTL guarantees. Lrujs will not automatically removes the expired items, but you can set a default TTL on the cache or on a single value. If you do so, it will treat expired items as missing, and delete them when they are fetched. You can set TTL in milliseconds.

#### Create a cache object:

```js
const LRUCache = require("lrujs");

// Create cache object
const cache = new LRUCache({
  maxSize: 10,
  ttl: 100,
});
```

#### Set a new data:

In lrujs any value (both objects and primitive values) may be used as either a key or a value.

```js
// Add new data in cache
cache.set("a", 10);

// Add new data in cache
cache.set("b", 10, { ttl: 200 }); // Expires after 200 ms
```

#### Get data:

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
cache.get("a", function (err, data) {
  if (err) return null;
  return data;
}); // undefined

cache.get("b", function (err, data) {
  if (err) return null;
  return data;
}); // null
```

#### Check data exists in cache

```js
// Add new data in cache
cache.set("a", undefined);

// Check data exists or not
cache.has("a"); // true
cache.has("b"); // false
```

#### Delete data:

```js
// Delete data
cache.delete("a");
```

#### Delete all data from cache:

```js
// Delete all data
cache.clear();
```

#### Get all data from cache:

```js
// Add new data in cache
cache.set("a", 10);

// Get all data
cache.forEach(function (data) {
  console.log(data); // {a: 10}
});
```

## License

[MIT License](https://github.com/routejs/router/blob/main/LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/lrujs
[npm-downloads-url]: https://npmcharts.com/compare/lrujs?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/lrujs
[npm-install-size-url]: https://packagephobia.com/result?p=lrujs
[npm-url]: https://npmjs.org/package/lrujs
[npm-version-image]: https://badgen.net/npm/v/lrujs
