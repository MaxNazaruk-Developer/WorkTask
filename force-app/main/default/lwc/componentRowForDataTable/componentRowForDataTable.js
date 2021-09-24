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
   
    optionValueHot = { hot: "Hot", show: false };
    optionValueWarm = { warm: "Warm", show: false };
    optionValueCold = { cold: "Cold", show: false };
    optionValueNone = { none: "", show: false };
    optionValueDir = { dir: "Dir", show: false };    

    clickEditNameCompanent(event) {
        this.valueField = event.target.dataset.field;
        this.accountName = event.target.dataset.value;
        this.accountIdRow = event.target.dataset.id;        
        this.dispatchEvent(new CustomEvent("openinputfield", {
            detail: {
                valueField: this.valueField,
                accountName: this.accountName,
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

    clickEditRatingCompanent(event) {
        this.accountRating = event.target.dataset.value;
        this.accountIdRow = event.target.dataset.id;
        this.valueField = event.target.dataset.field;
        this.selectStandartValue(this.accountRating);        
        this.dispatchEvent(new CustomEvent("clickeditratingcompanent", {
            detail: {
                accountRating: this.accountRating,
                accountIdRow: this.accountIdRow                                
            }
        }));
    }

    selectStandartValue(show){        
        switch(show) {           
            case this.optionValueHot.hot:
                this.optionValueHot.show = true;
                break;
            case this.optionValueWarm.warm:
                this.optionValueWarm.show = true;
                break;
            case this.optionValueCold.cold:
                this.optionValueCold.show = true;
                break;
            case this.optionValueDir.dir:
                this.optionValueDir.show = true;
                break;
            default:
                this.optionValueNone.show = true;
        }
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