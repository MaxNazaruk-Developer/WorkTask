import { LightningElement, wire, track } from 'lwc';
import getContactNameAndId from '@salesforce/apex/contactTableNameAndIdNameController.getContactNameAndId';

const COLUM = [
    { label: 'IdName', fieldName: 'IdNameName' },    
    { label: 'Name', fieldName: 'LinkName', type: 'url', typeAttributes: {label: {fieldName: 'Name'}}}
];
export default class ContactTableNameAndIDname extends LightningElement {    
    columns = COLUM;    
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
}