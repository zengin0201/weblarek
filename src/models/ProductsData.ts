import { IProduct } from '../types';
import { IEvents } from '../components/base/Events';

export class Productsdata {
    protected _items: IProduct[] = [];
    protected _preview: string | null = null;

   
    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]) {
        this._items = items;
        
        this.events.emit('items:changed', { items: this._items });
    }

    getItem(id: string) {
        return this._items.find((item) => item.id === id);
    }

    set preview(id: string | null) {
        this._preview = id;
        this.events.emit('preview:changed', { id });
    }

    get preview() {
        return this._preview;
    }

    get items() {
        return this._items;
    }
}