import { IProduct } from "../types";
import { IEvents } from "../components/base/Events";
export class BasketData {
  _items: IProduct[] = [];
  constructor(protected events: IEvents) {}

  add(product: IProduct) {
    this._items.push(product);
    this.events.emit("basket:changed", this._items);
  }

  remove(id: string) {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", this._items);
  }

  clear() {
    this._items = [];
    this.events.emit("basket:changed", this._items);
  }
  getTotal() {
    return this._items.reduce((acc, item) => acc + (item.price || 0), 0);
  }
  count() {
    return this._items.length;
  }
  contains(id: string) {
    return this._items.some((item) => item.id === id);
  }
  get items() {
    return this._items;
  }
}
