import { api, LightningElement, track } from 'lwc';

export default class ModalWindowDeleteContact extends LightningElement {
    @api showDelete = false;
    @track modalShowDelete = false;   
    @api title = '';
    @api name;
    @api message = '';
    @api confirmLabel = '';
    @api cancelLabel = '';
    @api originalMessage;
    @api recordId;    
    @track contactId;
    @api selectedRow;

    modalWindow(event) {
        let finalEvent = {
            originalMessage: this.originalMessage,
            status: event.target.name,
            selectedRow: this.selectedRow
        };
        this.dispatchEvent(new CustomEvent('deletecontact', {detail: finalEvent}));
    } 
}