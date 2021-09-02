import { LightningElement, wire, api, track } from 'lwc';
import getContactNameAndId from '@salesforce/apex/contactTableNameAndIdNameController.getContactNameAndId';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME from '@salesforce/schema/Contact.Name';
import ID from '@salesforce/schema/Contact.Id';

const COLUM = [
    { label: 'IdName', fieldName: 'IdNameName' },    
    { label: 'Name', fieldName: 'LinkName', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}}
];
export default class ContactTableNameAndIDname extends LightningElement {
    @api recordId;
    columns = COLUM;
    draftValues = [];
    @track data = [];
    contacts;

    @wire (getContactNameAndId)    
    chenchTypeField(result){
        this.contacts = result;
        const{data,error} = result;
         if (data) {
            let currentData = [];            
            data.forEach( row => {
                let rowData = {};                
                rowData={
                    ...row,
                    IdNameName: row.Id + row.Name,
                    LinkName: '/' + row.Id
                    };              
                currentData.push(rowData);                
            });
            this.data = currentData;            
        } else if (error) {            
            this.error = error;
            this.data = undefined;
        } 
    }
    handleSave(event){

        const fields = {}; 
        fields[NAME.fieldApiName] = event.detail.draftValues[0].Name;               
        fields[ID.fieldApiName] = event.detail.draftValues[0].Id;

        const recordInput = {fields};        

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Lead updated',
                    variant: 'success'
                })
            );
            
            return refreshApex(this.contacts).then(() => {
                
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });

    }
}