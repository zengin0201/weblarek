import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';



export interface IFormState {
    valid: boolean;
    errors: string; 
}


abstract class Form<T> extends Component<IFormState & T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }
}

export class OrderForm extends Form<IBuyer> {
    protected _buttons: HTMLButtonElement[];
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.onInputChange('payment', button.name);
            });
        });
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === name);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class ContactsForm extends Form<IBuyer> {}