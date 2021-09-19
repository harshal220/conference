/*
*    Author     : Harshal Kolhe
*    Description: Create Conference and Add Speaker's. Multi Step wizard
*    Date       : 16/09/2021
*/

import { LightningElement,api,track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Conference__c';
import CONFERENCE_NAME from '@salesforce/schema/Conference__c.Name';
import CONFERENCE_TIME from '@salesforce/schema/Conference__c.Conference_Time__c';
import {handleToastSuccess,handleToastError} from 'c/conferenceUtility';
import createConference from '@salesforce/apex/ConferenceController.createConference';
export default class CreateConference extends LightningElement {

    // * Array to store lookup fields.
    fields = ["Name","Email","Phone"];
    displayFields = 'Name, Email, Phone'
    // * Array for store speakers.
    @track allSpeakers=[];
    // * Get selected speaker from lookup.
    @api selectedSpeaker;
    // * Default step for conference wizard.
    @track currentStep = '1';
    // * Boolean for Previous button for conference wizard.
    @track isEnablePrev = false;
     // * Boolean for Next button for conference wizard.
    @track isEnableNext = true;
    // * Display Header title for conference Modal.
    @track modalHeader = 'Create Session';
    // * To store conference Id.
    conferenceId =undefined;
    // * Boolean for spinner.
    @track isLoaded = false;
    // * Boolean for disabling button in conference Modal.
    @track disbaleButton = false;
    // * Boolean for Enable submit button in conference wizard.
    @track isEnableAddSpeaker = false;
    // * To store error value.
    error;

    /*
    *   This function is used to get selected speaker from loopkup component.
    *   Storing selected contact data.
    *   Function invoked through custom event. 
    *   Getting array data.
    */
    handleLookup(event){
        //console.log( JSON.stringify ( event.detail) );
        this.selectedSpeaker = event.detail.data.record;
    }

    /*
    *   This function is used to closed conference Modal.
    *   Invoking custom event pass value to parent component.
    */
    closeModal(event){
        const selectedEvent = new CustomEvent("hidemodal", {
            detail: {
                openModal : false,
            }
        });
        this.dispatchEvent(selectedEvent); 
    }

    /*
    *   This function is used to get current step of Progress step.
    *   Setting current step.
    */
    handleOnStepClick(event) {
        this.currentStep = event.target.value;
    }

    /*
    *   Getter property for stepOne.
    *   Return step number.
    */
    get isStepOne() {
        return this.currentStep === "1";
    }
    
    /*
    *   Getter property for stepTwo.
    *   Return step number.
    */
    get isStepTwo() {
        return this.currentStep === "2";
    }
    /*
    *   This function is used to handle next buttton from conference wizard
    */
    handleNext(){
        if(this.currentStep == "1"){
            this.isEnablePrev= true;
            this.isEnableNext = false;
            this.isEnableAddSpeaker = true;
            this.modalHeader = 'Add Speakers';
            this.currentStep = "2";
           
        }
    }
    
    /*
    *   This function is used to handle previous buttton from conference wizard
    */
    handlePrev(){
        if(this.currentStep = "2"){
            this.isEnablePrev= false;
            this.isEnableNext = true;
            this.isEnableAddSpeaker = false;
            this.disbaleButton = false;
            this.modalHeader = 'Create Session';
            this.currentStep = "1";
        }
    }

    /*
    *   This function is used to handle submit record for confernece.
    *   Post operation for Record edit form.
    */
    handleSubmit(event){
        
        event.preventDefault();       // stop the form from submitting
        this.isLoaded = true;
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit();
     }

    /*
    *   This function is used to handle success record for confernece.
    *   Post operation for Record edit form after handle submit.
    *   Once the conference record created , All fields will be views as readl only mode along with creare confernece button.
    *   After creating conference , also displaying Toast Message.
    */
     handleSuccess(event) {
        this.isLoaded = false;
        //console.log(event.detail.id);
        this.conferenceId = event.detail.id;
        this.disbaleButton = true;
        let allInputFields = this.template.querySelectorAll('lightning-input-field');
        if(allInputFields){
            allInputFields.forEach(fields => {
                fields.disabled = true;
            });
        }

        this.dispatchEvent(
            handleToastSuccess('success','dismissable','Success','You have successfully created conference session. Please click next to Add speakers.')
        );
    }

    /*
    *   This function is used to handle success record for confernece.
    *   Post operation for Record edit form after handle submit.
    *   Once the conference record created , All fields will be views as readl only mode along with creare confernece button.
    */
    submitAllSpeakers(event){
       
        if(this.allSpeakers.length ===0 || this.allSpeakers == '[]'){
            this.dispatchEvent(
                handleToastSuccess('error','dismissable','Error','Atleast add one speaker.')
            );
        }else{
            let isDulicateFound = this.checkDuplicate(this.allSpeakers);
            //console.log('isDulicateFound--- ' , isDulicateFound);
            if(isDulicateFound){
                this.dispatchEvent(
                    handleToastSuccess('error','dismissable','Error','You cannot add a speaker twice. Duplicate entries found.')
                );
            }else if(!isDulicateFound){
                //console.log('Post operation starts',this.conferenceId);
                if(this.conferenceId != undefined){
                    createConference({conferenceId:this.conferenceId,speakerData:JSON.stringify(this.allSpeakers)})
                    .then((result) => {
                        console.log('result----- ' , JSON.stringify(result));
                        if(result =='success'){
                            this.closeModal();
                            this.refreshData();
                        }
                        this.error = undefined;
                    })
                    .catch((error) => {
                        this.error = error;
                    });
                }else{
                    this.dispatchEvent(
                        handleToastSuccess('error','dismissable','Error','You cannot add speaker without conference. Please go back and create session')
                    );
                }   
            }
        }
    }

    /*
    *   This function is used to add multiple speakers in conference.
    */
    addMultipleSpeaker(event){
       
        if(this.selectedSpeaker !=undefined){
          
            this.allSpeakers.push({
                id: this.allSpeakers[this.allSpeakers.length - 1] ? this.allSpeakers[this.allSpeakers.length - 1].id + 1 : 0,
                speakerId : this.selectedSpeaker.Id,
                speakerName : this.selectedSpeaker.Name,
                speakerEmail : this.selectedSpeaker.Email
            });
            this.selectedSpeaker =undefined;
            if(this.allSpeakers.length > 0){
                //console.log('final ', JSON.stringify(this.allSpeakers));
                let speakerListElm = this.template.querySelector(".conference-speaker-list");
                speakerListElm.classList.add("conference-speaker-list-table");
                this.resetSearchInput();                
            }
            
        }
    }

    
    /*
    *   This function is used to remove speakers from speaker list.
    */
    removeSpeaker(event){
        let currentIndex = event.currentTarget.dataset.id
        this.allSpeakers.splice(this.allSpeakers.findIndex(item => item.id ===currentIndex), 1);
        if(this.allSpeakers.length === 0){ 
            let speakerListElm = this.template.querySelector(".conference-speaker-list");
            speakerListElm.classList.remove("conference-speaker-list-table");
        }
    }

    /*
    *   This function is used to reset input of custom lookup component.
    *   Invoking child component function from parent.
    */
    resetSearchInput(){
        //console.log('hello in reset inpput');
      this.template.querySelector('c-search-component').handleResetInput();
    }
    
    /*
    *   This function is used to check weather speakers is added twice.
    *   Performing validation if a speaker added twice.
    */
    checkDuplicate(arr){
        const idSpeakers = arr.map(obj => obj.speakerId);
        //console.log(idSpeakers);
        const idSetSpeakers = new Set(idSpeakers);
        const hasDuplicates = idSetSpeakers.size < arr.length;
        return hasDuplicates;
    }
    /*
    *   This function is used to refresh the conference list after adding confernece.
    *   Refreshing the conference list on viewAllConference component.
    *   Invoking custom event.
    */
    refreshData(){
        const selectedEvent = new CustomEvent("refreshdata", {
        });
        this.dispatchEvent(selectedEvent); 
    }
}