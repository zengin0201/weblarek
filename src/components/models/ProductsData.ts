
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsData {
    protected _items: IProduct[] = [];
    protected _preview: IProduct | null = null; 

    constructor(protected events: IEvents) {}

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('items:changed');
    }

    get items() {
        return this._items;
    }

    getItem(id: string) {
        return this._items.find((item) => item.id === id);
    }

    set preview(item: IProduct | null) { 
        this._preview = item;
        if (item) {
            this.events.emit('preview:changed');
        }
    }

    get preview() {
        return this._preview;
    }
}
