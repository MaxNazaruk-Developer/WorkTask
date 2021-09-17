import { LightningElement,api } from 'lwc';

export default class ComponentRowForDataTable extends LightningElement {
    @api accountName;
    @api accountIdRow;
    @api accountRating;
    @api accountEditRow;
    @api accountshowPickList;
    @api showEditButton;
    @api inputValue;
    @api valueField;
    @api keyCodeCompanentinput;
    @api optionValue = {
        hot: "Hot",
        warm: "Warm",
        cold: "Cold"
    };

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
        this.dispatchEvent(new CustomEvent("inputdisplay", {
            detail: {
                inputValue: this.inputValue, 
                keyCodeCompanentinput: this.keyCodeCompanentinput
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
        //var arrTegOptions = this.template.querySelectorAll('option[value="'+ this.optionValue.hot +'"]');
        //var arrTegOptions = element.template.querySelector('option');
        //var arrTegOptions = this.template.querySelector('tr[data-accountid="' + this.inputId + '"] option[value="Hot"]');
       //console.log('optionCompanent : ', arrTegOptions);
        this.dispatchEvent(new CustomEvent("clickeditratingcompanent", {
            detail: {
                accountRating: this.accountRating,
                accountIdRow: this.accountIdRow,
                valueField: this.valueField                  
            }
        }));
    }
}