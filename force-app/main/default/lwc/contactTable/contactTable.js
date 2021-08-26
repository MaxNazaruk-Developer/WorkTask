import { LightningElement, wire } from 'lwc';
import FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import LAST_NAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';
import MOBAIL_PHONE from '@salesforce/schema/Contact.MobilePhone';
import CREATED_DATE from '@salesforce/schema/Contact.CreatedDate';
import getContacts from '@salesforce/apex/ContactController.getContacts';


const COLUMNS = [
    { label: 'First Name', fieldName: FIRST_NAME.fieldApiName, type: 'name' },
    { label: 'Last Name', fieldName: LAST_NAME.fieldApiName, type: '	name' },
    { label: 'Email', fieldName: EMAIL.fieldApiName, type: 'email' },
    { label: 'Account Name', fieldName: ACCOUNT.fieldApiName, type: 'Lookup(Account)' },
    { label: 'Mobile Phone', fieldName: MOBAIL_PHONE.fieldApiName, type: 'phone' },
    { label: 'Created Date', fieldName: CREATED_DATE.fieldApiName, type: 'date' }
];
export default class ContactList extends LightningElement {
    columns = COLUMNS;
    @wire(getContacts)
    accounts;
}