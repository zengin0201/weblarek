import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketData {
    protected _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    add(product: IProduct): void {
        this._items.push(product);
        this.events.emit('basket:changed', this._items);
    }

    remove(id: string): void {
        this._items = this._items.filter((item) => item.id !== id);
        this.events.emit('basket:changed', this._items);
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', this._items);
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
