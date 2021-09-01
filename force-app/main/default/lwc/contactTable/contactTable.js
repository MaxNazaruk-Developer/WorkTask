import { LightningElement, wire, track, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import {refreshApex} from '@salesforce/apex';

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
    }
];
export default class ContactList extends LightningElement {
    @track columns = COLUMNS;
    @track data = [];
    
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
   
}