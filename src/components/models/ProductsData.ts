import { IProduct } from "../../types";

export class ProductsData {
    protected _items: IProduct[] = [];
    protected _preview: string | null = null;
   

    set items(items: IProduct[]) {
        this._items = items;
    }

    getItem(id: string) {
        return this._items.find((item) => item.id === id);
    }

    set preview(id: string | null) {
        this._preview = id;
       
    }

    get preview() {
        return this._preview;
    }

    get items() {
        return this._items;
    }
}
