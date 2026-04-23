import { IProduct } from "../../types";

export class BasketData {
  private _items: IProduct[] = [];

  add(product: IProduct): void {
    this._items.push(product);
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce((acc, item) => acc + (item.price || 0), 0);
  }

  count(): number {
    return this._items.length;
  }

  contains(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }

  get items(): IProduct[] {
    return this._items;
  }
}
