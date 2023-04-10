module.exports = class Cache {
  #linkedList = null;
  #cache = null;
  #config = {
    ttl: 0,
    maxLength: 0,
    interval: 0,
    intervalId: null,
    enableInterval: false,
  };

  constructor(options = {}) {
    if (
      (typeof options.maxLength !== "undefined" &&
        typeof options.maxLength !== "number") ||
      options.maxLength < 0
    ) {
      throw new TypeError("maxLength should be positive integer value");
    }

    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    if (
      typeof options.enableInterval !== "undefined" &&
      typeof options.enableInterval !== "boolean"
    ) {
      throw new TypeError("enableInterval should be boolean");
    }

    if (
      (typeof options.interval !== "undefined" &&
        typeof options.interval !== "number") ||
      options.interval < 0
    ) {
      throw new TypeError("interval should be positive integer value");
    }

    options.maxLength =
      typeof options.maxLength === "number" ? options.maxLength : 250;
    options.ttl = typeof options.ttl === "number" ? options.ttl : 0;
    if (
      typeof options.interval === "number" &&
      typeof options.enableInterval !== "boolean"
    ) {
      options.enableInterval = true;
    }
    options.interval =
      typeof options.interval === "number" ? options.interval : 1000 * 60;
    options.enableInterval =
      typeof options.enableInterval === "boolean"
        ? options.enableInterval
        : false;

    this.#config.evictionPolicy = options.evictionPolicy;
    this.#config.maxLength = options.maxLength;
    this.#config.ttl = options.ttl;
    this.#config.interval = options.interval;
    this.#config.enableInterval =
      options.interval > 0 ? options.enableInterval : false;
    this.#cache = new Map();

    // Automatically remove expires cache
    this.startInterval();
  }

  get length() {
    return this.#cache.size;
  }

  set(key, value, options = {}) {
    // Insert a new node at head
    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    options.ttl =
      typeof options.ttl === "number" ? options.ttl : this.#config.ttl;

    const node = {
      key: key,
      value: value,
      createdAt: Date.now(),
      expiresAt: null,
      ttl: options.ttl,
      frequency: 0,
    };
    if (node.ttl > 0) {
      node.expiresAt = node.createdAt + node.ttl;
    }

    // Update node data if node is already exists
    if (this.#cache.has(key)) {
      const existingNode = this.#cache.get(key);
      existingNode.value = node.value;
      // Move current node to the head
      this.#cache.delete(key);
      this.#cache.set(key, existingNode);
    } else {
      // Remove node if cache is full
      if (this.length === this.#config.maxLength) {
        this.#evict();
      }
      // Create new node and make attach it to the head
      this.#cache.set(key, node);
    }
  }

  get(key, callback = null) {
    try {
      if (callback && typeof callback !== "function") {
        throw new TypeError("callback should be a function");
      }

      if (this.#cache.has(key)) {
        const node = this.#cache.get(key);
        // Check node is live or not
        if (this.#isStale(node)) {
          this.delete(key);
          throw new Error(key + " key not found");
        }

        // Move current node to the head
        this.#cache.delete(key);
        this.#cache.set(key, node);

        if (callback) {
          return callback(null, node.value);
        } else {
          return node.value;
        }
      }

      throw new Error(key + " key not found");
    } catch (err) {
      if (callback) {
        return callback(err, undefined);
      } else {
        return;
      }
    }
  }

  delete(key) {
    if (this.#cache.has(key)) {
      // Delete node
      this.#cache.delete(key);
    }
  }

  #evict() {
    if (this.length === 0) return;
    if (this.length !== this.#config.maxLength) return;

    for (const key of this.#cache.keys()) {
      this.delete(key);
      break;
    }
  }

  clear() {
    // Delete all data from cache
    this.#cache.clear();
  }

  startInterval() {
    // Interval already running
    if (this.#config.intervalId) return;
    // Interval is disabled
    if (!this.#config.enableInterval) return;

    this.#config.intervalId = setInterval(
      function (cache) {
        if (cache.length === 0) return;
        cache.forEach(function (data) {
          // Automatically invalidate expired cache
        });
      },
      this.#config.interval,
      this
    );
  }

  clearInterval() {
    if (this.#config.intervalId) {
      clearInterval(this.#config.intervalId);
    }
  }

  has(key) {
    if (this.#cache.has(key)) {
      const node = this.#cache.get(key);
      // Check node is live or not
      if (this.#isStale(node)) {
        this.delete(key);
      } else {
        return true;
      }
    }
    return false;
  }

  // Iterate over cache using forEach loop
  forEach(callback) {
    if (callback && typeof callback !== "function") {
      throw new TypeError("callback should be a function");
    }

    let index = 0;
    for (const data of this.#cache.entries()) {
      if (this.has(data[0])) {
        callback({ [data[0]]: data[1].value }, index);
        index++;
      }
    }
  }

  toArray() {
    let values = [];
    this.forEach(function (data) {
      values.push(data);
    });
    return values;
  }

  #isStale(node) {
    if (!node.expiresAt) return false;
    return node.expiresAt - Date.now() <= 0;
  }

  // Iterator to iterate over cache with a 'for...of' loop
  *[Symbol.iterator]() {
    for (const data of this.#cache.entries()) {
      if (this.has(data[0])) {
        yield { [data[0]]: data[1].value };
      }
    }
  }
};
