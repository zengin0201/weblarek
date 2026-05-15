import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsData } from './components/models/ProductsData';
import { BasketData } from './components/models/BasketData';
import { UserData } from './components/models/UserData';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { OrderForm, ContactsForm } from './components/View/OrderForms'; 
import { Success } from './components/View/Success'; 
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';

const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));
const productsModel = new ProductsData(events);
const basketModel = new BasketData(events);
const userModel = new UserData(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), { onClick: () => modal.close() });


const cardPreview = new CardPreview('card', cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('preview:toggle')
});

events.on('preview:toggle', () => {
    const item = productsModel.preview;
    if (item) {
        if (basketModel.contains(item.id)) {
            basketModel.remove(item.id);
        } else {
            basketModel.add(item); 
        }
        modal.close();
    }
});

events.on('items:changed', () => {
    page.catalog = productsModel.items.map(item => {
        const card = new CardCatalog('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
});

events.on('card:select', (item: IProduct) => {
    productsModel.preview = item; 
});

events.on('preview:changed', () => {
    const item = productsModel.preview;
    if (item) {
        const isAdded = basketModel.contains(item.id);
        modal.render({
            content: cardPreview.render({
                title: item.title,
                image: CDN_URL + item.image,
                text: item.description,
                price: item.price,
                category: item.category,
                buttonText: isAdded ? 'Удалить из корзины' : 'В корзину'
            })
        });
    }
});

events.on('basket:changed', () => {
    page.counter = basketModel.count();
    
    basket.items = basketModel.items.map((item, index) => {
        const card = new CardBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item)
        });
        return card.render({ title: item.title, price: item.price, index: index + 1 });
    });
    basket.total = basketModel.getTotal();
});


events.on('basket:remove', (item: IProduct) => {
    basketModel.remove(item.id);
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
});

events.on('order:open', () => {
    modal.render({ content: order.render() });
});

events.on('order:submit', () => {
    modal.render({ content: contacts.render() });
});

events.on(/(^order|^contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);
});

events.on('buyer:changed', () => {
    const errors = userModel.validate();
    const data = userModel.getUserData();

    order.address = data.address;
    order.payment = data.payment || '';
    contacts.email = data.email;
    contacts.phone = data.phone;

    order.valid = !errors.payment && !errors.address;
    order.errors = Object.values({payment: errors.payment, address: errors.address}).filter(i => !!i).join('; ');

    contacts.valid = !errors.email && !errors.phone;
    contacts.errors = Object.values({phone: errors.phone, email: errors.email}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
    const orderData = {
        ...userModel.getUserData(),
        total: basketModel.getTotal(),
        items: basketModel.items.map(i => i.id)
    };

    api.orderProducts(orderData)
        .then((result) => {
            basketModel.clear();
            userModel.clear();
            modal.render({
                content: success.render({ total: result.total })
            });
        })
        .catch(console.error);
});

events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

api.getProductList()
    .then(data => {
        productsModel.items = data.items;
    })
    .catch(console.error);
