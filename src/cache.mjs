import Node from "./node.mjs";

export default class LRUCache {
  #maxSize = 1000;
  #head = null;
  #tail = null;
  #cache = null;
  #ttl = 0;

  constructor(options = { maxSize: 1000, ttl: 0 }) {
    if (
      (typeof options.maxSize !== "undefined" &&
        typeof options.maxSize !== "number") ||
      options.maxSize < 0
    ) {
      throw new TypeError("maxSize should be positive integer value");
    }

    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    options.maxSize =
      typeof options.maxSize === "number" ? options.maxSize : 1000;
    options.ttl = typeof options.ttl === "number" ? options.ttl : 0;

    this.#maxSize = options.maxSize;
    this.#head = null;
    this.#tail = null;
    this.#cache = new Map();
    this.#ttl = options.ttl;
  }

  get size() {
    return this.#cache.size;
  }

  set(key, value, options = {}) {
    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    options.ttl = typeof options.ttl === "number" ? options.ttl : this.#ttl;

    // Insert new node at head
    const existingNode = this.#cache.get(key);
    // Move to head if node is already exists
    if (existingNode instanceof Node) {
      existingNode.value = value;
      this.#makeHead(existingNode);
      this.#cache.set(key, existingNode);
    } else {
      // Remove node if cache is full
      if (this.size === this.#maxSize) {
        this.delete(this.#tail.key);
      }
      // Create new node and make attach it to the head
      const node = new Node(key, value, options.ttl);
      if (this.#head instanceof Node) {
        this.#head.prev = node;
        node.next = this.#head;
        this.#head = node;
      } else {
        this.#head = this.#tail = node;
      }
      this.#cache.set(key, node);
    }
  }

  get(key, callback = null) {
    try {
      if (callback && typeof callback !== "function") {
        throw new TypeError("callback should be a function");
      }

      const node = this.#cache.get(key);

      if (node instanceof Node) {
        // Check node is live or not
        if (node.isStale) {
          this.delete(key);
          throw new Error(key + " Key not found");
        }

        // Move current node to the head
        this.#makeHead(node);

        if (callback) {
          return callback(null, node.value);
        } else {
          return node.value;
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

    if (node instanceof Node) {
      // Remove referance to current node
      if (node.prev !== null) {
        node.prev.next = node.next;
      }
      if (node.next !== null) {
        node.next.prev = node.prev;
      }

      // Set new head if node is head
      if (this.#head === node) {
        this.#head = node.next;
        if (this.#head !== null) {
          this.#head.prev = null;
        }
      }

      // Set new tail if node is tail
      if (this.#tail === node) {
        this.#tail = node.prev;
        if (this.#tail !== null) {
          this.#tail.next = null;
        }
      }

      // Delete node
      this.#cache.delete(key);
      delete node.prev;
      delete node.next;
    }
  }

  clear() {
    // Delete all data from cache
    this.#head = null;
    this.#tail = null;
    this.#cache.clear();
  }

  has(key) {
    const node = this.#cache.get(key);

    if (node instanceof Node) {
      // Check node is live or not
      if (node.isStale === false) {
        return true;
      }
      this.delete(key);
    }
    return false;
  }

  // Iterate over LRU cache using forEach loop
  forEach(callback) {
    if (callback && typeof callback !== "function") {
      throw new TypeError("callback should be a function");
    }

    let node = this.#head;
    let counter = 0;
    while (node) {
      if (node.isStale) {
        this.delete(node.key);
        node = node.next;
        continue;
      }
      callback({ [node.key]: node.value }, counter);
      node = node.next;
      counter++;
    }
  }

  #makeHead(node) {
    // Skip is its already a head node
    if (this.#head === node) {
      return;
    }

    // Remove referance to current node
    if (node.prev !== null) {
      node.prev.next = node.next;
    }
    if (node.next !== null) {
      node.next.prev = node.prev;
    }

    // Change tail if node is tail
    if (this.#tail === node) {
      this.#tail = node.prev;
    }

    // Make head node
    node.prev = null;
    node.next = this.#head;
    this.#head.prev = node;
    this.#head = node;
  }

  // Iterator to iterate over LRU cache with a 'for...of' loop
  *[Symbol.iterator]() {
    let node = this.#head;
    while (node) {
      if (node.isStale) {
        this.delete(node.key);
        node = node.next;
        continue;
      }
      yield { [node.key]: node.value };
      node = node.next;
    }
  }
}
