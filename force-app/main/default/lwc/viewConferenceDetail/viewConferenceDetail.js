/*
*    Author     : Harshal Kolhe
*    Description: View All detail of conference includes : Conference detail & Speakers and their information.
*    Date       : 15/09/2021
*/

import { LightningElement,api,track} from 'lwc';
import conferenceResource from '@salesforce/resourceUrl/ConferenceResource';
import enrollSession from '@salesforce/apex/ConferenceController.enrollSession';
import {handleToastSuccess,handleToastError,handleToastInfo,handleToastWarning} from 'c/conferenceUtility';
export default class ViewConferenceDetail extends LightningElement {
    
    noPreviewImage = conferenceResource + '/ASSET/img/noPreview2.png';
    
    // * Array to store conference speakers
    @api conference_SpeakerList=[];
    // * Data to store selecetd conference data.
    @track selectedConferenceData;
    // * Array to store conference speakers for selected conference.
    @track conferenceSpeakers;

    //Part of future work
    // * Enrollment form variables
    @track isEnrollMentForm = false;
    @track FirstName;
    @track LastName;
    @track Email;
    @track Phone;

    /*
    *   This function is used to go back to home page from conference page.
    *   Invoking custom event to go back to home.
    *   Passing parameter through custom event. 
    */
    returnHome(event){
        const selectedEvent = new CustomEvent("returnpage", {
            detail: {
                isConferenceDetail : false,
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    /*
    *   Getter function us used to get the data from Parent component.
    *   Sharing data from viewAllconference component.
    *   Return the data which will get it from viewAllconference component.
    *   selectedConferenceData : Holding the array of conference and speakers 
    */
    @api
    get conference(){
        return this.selectedConferenceData;
    }

    /*
    *   Setter function us used to set the data from Parent component to class variable.
    *   Setting to individual variable.
    *   Class variable are Conference and Speaker to iterate and display the content. 
    */
    set conference(value){
        //console.log('details component value ',value.confSpList.length);
        this.conferenceSpeakers = value.confSpList
        this.selectedConferenceData = value.conf;
    }
    /*
    *   This function is used to set open Enroll Modal.
    */
    handleSessionEnroll(event){
        this.isEnrollMentForm = true;

    }

    /*
    *   This function is used to close the Enroll Modal.
    */
    closeModal(event){
        this.isEnrollMentForm = false;
    }

    /*
    *   This function is used to get values of Enrollment form.
    *   Setting value to variable for post operation.
    */
    handleInputChange(event){
        if(event.target.name=='FirstName'){
            this.FirstName = event.target.value;
        }
        if(event.target.name == 'LastName'){
            this.LastName = event.target.value;
        }
        if(event.target.name == 'Email'){
            this.Email = event.target.value;
        }
        if(event.target.name == 'Phone'){
            this.Phone = event.target.value;
        }
    }

    /*
    *   This function is used to enrolled a session.
    *   Attendee can enroll for session by entering few detail over modal form.
    *   After successfully enroller , attendee can also receive email confirmation.
    */
    submitForm(){

        if(this.FirstName !=undefined && this.LastName !=undefined && this.Email !=undefined && this.selectedConferenceData!=undefined){
                
            enrollSession({fName:this.FirstName,lName:this.LastName,emailAdd:this.Email,sessionName:this.selectedConferenceData.Name,
                            sessionTime:this.selectedConferenceData.Conference_Time__c,location:this.selectedConferenceData.Conference_Room__c})
            .then(result => {
                //console.log('result--- ' ,  result);
                if(result && result ==='The email was sent successfully.'){
                    this.dispatchEvent(
                        handleToastSuccess('success','dismissable','Success','You have successfully enrolled for session. We have already sent you an email confirmation.')
                    );
                }
                this.isEnrollMentForm = false;
            })
            .catch(error => {
                this.isEnrollMentForm = false;
                console.log(error);
                //this.error = error;
            });
                   
        }
    }
}