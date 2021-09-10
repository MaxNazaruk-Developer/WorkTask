import LightningDatatable from 'lightning/datatable';
import DatatablePicklistTemplate from './picklistTemplete.html';

export default class CustomDataTable extends LightningDatatable {

    static customTypes = {
        picklist: {
            template: DatatablePicklistTemplate,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant', 'name']
        }
    };

}