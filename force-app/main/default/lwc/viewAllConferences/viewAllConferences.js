/*
*    Author     : Harshal Kolhe
*    Description: View All conferences component.
*    Date       : 15/09/2021
*/

import { LightningElement,api,track,wire} from 'lwc';
import conferenceResource from '@salesforce/resourceUrl/ConferenceResource';
import getAllConferences from '@salesforce/apex/ConferenceController.getAllConferences';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class ViewAllConferences extends LightningElement {

    // * Boolean variable to render detail component.
    @track isConferenceDetail = false;
    // * Boolean variable to handle Modal.
    @track openModal = false
    // * Variable to handle error message.
    error;
    // * Array to hold conference speakerList
    @track conferenceSpeakersList=[];
    @track isLoaded = false;
    // * Variable to hold selected conference speakerList
    @track selectedConference_SpeakerData;
    // * Variable to used for refresh list view.
    refreshTable;
    // * Variable for search query
    searchVal;

    /*
    *   This function is used to handle conference detail component.
    *   Handles onclick event.
    *   Render child component and display conference detail.
    */
    viewConferenceDetail(event){
        this.isConferenceDetail = true;
        let currentIndex = event.currentTarget.dataset.index;
        this.selectedConference_SpeakerData = this.retriveSearchData[currentIndex];
    }

    /*
    *   This function is used for return back to home page.
    *   Handles custom event. Getting param.
    *   Render child component and display conferences list view.
    */
    handleReturnToHome(event){
        this.isConferenceDetail = event.detail.isConferenceDetail;
        this.searchVal = '';
    }

    /*
    *   This function is used to open Modal of Create conference session.
    *   Setting value for open modal variable.
    */
    createConference(event){
        this.openModal = true;
    }

    /*
    *   This function is used to close Modal of Create conference session.
    *   Setting value for open modal variable.
    */
    closeModal(event){
        this.openModal = event.detail.openModal;
    }

    /*
    *   This function is used to get search query from input.
    *   Setting search query in searchVal variable.
    *   Used in Home page search input.
    */
    handleInputChange(event){
        this.searchVal = event.target.value;
    }

    
    /*
    *   This function is used to fetch conference and its related speakers.
    *   Calling apex method and received wrapper data.
    */
    @wire(getAllConferences)
    allConferenceSpeaker1(result) {
        if (result) {
            this.isLoaded = true;
            this.refreshTable = result;
            //console.log('  this.refreshTable ' ,  this.refreshTable);
            if(result.data){
                this.conferenceSpeakersList = result.data;
                this.isLoaded=false;
            }
            this.isLoaded=false;
        } else if (error) {
            //console.log('error@@----- ' ,JSON.stringify(error));
            this.isLoaded = false;
            this.error = error;
        }
        
    }

    /*
    *   This function is used to refresh list view on Homepage.
    *   Using refresh apex API.
    */
    handleRefresh(event){
        this.isLoaded = true;  
        return refreshApex(this.refreshTable);
    }

    /*
    *   This function is used to serach record in List view.
    *   Search record in list view.
    *   Passing searchQuery and List view array.
    */
    get retriveSearchData(){
        if(this.searchVal){
            let searchString = this.searchVal.toLowerCase();
            let filterList = [];
            this.conferenceSpeakersList.forEach(obj =>{
                let conferenceName = obj.conf.Name;
                if(conferenceName.toLowerCase().includes(searchString)){
                    filterList.push(obj);
                }
                
            });
            return filterList;
        }else{
            return this.conferenceSpeakersList;
        }
    }

 
    refreshView(event){
        refreshApex(this.refreshTable);
        //this.isLoaded = false;
    }
}