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
    /*valuesPickList =  
        {hot : "Hot",
        warm : "Warm",
        cold : "Cold"};*/


    

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
            console.log(this.dataTable,'dataTable');                                  
        } else if (error) {                       
            this.error = error;
            this.dataTable = undefined;
        }                        
    }    

    clickEditRating(event){
        // когда ты получаешь ивент, обработчик смотрит на то,, что в первую очередь вызвало ивент
        // в твоем случае ивент.таргет будет ссылаться конкретно на тот обьект, который этот ивент вызвал, в товем случае - кнопка редактирования
        // и все указанные свойства будут искаться в этой кнопке.

        // если же ты хочешь найти другой обьект, который находится рядом с кнопкой, тебе нужно сделать указатель, по которому ты сможешь определить, является ли тот тег и твоя сработанная кнопка связаны чем-то
        // например - они находятся в одном ряду.
        this.inputId = event.target.dataset.id;
        this.inputValue = event.target.dataset.value;
        this.inputfield = event.target.dataset.field;
        // и вот тут если ты, допустим, знаешь айди и знаешь в каком ряде это айди встречается, то ты можешь составить запрос селектора для того чтобы получить конкретный тег, в твоем случае - опцию в селекте
        // выглядит это примерно так: this.template.querySelector('tr[data-....=""] option[value=""]') - вот тут ты указываешь что ищешь тег тр в котором есть параметр дата-"твоеимятут" = твой айди, допустим и внутри этого тега ищешь тег опшн в котором значение равно тому что тебе надо.
        // айди же в 57 строке ты получаешь правильно.        
        
        this.openClosePickList(true);
        this.selectedValueStandartPickList();
    }

    openClosePickList(coman){
        for(let Acc of this.dataTable){                
            if(Acc.Id == this.inputId){
                Acc.showPickList = coman;                
                break;
            }
        }
    }

    selectedValueStandartPickList(){
        console.log('selected');
        //var arrTegOptions = document.body.querySelectorAll('option');
        //var arrTegOptions = Document.prototype.querySelectorAll('option');
        //var arrTegOptions = this.template.querySelectorAll('option');
        //var arrTegOptions = element.template.querySelector('option');
        var arrTegOptions = this.template.querySelector('tr[data-accountid="' + this.inputId + '"] option[value="Hot"]');
       console.log('option : ',arrTegOptions);
    }

    /*clickPickList() {
      //this.inputEditValue = event.detail;
      //console.log(event);
      this.openClosePickList(false); 
    }*/

    clickEdit(event){       
        this.inputId = event.target.dataset.id;
        this.inputValue = event.target.dataset.value;
        this.inputfield = event.target.dataset.field;
        for(let Acc of this.dataTable){          
            Acc.editRow = false;           
        } 
        this.openCloseInput(true);                       
    }    

    inputDisplay(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            this.inputEditValue = event.target.value;            
            for(let Acc of this.dataTable){                
                if(Acc.Id == this.inputId){
                    Acc.Name = this.inputEditValue;
                    //Acc.ratingClass = 'slds-is-edited';                                    
                    break;
                }
            }          
            this.openCloseInput(false);
            this.showButtonCancelSave = true;
            this.showEditButton = false;                               
        } else if (event.keyCode === 27) {
            this.openCloseInput(false);
        }      
    }

    closeInput(){       
        this.showButtonCancelSave = false;
        for(let Acc of this.dataTable){                
            if(Acc.Id == this.inputId){
                Acc.Name = this.inputValue;                
                break;
            }
        }
        this.showEditButton = true;
        return refreshApex(this.refrechTable);  
    }

    saveInput(){        
        let arrayData = [{
            Name : this.inputEditValue,
            Id : this.inputId
        }];       
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
        currentRecord.push(event.target.dataset.id);
        console.log(currentRecord,'currentRecord');        
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