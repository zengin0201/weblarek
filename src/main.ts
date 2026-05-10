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
import { Card } from './components/View/Card';
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
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);


events.on('items:changed', () => {
    page.catalog = productsModel.items.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
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
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketModel.contains(item.id)) {
                basketModel.remove(item.id);
                // card.buttonText = 'В корзину';
            } else {
                basketModel.add(item); 
                // card.buttonText = 'Удалить из корзины';
            }
            modal.close()
        }
    });

    const isAdded = basketModel.contains(item.id);
    modal.render({
        content: card.render({
            title: item.title,
            image: CDN_URL + item.image,
            text: item.description,
            price: item.price,
            category: item.category,
            buttonText: isAdded ? 'Удалить из корзины' : 'В корзину'
        })
    });
});

events.on('basket:changed', () => {
    page.counter = basketModel.count();
});

events.on('basket:open', () => {
    const basket = new Basket(cloneTemplate(basketTemplate), events);
    
    const items = basketModel.items.map((item) => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => basketModel.remove(item.id)
        });
        return card.render({ title: item.title, price: item.price });
    });

    modal.render({
        content: basket.render({
            items,
            total: basketModel.getTotal()
        })
    });
});


events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: null,
            address: '',
            valid: false,
            errors: ""
        })
    });
});


events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: ""
        })
    });
});

events.on(/(^order|^contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);
});


events.on('formErrors:changed', (errors: Partial<IBuyer>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');

    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
    const orderData = {
        ...userModel.getUserData(),
        total: basketModel.getTotal(),
        items: basketModel.items.map(i => i.id)
    };

    api.orderProducts(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });
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
