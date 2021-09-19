import { LightningElement,wire, api, track } from 'lwc';
import getAccountTableController from '@salesforce/apex/inlineEditTableController.getAccountTableController'
import deleteAccount from '@salesforce/apex/inlineEditTableController.deleteAccount'
import {refreshApex} from '@salesforce/apex';
import saveDraftValues from '@salesforce/apex/inlineEditTableController.saveDraftValues';
import {ShowToastEvent} from "lightning/platformShowToastEvent";



export default class CustomDataTable extends LightningElement {
    refrechTable;
    @track dataTable = [];
    inputValue;
    inputId;
    inputfield;
    inputEditValue;
    showButtonCancelSave = false;
    showEditButton = true;
    colorBackGround;    

    @wire(getAccountTableController) 
    contactData(result) {
        this.refrechTable = result;
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
            this.dataTable = currentData;                                              
        } else if (error) {                       
            this.error = error;
            this.dataTable = undefined;
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
        this.colorBackGround = event.detail.colorBackGround;
        this.colorBackGround.style.backgroundColor = 'yellow';
        this.openClosePickList(false);
        for(let Acc of this.dataTable){                
            if(Acc.Id == this.inputId){
                 Acc.Rating = this.inputEditValue;                
                break;
            }
        }                   
    }

    closeEcsPickList(event){
        if (event.detail.keyCodeCompanentinput === 27) { 
            this.openClosePickList(false);            
        }
    }


    openClosePickList(coman){
        for(let Acc of this.dataTable){         
            Acc.showPickList = false;
            Acc.editRow = false;     
        }
        for(let Acc of this.dataTable){                
            if(Acc.Id == this.inputId){
                Acc.showPickList = coman;                
                break;
            }
        }
    }   

    clickEdit(event){               
        this.inputId = event.detail.accountIdRow;
        this.inputValue = event.detail.accountName;
        this.inputfield = event.detail.valueField;        
        for(let Acc of this.dataTable){          
            Acc.editRow = false;
            Acc.showPickList = false;           
        } 
        this.openCloseInput(true);                       
    }    

    inputDisplay(event){               
        if (event.detail.keyCodeCompanentinput === 13) {
            event.preventDefault();
            this.inputEditValue = event.detail.inputValue;            
            for(let Acc of this.dataTable){                
                if(Acc.Id == this.inputId){
                    Acc.Name = this.inputEditValue;                                                       
                    break;
                }
            }
            this.colorBackGround = event.detail.colorBackGround;
            this.colorBackGround.style.backgroundColor = 'yellow';     
            this.openCloseInput(false);
            this.showButtonCancelSave = true;
            this.showEditButton = false;                               
        } else if (event.detail.keyCodeCompanentinput === 27) {
            this.openCloseInput(false);
        }      
    }

    closeInput(){       
        this.showButtonCancelSave = false;
        if(this.inputfield === 'Name') {
            for(let Acc of this.dataTable){                
                if(Acc.Id == this.inputId){
                    Acc.Name = this.inputValue;                
                    break;
                }
            }              
        } else if (this.inputfield === 'Rating') {
            for(let Acc of this.dataTable){                
                if(Acc.Id == this.inputId){
                    Acc.Rating = this.inputValue;
                    Acc.showPickList = false;                
                    break;
                }
            }
        }
        this.colorBackGround.style.backgroundColor = '';
        this.showEditButton = true;        
        return refreshApex(this.refrechTable);  
    }

    saveInput(){
        let arrayData = [];       
        if(this.inputfield == 'Name') {        
            let arrayDataName = {
                Name : this.inputEditValue,
                Id : this.inputId
            };
            arrayData.push(arrayDataName);
        } else if (this.inputfield === "Rating") {
            let arrayDataRating = {
                Rating : this.inputEditValue,
                Id : this.inputId
            };            
            arrayData.push(arrayDataRating);
        }              
        saveDraftValues({data: arrayData})
        .then((responsSave) => { 
            if(responsSave) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error save',
                    message: responsSave,
                    variant: 'error'
                }),);
            } else {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success update',
                    message: 'Account update.',
                    variant: 'success'
                }),);
                return refreshApex(this.refrechTable);
            }
        })
        this.showButtonCancelSave = false;
        this.showEditButton = true;
        this.colorBackGround.style.backgroundColor = '';         
    }

    openCloseInput(valueEditRow){        
        for(let Acc of this.dataTable){                
            if(Acc.Id == this.inputId){
                Acc.editRow = valueEditRow;                
                break;
            }
        } 
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
                    }),);
                } else {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success delete',
                        message: 'Account deleted.',
                        variant: 'success'
                    }),);
    
                    return refreshApex(this.refrechTable);
                }
            })     
    }
}