import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsData {
    protected _items: IProduct[] = [];
    protected _preview: string | null = null;

    constructor(protected events: IEvents) {}

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('items:changed', { items: this._items });
    }

    get items() {
        return this._items;
    }

    getItem(id: string) {
        return this._items.find((item) => item.id === id);
    }

    set preview(id: string | null) {
        this._preview = id;
        if (id) {
            this.events.emit('preview:changed', this.getItem(id));
        }
    }

    get preview() {
        return this._preview;
    }
}
