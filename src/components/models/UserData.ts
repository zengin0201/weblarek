import { IBuyer, TPayment, FormErrors } from "../../types";

export class UserData {
    private payment: TPayment | null = null;
    private email: string = "";
    private phone: string = "";
    private address: string = "";

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        if (field === 'payment') {
            this.payment = value as TPayment;
        } else {
            this[field as keyof Omit<IBuyer, 'payment'>] = value as string;
        }
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this.email) { errors.email = "Необходимо указать email"; }
        if (!this.phone) { errors.phone = "Необходимо указать телефон"; }
        if (!this.address) { errors.address = "Необходимо указать адрес"; }
        if (!this.payment) { errors.payment = "Необходимо выбрать способ оплаты"; }
        return errors;
    }

    clear(): void {
        this.address = '';
        this.email = '';
        this.phone = '';
        this.payment = null; 
    }

    getUserData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }
}