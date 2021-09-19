/*
*    Author     : Harshal Kolhe
*    Description: Utility js.
*    Date       : 16/09/2021
*/

import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class ConferenceUtility extends LightningElement {}

/*
    *Method  	     : handleToastSuccess
    *Desc			 : Display success toast
    *Return type	 : Toast Event
    *Parameter		 : 
    *Author		     : Harshal Kolhe
    *Created Date	 : 16/09/2021
*/
export function handleToastSuccess(variant = 'info', mode = 'dismissable', title, message) {

    const event = new ShowToastEvent({
        title: title,
        message: message,
        mode: mode,
        variant: variant,

    });
    return event;
}

/*
     *Method  	     : handleToastError
     *Desc			 : Display error toast
	 *Return type	 : Toast Event
	 *Parameter		 : 
     *Author		 : Harshal Kolhe
	 *Created Date	 : 16/09/2021
*/
export function handleToastError(variant = 'info', mode = 'dismissable', title, message) {

    const event = new ShowToastEvent({
        title: title,
        message: message,
        mode: mode,
        variant: variant,

    });
    return event;
}

/*
     *Method  	     : handleToastInfo
     *Desc			 : Display info toast
	 *Return type	 : Toast Event
	 *Parameter		 : 
     *Author		 : Harshal Kolhe
	 *Created Date	 : 19/09/2021
*/
export function handleToastInfo(variant = 'info', mode = 'dismissable', title, message) {

    const event = new ShowToastEvent({
        title: title,
        message: message,
        mode: mode,
        variant: variant,

    });
    return event;
}

/*
     *Method  	     : handleToastWarning
     *Desc			 : Display warning toast
	 *Return type	 : Toast Event
	 *Parameter		 : 
     *Author		 : Harshal Kolhe
	 *Created Date	 : 19/09/2021
*/
export function handleToastWarning(variant = 'info', mode = 'dismissable', title, message) {

    const event = new ShowToastEvent({
        title: title,
        message: message,
        mode: mode,
        variant: variant,

    });
    return event;
}