module.exports = class Node {
  constructor(key, value, ttl = 0) {
    if ((typeof ttl !== "undefined" && typeof ttl !== "number") || ttl < 0) {
      throw new TypeError("ttl should be positive integer value");
    }

    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
    this.createdAt = Date.now();
    if (ttl > 0) {
      this.ttl = ttl;
      this.expiresAt = this.createdAt + this.ttl;
    } else {
      this.ttl = 0;
      this.expiresAt = null;
    }
  }

  get isStale() {
    if (this.expiresAt === null) {
      return false;
    }
    return this.expiresAt - Date.now() <= 0;
  }
};
