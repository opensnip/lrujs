declare class LRUCache {
  size: number;
  constructor(options?: { maxSize?: number; ttl?: number });
  set: (key: any, value: any, options?: { ttl?: number }) => void;
  get: (key: any, callback?: (err: Error | null, value: any) => any) => any;
  delete: (key: any) => void;
  clear: () => void;
  has: (key: any) => boolean;
  forEach: (callback: (element: object, index?: number) => void) => void;
}

export default LRUCache;
