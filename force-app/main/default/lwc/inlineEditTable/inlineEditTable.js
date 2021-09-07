import { LightningElement,wire, api, track } from 'lwc';
import getAccountTableController from '@salesforce/apex/inlineEditTableController.getAccountTableController'
import deleteAccount from '@salesforce/apex/inlineEditTableController.deleteAccount'
import {refreshApex} from '@salesforce/apex';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Account.Id';
import { updateRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', editable: true },
    //{ label: 'Rating', fieldName: 'Rating', type: 'picklist', editable: true },    
    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_account',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    },
    {
        label: 'Rating', fieldName: 'Rating', type: 'picklist', editable: true, typeAttributes: {
            placeholder: 'Choose rating', options: [
                { label: 'Hot', value: 'Hot' },
                { label: 'Warm', value: 'Warm' },
                { label: 'Cold', value: 'Cold' },
            ] 
            , value: { fieldName: 'Rating' } 
            , context: { fieldName: 'Id' } 
        }
    }
];

export default class InlineEditTable extends LightningElement {
    @track columns = COLUMNS;
    @track data;
    @api recordId;      
    @track originalMessage;    
    selectedRow;
    draftValues = [];
    refrechTable;    
    blockEdit;

    @wire(getAccountTableController) 
    contactData(result) {
        this.refrechTable = result;
        const {data,error} = result;
        if (data) {            
            this.data = data;            
        } else if (error) {            
            this.error = error;
            this.data = undefined;
        }         
    }

    handleRowAction(event) {
        // console.log(event, 'event');
        const row = event.detail.row;
        console.log('row', row);
        if (event.detail.action.name === 'delete_account') {
            this.selectedRow = event.detail.row;
            this.deleteCurrAccounts(row);
        }
    }

    deleteCurrAccounts(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        deleteAccount({idAccountDelete: currentRecord})
            .then(() => {

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success delete:)',
                    message: currentRow.Name + ' ' + ' Account deleted.',
                    variant: 'success'
                }),);

                return refreshApex(this.refrechTable);
            })
            .catch(error => {

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error delete:(',
                    message: error.message,
                    variant: 'error'
                }),);
            });
    }

    handleSave(event){
        blockEdit = false;
        this.sherchButtonEdit(this.blockEdit);
        const fields = {}; 
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;       
        fields[RATING_FIELD.fieldApiName] = event.detail.draftValues[0].Rating;       
        fields[ACCOUNT_ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;        

        const recordInput = {fields};        

        updateRecord(recordInput)
        .then(() => {  
            blockEdit = true;
            this.sherchButtonEdit(this.blockEdit);
            return refreshApex(this.refrechTable).then(() => {
                
                this.draftValues = [];

            });
        })
    }

    sherchButtonEdit(event){
    let arrayButtonEdit = this.template.querySelectorAll('slds-button__icon_edit');        
    arrayButtonEdit.forEach( row => {
      row.disable = this.event;               
    });
    }
}