import './scss/styles.scss';
import { LarekApi } from './LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Productsdata } from './models/ProductsData'; 
import { BasketData } from './models/BasketData';     
import { UserData } from './models/UserData';
import { apiProducts } from './utils/data';


const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(CDN_URL, baseApi);
const productsModel = new Productsdata(events);
const basketModel = new BasketData(events);
const userModel = new UserData(events);


console.log('--- Тест ProductsData ---');
productsModel.setItems(apiProducts.items);
console.log('Все товары:', productsModel.items);
console.log('Получить товар по ID:', productsModel.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));


console.log('--- Тест BasketData ---');
basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.items);
console.log('Количество товаров:', basketModel.count());
console.log('Общая сумма:', basketModel.getTotal());
basketModel.remove(apiProducts.items[0].id);
console.log('После удаления товара:', basketModel.items);
basketModel.clear();
console.log('После очистки:', basketModel.items);


console.log('--- Тест UserData ---');
userModel.setField('email', 'test@test.ru');
userModel.setField('phone', '+79991234567');
console.log('Данные пользователя с ошибками валидации (нет адреса):', userModel.validate());
userModel.setField('address', 'г. Москва, ул. Пушкина');
console.log('Данные пользователя без ошибок:', userModel.validate());
console.log('Готовые данные для отправки:', userModel.getUserData());
userModel.clear();

events.on('items:changed', () => {
    console.log('Каталог обновлен:', productsModel.items);
});


api.getProductList()
    .then(items => {
        productsModel.setItems(items);
    })
    .catch(err => console.error('Ошибка загрузки:', err));


    


