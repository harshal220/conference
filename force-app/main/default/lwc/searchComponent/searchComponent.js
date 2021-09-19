/*
*    Author     : Harshal Kolhe
*    Description: Search component. Used as look up componet. Reusable component.
*    Date       : 14/09/2021
*/

import { LightningElement,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import search from '@salesforce/apex/LookupSearchController.search';
const DELAY = 300;
export default class SearchComponent extends LightningElement {

    // * Search lookup variables 
    @api valueId;
    @api valueName;
    @api objName = 'Account';
    @api iconName = 'standard:account';
    @api labelName;
    @api readOnly = false;
    @api currentRecordId;
    @api placeholder = 'Search';
    @api createRecord;
    @api fields = ['Name'];
    @api displayFields = 'Name, Rating, AccountNumber';

    // * Search lookup variables
    @track error;

    searchTerm;
    // * Variable for delaytime
    delayTimeout;

    searchRecords;
    selectedRecord;
    objectLabel;
    isLoading = false;

    field;
    field1;
    field2;

    // * Storing ICON URL.
    ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';

    /*
    *   Connected callback function is used to set defualt values when component renders in DOM.
    */
    connectedCallback(){

        let icons           = this.iconName.split(':');
        this.ICON_URL       = this.ICON_URL.replace('{0}',icons[0]);
        this.ICON_URL       = this.ICON_URL.replace('{1}',icons[1]);
        if(this.objName.includes('__c')){

        }else{
            this.objectLabel = this.objName;
        }
        this.objectLabel    = this.titleCase(this.objectLabel);
        let fieldList;
        if( !Array.isArray(this.displayFields)){
            fieldList       = this.displayFields.split(',');
        }else{
            fieldList       = this.displayFields;
        }
        
        if(fieldList.length > 1){
            this.field  = fieldList[0].trim();
            this.field1 = fieldList[1].trim();
        }
        if(fieldList.length > 2){
            this.field2 = fieldList[2].trim();
        }
        let combinedFields = [];
        fieldList.forEach(field => {
            if( !this.fields.includes(field.trim()) ){
                combinedFields.push( field.trim() );
            }
        });

        this.fields = combinedFields.concat( JSON.parse(JSON.stringify(this.fields)) );
        
    }

    
    /*
    *   This function is used to get search value in input.
    *   Handles onchange event.
    *   Performing action after onchange event fired.
    *   Calling apex method to get search records.
    */
    handleInputChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        //this.isLoading = true;
        this.delayTimeout = setTimeout(() => {
            if(searchKey.length >= 2){
                search({ 
                    objectName : this.objName,
                    fields     : this.fields,
                    searchTerm : searchKey 
                })
                .then(result => {
                    let stringResult = JSON.stringify(result);
                    let allResult    = JSON.parse(stringResult);
                    allResult.forEach( record => {
                        record.FIELD1 = record[this.field];
                        record.FIELD2 = record[this.field1];
                        if( this.field2 ){
                            record.FIELD3 = record[this.field2];
                        }else{
                            record.FIELD3 = '';
                        }
                    });
                    this.searchRecords = allResult;
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally( ()=>{
                    //this.isLoading = false;
                });
            }
        }, DELAY);
    }

    /*
    *   This function is used to get the record from lookup option list.
    *   Handles onclick event.
    *   Once we search any record , it dispalyed list of records below input field.
    *   Invoking custom event and dispatched it.
    *   Passing detail object which holds Detail-> data , Record id objects.
    */
    handleSelect(event){
        
        let recordId = event.currentTarget.dataset.recordId;
        
        let selectRecord = this.searchRecords.find((item) => {
            return item.Id === recordId;
        });
        this.selectedRecord = selectRecord;
        
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                data : {
                    record          : selectRecord,
                    recordId        : recordId,
                    currentRecordId : this.currentRecordId
                }
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    /*
    *   This function is used to clear the search result from input.
    *   Handles onclick event.
    *   Once we search any record. There is cross icon to clear search result.
    *   Invoking custom event and dispatched it.
    */
    handleClose(){
        this.selectedRecord = undefined;
        this.searchRecords  = undefined;
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                record ,
                recordId,
                currentRecordId : this.currentRecordId
            }
        });
        this.dispatchEvent(selectedEvent);
    }
    titleCase(string) {
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }

    /*
    *   This function is used to clear the input value.
    *   Invoke from parent componet.
    */
    @api
    handleResetInput(){
       this.handleClose();
    }
}