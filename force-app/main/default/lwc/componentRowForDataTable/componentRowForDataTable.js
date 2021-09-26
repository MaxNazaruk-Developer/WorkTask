import { LightningElement,api } from 'lwc';

export default class ComponentRowForDataTable extends LightningElement {
    @api accountName;
    @api accountIdRow;
    @api accountRating;

    @api accountEditRow;
    @api accountshowPickList;       
    @api showEditButton;

    inputValue;
    valueField;
    keyCodeCompanentinput;
    colorBackground;
    defaultFieldValue;  

    optionValue = [
        { value: "", show: false, showValue: "--None--"},
        { value: "Hot", show: false, showValue: "Hot"},
        { value: "Warm", show: false, showValue: "Warm"},
        { value: "Cold", show: false, showValue: "Cold"},        
        { value: "Dir", show: false, showValue: "Dir"},
    ];
    
    clickButtonEditFeild(event) {
        this.accountIdRow = event.target.dataset.id;
        this.valueField = event.target.dataset.field;
        this.defaultFieldValue = event.target.dataset.value;        
        if (this.valueField == 'Rating') {
            this.selectStandartValue(this.defaultFieldValue);            
        }
        this.dispatchEvent(new CustomEvent("openeditfield", {
            detail: {
                valueField: this.valueField,
                defaultFieldValue: this.defaultFieldValue,
                accountIdRow: this.accountIdRow
            }
        }));
    }   

    inputDisplayCompanent(event) {
        this.inputValue = event.target.value;        
        this.keyCodeCompanentinput = event.keyCode;
        this.colorBackground = this.template.querySelector('.onerd');        
        this.dispatchEvent(new CustomEvent("inputdisplay", {
            detail: {
                inputValue: this.inputValue, 
                keyCodeCompanentinput: this.keyCodeCompanentinput,
                colorBackground: this.colorBackground
            }
        }));
    }

    deleteAccountCompanent(event) {
        this.accountIdRow = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent("deleteaccount", {
            detail: {
                accountIdRow: this.accountIdRow                
            }
        }));
    }    

    selectStandartValue(eddSelected) {
        this.optionValue.map((row) => {
            row.show = false;            
        }); 
        if (eddSelected == undefined) {
            eddSelected = "";
        }
        let editAccountFiald = this.optionValue.find(item => item.value == eddSelected);
        editAccountFiald.show = true;       
    }

    clickOption(event) {        
        this.accountEditRating = event.target.value;
        this.colorBackground = this.template.querySelector('.tword');
        if(this.accountRating === undefined) {
            this.accountRating = '';
        }       
        if(this.accountRating !== this.accountEditRating) {            
            this.dispatchEvent(new CustomEvent("saveeditnewvalue", {
                detail: {
                    accountEditRating: this.accountEditRating,               
                    valueField: this.valueField,
                    colorBackground: this.colorBackground                  
                }
            }));
        }        
    }

    keyUpPickList(event) {         
        this.keyCodeCompanentinput = event.keyCode;        
        this.dispatchEvent(new CustomEvent("closeescpicklist", {
            detail: {
                keyCodeCompanentinput: this.keyCodeCompanentinput,
                                             
            }
        }));
    }
}