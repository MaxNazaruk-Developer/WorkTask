import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

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
    
    @wire(getContacts)
    
    contactData({error, data}) {

        if (data) {
            let currentData = [];
            data.forEach( row => {
                let rowData = {};
                rowData.LastName = row.LastName;
                rowData.FirstName = row.FirstName;
                rowData.LinkAcc = '/' + row.AccountId;
                if (row.Account) {
                    rowData.AccountName = row.Account.Name;
                }
                rowData.Email = row.Email;
                rowData.MobilePhone = row.MobilePhone;
                rowData.CreatedDate = row.CreatedDate;
                currentData.push(rowData);
            });
            this.data = currentData;
        } else if (error) {
            
            this.error = error;
            this.data = undefined;
        }
    }
    seachContact(event) {
        this.data = event.detail;
        console.log('eveny:' + event.detail);
        let resultData = {
            error: null,
            data: this.data
        }     
        
        this.contactData(resultData);
    }
    
}