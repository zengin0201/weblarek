import { IBuyer, TPayment } from "../types"
import { IEvents } from "../components/base/Events";

export class UserData{
    getUserData(): IBuyer {
    return {
        payment: this.payment,
        email: this.email,
        phone: this.phone,
        address: this.address,
    };
}
    payment:TPayment = "card"
    email:string=""
    phone:string = ""
    address:string = ""
    constructor(protected events: IEvents) {}

    setField(field:keyof IBuyer,value:string){
        this[field] = value as TPayment
        const errors = this.validate();
        this.events.emit('formErrors:changed', errors);
    }
    validate() {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.email) { errors.email = "Необходимо указать email"; }
    if (!this.phone) { errors.phone = "Необходимо указать телефон"; }
    if (!this.address) { errors.address = "Необходимо указать адрес"; }
    if (!this.payment) { errors.payment = "Необходимо выбрать способ оплаты"; }
    return errors;
}
    clear(){
        this.address = '';
        this.email = '';
        this.phone = '';
        this.payment = 'card';
    }
}