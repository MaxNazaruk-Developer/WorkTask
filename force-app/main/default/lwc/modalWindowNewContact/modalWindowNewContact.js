import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import MOBILE_PHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';

export default class ModalWindowNewContact extends LightningElement {
    @track modalShow = false;
    @track objectApiName = 'Contact';   
    
    @track fields = [FIRST_NAME_FIELD, LAST_NAME_FIELD, ACCOUNT_FIELD, EMAIL_FIELD, MOBILE_PHONE_FIELD];

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Account created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.modalShow = false;       
        this.dispatchEvent(new CustomEvent('refrech'));        
    }
    
    handleError(event) {  
        const evt = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message: error.body.message,
        });
        this.dispatchEvent(evt);
    }

    modalWindowShow(){
        this.modalShow = true;        
    }

    closeModalWindow(){
        this.modalShow = false;
    }    
   
}