import './scss/styles.scss';
import { LarekApi } from './components/LarekApi'; 
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ProductsData } from './components/base/models/ProductsData'; 
import { BasketData } from './components/base/models/BasketData';     
import { UserData } from './components/base/models/UserData';
import { apiProducts } from './utils/data';
import { IProduct, IProductList } from './types';


const baseApi = new Api(API_URL);

const api = new LarekApi(CDN_URL, baseApi);

const productsModel = new ProductsData();
const basketModel = new BasketData();
const userModel = new UserData();


console.log('--- Тест ProductsData ---');

productsModel.items = apiProducts.items; 
console.log('Все товары (геттер items):', productsModel.items);

const testId = '854cef69-976d-4c2a-a18c-2aa45046c390';
console.log(`Получить товар по ID (${testId}):`, productsModel.getItem(testId));

productsModel.preview = testId;
console.log('ID товара в превью:', productsModel.preview);


console.log('--- Тест BasketData ---');
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

basketModel.add(product1);
basketModel.add(product2);
console.log('Товары в корзине:', basketModel.items);
console.log('Количество товаров:', basketModel.count());
console.log('Общая сумма:', basketModel.getTotal());


console.log(`Проверка наличия товара ${product1.id} (true):`, basketModel.contains(product1.id));
console.log(`Проверка наличия несуществующего товара (false):`, basketModel.contains('fake-id'));

basketModel.remove(product1.id);
console.log('После удаления одного товара (остался 1):', basketModel.items);
basketModel.clear();
console.log('После очистки (пусто):', basketModel.items);


console.log('--- Тест UserData ---');
userModel.setField('email', 'test@test.ru');
userModel.setField('phone', '+79991234567');
console.log('Ошибки валидации (ожидаем адрес и оплату):', userModel.validate());

userModel.setField('address', 'г. Волгоград, пр. Ленина');
userModel.setField('payment', 'card');
console.log('Ошибки валидации (ожидаем пустой объект):', userModel.validate());

console.log('Итоговые данные пользователя:', userModel.getUserData());
userModel.clear();
console.log('Данные после очистки (поля пустые, payment null):', userModel.getUserData());




console.log('--- Тест LarekApi ---');
api.getProductList()
    .then((data: IProductList) => {
        const updatedItems: IProduct[] = data.items.map((item: IProduct) => ({ 
            ...item,
            image: CDN_URL + item.image
        }));
        
        productsModel.items = updatedItems;
        
        console.log('Данные успешно загружены с сервера и обработаны:');
        console.log(productsModel.items);
    })
    .catch(err => {
        console.error('Ошибка при получении данных с сервера:', err);
    });
