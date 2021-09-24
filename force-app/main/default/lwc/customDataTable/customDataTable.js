import { LightningElement, wire, track } from 'lwc';

import getAccountTableController from '@salesforce/apex/inlineEditTableController.getAccountTableController';
import deleteAccount from '@salesforce/apex/inlineEditTableController.deleteAccount';
import saveDraftValues from '@salesforce/apex/inlineEditTableController.saveDraftValues';

import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from "lightning/platformShowToastEvent";



export default class CustomDataTable extends LightningElement {
    
    @track datatable = [];

    inputValue;
    inputId;
    inputfield;
    inputEditValue;

    showButtonCancelSave = false;
    showEditButton = true;
    refreshTable;
    colorBackground;    

    @wire(getAccountTableController) 
    contactData(result) {
        this.refreshTable = result;
        const {data,error} = result;
        if (data) {            
            let currentData = [];            
            data.forEach( row => {
                let rowData = {};                
                rowData={
                    ...row,                        
                    editRow : false,
                    showPickList : false    
                };              
                currentData.push(rowData);                
            });
            this.datatable = currentData;                                              
        } else if (error) {                       
            this.error = error;
            this.datatable = undefined;
        }                        
    }    

    clickEditRating(event){        
        this.inputId = event.detail.accountIdRow;
        this.inputValue = event.detail.accountRating;               
        this.openClosePickList(true);        
    }

    saveEditNewValue(event) {
        this.inputEditValue = event.detail.accountEditRating;
        this.inputfield = event.detail.valueField;        
        this.showButtonCancelSave = true;
        this.showEditButton = false;
        this.colorBackground = event.detail.colorBackground;
        this.colorBackground.classList.toggle('colorcelledit');        
        this.openClosePickList(false);
        let editAccountFiald = this.datatable.find(item => item.Id == this.inputId);        
        editAccountFiald.Rating = this.inputEditValue;                           
    }

    closeEcsPickList(event){
        if (event.detail.keyCodeCompanentinput === 27) { 
            this.openClosePickList(false);            
        }
    }

    openClosePickList(command){
        this.datatable.map((Account) => {
            Account.showPickList = false;
            Account.editRow = false;
        } );       
        let editAccountField = this.datatable.find(item => item.Id == this.inputId);        
        editAccountField.showPickList = command;        
    }   

    clickEdit(event){        
        this.inputId = event.detail.accountIdRow;
        this.inputValue = event.detail.accountName;
        this.inputfield = event.detail.valueField;
        this.datatable.map((Account) => {
            Account.showPickList = false;
            Account.editRow = false;
        } );       
        this.openCloseInput(true);                       
    }    

    inputDisplay(event){               
        if (event.detail.keyCodeCompanentinput === 13) {
            event.preventDefault();
            this.inputEditValue = event.detail.inputValue;
            let editAccountFiald = this.datatable.find(item => item.Id == this.inputId);        
            editAccountFiald.Name = this.inputEditValue;           
            this.colorBackground = event.detail.colorBackground;
            this.colorBackground.classList.toggle('colorcelledit');                
            this.openCloseInput(false);
            this.showButtonCancelSave = true;
            this.showEditButton = false;                               
        } else if (event.detail.keyCodeCompanentinput === 27) {
            this.openCloseInput(false);
        }      
    }  

    saveInput(){
        let arrayData = [];
        switch (this.inputfield) {
            case 'Name':
                let arrayDataName = {
                    Name : this.inputEditValue,
                    Id : this.inputId
                };
                arrayData.push(arrayDataName);
                break;
            case 'Rating':
                let arrayDataRating = {
                    Rating : this.inputEditValue,
                    Id : this.inputId
                };            
                arrayData.push(arrayDataRating);
                break;           
        };        
        /*if(this.inputfield == 'Name') {        
            let arrayDataName = {
                Name : this.inputEditValue,
                Id : this.inputId
            };
            arrayData.push(arrayDataName);
        } else if (this.inputfield == 'Rating') {
            let arrayDataRating = {
                Rating : this.inputEditValue,
                Id : this.inputId
            };            
            arrayData.push(arrayDataRating);
        }*/              
        saveDraftValues({data: arrayData})
        .then((responseSave) => { 
            if(responseSave) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error save',
                    message: responseSave,
                    variant: 'error'
                }))
                this.closeInput();
            } else {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success update',
                    message: 'Account update.',
                    variant: 'success'
                }))
                this.showButtonCancelSave = false;
                this.showEditButton = true;
                this.colorBackground.classList.toggle('colorcelledit');                              
                return refreshApex(this.refreshTable);
            }
        })                        
    }  
    
    closeInput(){       
        this.showButtonCancelSave = false;
        let editAccountFiald = this.datatable.find(item => item.Id == this.inputId);
        if(this.inputfield === 'Name') {
            editAccountFiald.Name = this.inputValue;
        } else if (this.inputfield === 'Rating') {
            editAccountFiald.Rating = this.inputValue;
            editAccountFiald.showPickList = false;
        }
        this.colorBackground.classList.toggle('colorcelledit');        
        this.showEditButton = true;               
        return refreshApex(this.refreshTable);  
    }

    openCloseInput(valueEditRow){
        let editAccountFiald = this.datatable.find(item => item.Id == this.inputId);        
        editAccountFiald.editRow = valueEditRow;       
    }

    deleteAccount(event){
        let currentRecord = [];
        currentRecord.push(event.detail.accountIdRow);                
        deleteAccount({idAccountDelete: currentRecord})
            .then((respons) => { 
                if(respons) {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error delete',
                        message: respons,
                        variant: 'error'
                    }))
                } else {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success delete',
                        message: 'Account deleted.',
                        variant: 'success'
                    }))                    
                    return refreshApex(this.refreshTable);
                }
        })     
    }   
}