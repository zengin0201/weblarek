import { IApi, IProduct, IOrder, IOrderResult, IProductList } from './types';

export interface ILarekApi {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
    readonly cdn: string;
    private _api: IApi;

    constructor(cdn: string, api: IApi) {
        this.cdn = cdn;
        this._api = api;
    }

    
    getProductList(): Promise<IProduct[]> {
        return this._api.get<IProductList>('/product').then((data: IProductList) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    
    getProductItem(id: string): Promise<IProduct> {
        return this._api.get<IProduct>(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image
        }));
    }

    
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}