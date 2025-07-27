export class ApiCache<T> {
  data: T | null;
  date: number = 0;
  exp: number = 24 * 60 * 60 * 1000; //one day is default

  constructor(data: T, date?: number, exp?: number) {
    this.data = data;
    if (date) {
      this.date = date;
    }
    if (exp) {
      this.exp = exp;
    }
  }

  /* Sets cache, uses now if date is undefined */
  set(data: T, date?: number) {
    this.data = data;
    this.date = date ?? Date.now();
  }

  isValid() {
    return this.date + this.exp > Date.now();
  }

  invalidate() {
    this.date = 0;
  }
}
