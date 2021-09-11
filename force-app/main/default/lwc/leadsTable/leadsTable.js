import { LightningElement, wire, api, track } from 'lwc';
import getLeadsTableController from '@salesforce/apex/leadsTableController.getLeadsTableController';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import TIILE_FIELD from '@salesforce/schema/Lead.Title';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import LEAD_ID_FIELD from '@salesforce/schema/Lead.Id';


const COLUM = [
    { label: 'Name', fieldName: 'LinkLead', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}},
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Phone', fieldName: 'Phone', editable: true}
];
export default class LeadsTable extends LightningElement {
    @api recordId;
    columns = COLUM;
    draftValues = [];
    @track data = [];
    lead;

    @wire (getLeadsTableController)    
    chenchTypeField(result){
        this.lead = result;
        const{data,error} = result;
         if (data) {
            let currentData = [];            
            data.forEach( row => {
                let rowData = {};                
                rowData={
                    ...row,
                    LinkLead: '/' + row.Id,
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
        fields[TIILE_FIELD.fieldApiName] = event.detail.draftValues[0].Title;       
        fields[PHONE_FIELD.fieldApiName] = event.detail.draftValues[0].Phone;       
        fields[LEAD_ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;        

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
            
            return refreshApex(this.lead).then(() => {
                
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