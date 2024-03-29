import LinkedList from "./linkedlist/index.mjs";

export default class Cache {
  #linkedList = null;
  #cache = null;
  #config = {
    ttl: 0,
    maxLength: 250,
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

    this.#config.maxLength = options.maxLength;
    this.#config.ttl = options.ttl;
    this.#config.interval = options.interval;
    this.#config.enableInterval =
      options.interval > 0 ? options.enableInterval : false;
    this.#linkedList = new LinkedList();
    this.#cache = new Map();

    // Automatically remove expires cache
    this.startInterval();
  }

  get length() {
    return this.#cache.size;
  }

  set(key, value, options = {}) {
    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    options.ttl =
      typeof options.ttl === "number" ? options.ttl : this.#config.ttl;

    const nodeValue = {
      key: key,
      value: value,
      createdAt: Date.now(),
      expiresAt: null,
      ttl: options.ttl,
      frequency: 0,
    };
    if (nodeValue.ttl > 0) {
      nodeValue.expiresAt = nodeValue.createdAt + nodeValue.ttl;
    }

    // Insert a new node at head
    const existingNode = this.#cache.get(key);
    // Update node data if node is already exists
    if (typeof existingNode !== "undefined") {
      existingNode.value = nodeValue;
      // Move current node to the head
      this.#linkedList.setHead(existingNode);
    } else {
      // Remove node if cache is full
      if (this.length === this.#config.maxLength) {
        this.#evict();
      }
      // Create new node and make attach it to the head
      const node = this.#linkedList.insertHead(nodeValue);
      this.#cache.set(key, node);
    }
  }

  get(key, callback = null) {
    try {
      if (callback && typeof callback !== "function") {
        throw new TypeError("callback should be a function");
      }

      const node = this.#cache.get(key);

      if (typeof node !== "undefined") {
        // Check node is live or not
        if (this.#isStale(node)) {
          this.delete(key);
          throw new Error(key + " Key not found");
        }

        // Move current node to the head
        this.#linkedList.setHead(node);

        if (callback) {
          return callback(null, node.value.value);
        } else {
          return node.value.value;
        }
      }

      throw new Error(key + " Key not found");
    } catch (err) {
      if (callback) {
        return callback(err, undefined);
      } else {
        return;
      }
    }
  }

  delete(key) {
    const node = this.#cache.get(key);

    if (typeof node !== "undefined") {
      this.#linkedList.delete(node);
      // Delete node
      this.#cache.delete(key);
    }
  }

  #evict() {
    if (this.#linkedList.tail === null) return;
    if (this.length !== this.#config.maxLength) return;
    this.delete(this.#linkedList.tail.value.key);
  }

  clear() {
    // Delete all data from cache
    this.#linkedList.clear();
    this.#cache.clear();
  }

  has(key) {
    const node = this.#cache.get(key);

    if (typeof node !== "undefined") {
      // Check node is live or not
      if (this.#isStale(node)) {
        this.delete(key);
      } else {
        return true;
      }
    }
    return false;
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

  // Iterate over cache using forEach loop
  forEach(callback) {
    if (callback && typeof callback !== "function") {
      throw new TypeError("callback should be a function");
    }

    let node = this.#linkedList.head;
    let index = 0;
    while (node) {
      let next = node.next;
      if (this.has(node.value.key)) {
        callback({ [node.value.key]: node.value.value }, index);
      }
      node = next;
      index++;
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
    if (!node.value.expiresAt) return false;
    return node.value.expiresAt - Date.now() <= 0;
  }

  // Iterator to iterate over cache with a 'for...of' loop
  *[Symbol.iterator]() {
    let node = this.#linkedList.head;
    while (node) {
      let next = node.next;
      if (this.has(node.value.key)) {
        yield { [node.value.key]: node.value.value };
      }
      node = next;
    }
  }
}
