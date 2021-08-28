import getContacts from '@salesforce/apex/contactController.getContacts';
import { LightningElement, track } from 'lwc';

export default class SearchFilter extends LightningElement {
    @track records = [];
    searchValue = '';

    searchId(event) {

        this.searchValue = event.target.value;
        //this.dispatchEvent(new CustomEvent('search', {detail: this.searchValue}))
    }

    searchContact(){
               
        if (this.searchValue !== '') {
            getContacts({
                searchKey:this.searchValue
            })
            .then(result=>{
                this.records = result;
            })
            .catch(error => {
                    
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error.body.message,
                });
                this.dispatchEvent(event);
                  
                this.records = null;
        });
        } else {
            
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }
        this.dispatchEvent(new CustomEvent('filter', {detail: this.records}))
    }
}

