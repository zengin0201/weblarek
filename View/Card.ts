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
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _text?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        // Используем ensureElement для гарантии, что элементы существуют
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        
        // Для опциональных элементов указываем as Type
        this._image = container.querySelector(`.${blockName}__image`) as HTMLImageElement;
        this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;
        this._category = container.querySelector(`.${blockName}__category`) as HTMLElement;
        this._text = container.querySelector(`.${blockName}__text`) as HTMLElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button && value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set text(value: string) {
        if (this._text) {
            this.setText(this._text, value);
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }
}