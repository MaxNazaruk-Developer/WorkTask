import { LightningElement, wire, track, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Account', fieldName: 'LinkAcc', type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
    { label: 'Mobile Phone', fieldName: 'MobilePhone', type: 'phone' },
    { 
        label: 'Created Date', fieldName: 'CreatedDate', type: 'date', typeAttributes: {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        } 
    },
    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_contact',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    }
];
export default class ContactList extends LightningElement {
    @track columns = COLUMNS;
    @track data = [];
    @track modalShowDelete = false;
    @api recordId;      
    @track originalMessage;    
    @track selectedRow;
    refrechTable;

    @wire(getContacts)
    contactData(result) {
        this.refrechTable = result;
        const {data,error} = result;
        if (data) {
            let currentData = [];            
            data.forEach( row => {
                let rowData = {};                
                rowData={
                    ...row,
                    LinkAcc : row.AccountId ? '/' + row.AccountId : "",
                    AccountName : row.AccountId ? row.Account.Name : ""};              
                currentData.push(rowData);                
            });
            this.data = currentData;            
        } else if (error) {            
            this.error = error;
            this.data = undefined;
        }         
    }
    
    refrech(){
        return refreshApex(this.refrechTable);
    }
    
    seachContact(event) {
        this.data = event.detail;        
        let resultData = {
            error: null,
            data: this.data
        }        
        this.contactData(resultData);
    }   
    
    modalWindowDelete(event) {
        if (event.detail.action.name === 'delete_contact') {
            this.selectedRow = event.detail.row;
            this.modalShowDelete = true;
        }
    }

    modalData(event){
        this.originalMessage = event.currentTarget.dataset.id;
        if (event.target.name === 'confirmModal') {
            if (event.detail.status === 'confirm') {
                let selectedRow = event.detail.selectedRow;
                this.deleteContacts(selectedRow);
                this.modalShowDelete = false;
            } else if (event.detail.status === 'cancel') {
                this.modalShowDelete = false;
            }
            this.modalShowDelete = false;
        } 
    }
    
    deleteContacts(currentRow) {

        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        deleteContact({idContactsDelete: currentRecord})
            .then(() => {

                this.dispatchEvent(new ShowToastEvent({
                        title: 'Success!!',
                        message: currentRow.FirstName + ' ' + currentRow.LastName + ' Contact deleted.',
                        variant: 'success'
                    }),
                );

                return refreshApex(this.refrechTable);
            })
            .catch(error => {

                this.dispatchEvent(new ShowToastEvent({
                        title: 'Error!!',
                        message: error.message,
                        variant: 'error'
                    }),
                );
            });
    }
}