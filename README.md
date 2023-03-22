## Lrujs

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

Lrujs is a fast and lightweight lru (least-recently-used) caching library for javascript.

In LRU (least-recently-used) cache, when new data is added and if cache if full, it will automatically removes the least recently used data from cache and insert the new data in the cache.

Lrujs support TTL (Time to live) and max cache size feature.
The default value for maxSize is 1000 and for TTL is 0 milliseconds (0 means permanently), if you will not set the max cache size and ttl then default values will be used.

Lrujs support TTL, but it is not a TTL cache, and also does not make strong TTL guarantees. Lrujs will not removes the expired items from cache periodically, but you can set the default TTL on cache or on a single value. If you do so, it will treat expired items as missing, and delete them when they are fetched.

## Features

- Super Fast
- Lightweight
- TTL support
- Customised return value

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

A simple lru cache example:

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

// Get all data from cache
cache.forEach(function (data) {
  console.log(data);
});

// Delete data from cache
cache.delete("a");

// Delete all data from cache
cache.clear();
```

## Create a new cache object

When we create a new cache we set the max cache size and ttl, but it is not mandatory.

```js
const LRUCache = require("@opensnip/lrujs");

// Create cache object
const cache = new LRUCache({
  maxSize: 10, // Optional
  ttl: 100, // Optional
});
```

## Set a new data

In lrujs any value (both objects and primitive values) may be used as either a key or a value. If you set the duplicate item in the cache, then it will replace the old item.
You can also set the TTL for a single item
```js
// Add new data in cache
cache.set("a", 10);

// Add duplicate data
cache.set("a", 20); // Replace the old value

// Add new data in cache
cache.set("b", 10, { ttl: 200 }); // Expires after 200 ms
```

## Get data from cache

Access data from the cache, if data is not in the cache by default lrujs will return undefined value.

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

Check weather data is exist in the cache or not.

```js
// Add new data in cache
cache.set("a", undefined);

// Check data exists or not
cache.has("a"); // true
cache.has("b"); // false
```

## Delete data from cache

Remove data from cache.

```js
// Delete data
cache.delete("a");
```

## Delete all data from cache

Remove all data from the cache.

```js
// Delete all data
cache.clear();
```

## Get all data from cache

Get all data from the cache.

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
