export class ApiCache<T> {
  data: T | null;
  timestamp: number = 0;
  ttl: number = 24 * 60 * 60 * 1000; //one day is default

  constructor(data: T, ttl?: number, timestamp?: number) {
    this.data = data;
    if (ttl) this.ttl = ttl;
    if (timestamp) this.timestamp = timestamp;
  }

  /* Sets cache, uses now if date is undefined */
  set(data: T, date?: number) {
    this.data = data;
    this.timestamp = date ?? Date.now();
  }

  get() {
    return this.isValid() ? this.data : undefined
  }

  isValid() {
    return this.data && this.#getExp() > Date.now();
  }

  #getExp() {
    return this.timestamp + this.ttl;
  }

  invalidate() {
    this.data = null;
    this.timestamp = 0;
  }
}
