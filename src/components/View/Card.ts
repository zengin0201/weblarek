import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    category?: string;
    image?: string;
    price: number | null;
    text?: string;
    buttonText?: string;
    index?: number;
}


export class Card<T> extends Component<ICard & T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }
}


export class CardCatalog extends Card<ICard> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);

        if (actions?.onClick) container.addEventListener('click', actions.onClick);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${categoryClass}`;
    }
}


export class CardPreview extends CardCatalog {
    protected _text: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container);
        this._text = ensureElement<HTMLElement>(`.${blockName}__text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);

        if (actions?.onClick) {
            container.removeEventListener('click', actions.onClick); // Снимаем клик с контейнера
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        } else {
            this.setDisabled(this._button, false);
        }
    }
}


export class CardBasket extends Card<ICard> {
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container);
        this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);

        if (actions?.onClick) this._button.addEventListener('click', actions.onClick);
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}
