import { LightningElement,wire, api, track } from 'lwc';

import getAccountTableController from '@salesforce/apex/inlineEditTableController.getAccountTableController';
import deleteAccount from '@salesforce/apex/inlineEditTableController.deleteAccount';
import saveDraftValues from '@salesforce/apex/inlineEditTableController.saveDraftValues';

import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', editable: true },
    {
        label: 'Rating',
        fieldName: 'Rating',
        type: 'picklist',
        editable: true,
        typeAttributes: {
            placeholder: 'Choose Rating',
            options: [
                {label: 'Hot', value: 'Hot'},
                {label: 'Warm', value: 'Warm'},
                {label: 'Cold', value: 'Cold'}
            ],
            value: {fieldName: 'Rating'},
            context: {fieldName: 'Id'},
            variant: 'label-hidden',
            name: 'Rating',
            label: 'Rating'
        },
        cellAttributes: {
            class: {fieldName: 'ratingClass'}
        }
    },    
    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_account',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    },    
];
const COLUMNS_NON = [
    {label: 'Account Name', fieldName: 'Name', type: 'text'},
    {label: 'Rating', fieldName: 'Rating', type: 'text'},

    {
        type: 'button-icon', label: 'Action', initialWidth: 75, typeAttributes: {
            iconName: 'action:delete', title: 'Delete', name: 'delete_account',
            variant: 'border-filled', alternativeText: 'Delete'
        }
    }
];

export default class InlineEditTable extends LightningElement {
    @track columns = COLUMNS;
    @track columnsNon = COLUMNS_NON;
    @track data;
    showHidePencil = true;
    privateChildren = {};   

    draftValues = [];
    lastSavedData;
    refrechTable;

    @wire(getAccountTableController) 
    contactData(result) {
        this.refrechTable = result;
        const {data,error} = result;
        if (data) {
            this.data = JSON.parse(JSON.stringify(data));
            this.data.forEach(row => {
                row.ratingClass = 'slds-cell-edit';
            });                      
        } else if (error) {                       
            this.error = error;
            this.data = undefined;
        }
        this.lastSavedData = this.data;                
    } 

    handleItemRegister(event) {
        event.stopPropagation();
        const item = event.detail;
        if (!this.privateChildren.hasOwnProperty(item.name))
            this.privateChildren[item.name] = {};
        this.privateChildren[item.name][item.guid] = item;
    }

    handleRowAction(event) {        
        const row = event.detail.row;        
        if (event.detail.action.name === 'delete_account') {
            this.selectedRow = event.detail.row;
            this.deleteCurrentAccounts(row);
        }
    }

    deleteCurrentAccounts(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);        
        deleteAccount({idAccountDelete: currentRecord})
            .then((response) => { 
                if(response) {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error delete',
                        message: response,
                        variant: 'error'
                    }),);
                } else {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success delete',
                        message: currentRow.Name + ' ' + ' Account deleted.',
                        variant: 'success'
                    }),);
    
                    return refreshApex(this.refrechTable);
                }
            })           
    }
    
    picklistEdit(event) {
        event.preventDefault();
        let dataReceived = event.detail.data;
        this.handleWindowOnclick(dataReceived.context);
        switch (dataReceived.label) {
            case 'Rating':
                this.setClassesOnData(
                    dataReceived.context,
                    'ratingClass',
                    'slds-cell-edit'
                );
                break;
            default:
                this.setClassesOnData(dataReceived.context, '', '');
                break;
        }
    }

    handleCellChange(event) {
        event.preventDefault();
        this.updateDraftValues(event.detail.draftValues[0]);
    }

    picklistValueChange(event) {
        event.stopPropagation();
        let dataReceived = event.detail.data;
        let updatedItem;
        switch (dataReceived.label) {
            case 'Rating':
                updatedItem = {
                     Id: dataReceived.context,
                    Rating: dataReceived.value
                };
                this.setClassesOnData(
                    dataReceived.context,
                    'ratingClass',
                    'slds-cell-edit slds-is-edited'
                );
                break;
            default:
                this.setClassesOnData(dataReceived.context, '', '');
                break;
        }
        this.updateDataValues(updatedItem);
        this.updateDraftValues(updatedItem);
    }
    
    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.data));
        copyData.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.data = [...copyData];
    }

    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = JSON.parse(JSON.stringify(this.draftValues));
        copyDraftValues.forEach((item) => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
        this.showHidePencil = false;
    }    

    setClassesOnData(id, fieldName, fieldValue) {
        this.data = JSON.parse(JSON.stringify(this.data));
        this.data.forEach((detail) => {
            if (detail.Id === id) {
                detail[fieldName] = fieldValue;
            }
        });
    }

    handleSave(event) {
        event.preventDefault();        
        saveDraftValues({data: this.draftValues})
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account updated successfully',
                        variant: 'success'
                    })
                );
                refreshApex(this.refrechTable).then(() => {
                    this.data.forEach(record => {
                        record.ratingClass = 'slds-cell-edit';
                    });
                    this.draftValues = [];
                });
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or reloading record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );                
            });
        this.showHidePencil = true;
    }    

    cancelInlineEdit(event) {
        event.preventDefault();
        this.data = JSON.parse(JSON.stringify(this.lastSavedData));
        this.handleWindowOnclick('reset');
        this.draftValues = [];
        this.showHidePencil = true;
    }

    renderedCallback() {
        if (!this.isComponentLoaded) {
            window.addEventListener('click', (evt) => {
                this.handleWindowOnclick(evt);
            });
            this.isComponentLoaded = true;
        }
    }

    disconnectedCallback() {
        window.removeEventListener('click', () => {
        });
    }

    handleWindowOnclick(context) {
        this.resetPopups('c-custom-type-pick-list', context);
    }

    resetPopups(markup, context) {
        let elementMarkup = this.privateChildren[markup];
        if (elementMarkup) {
            Object.values(elementMarkup).forEach((element) => {
                element.callbacks.reset(context);
            });
        }
    }
}