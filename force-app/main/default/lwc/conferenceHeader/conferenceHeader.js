/*
*    Author     : Harshal Kolhe
*    Description: Header Component.
*    Date       : 16/09/2021
*/

import { LightningElement,api} from 'lwc';
import conferenceResource from '@salesforce/resourceUrl/ConferenceResource';
import conferenceHeading from '@salesforce/label/c.Conference_Heading';
export default class ConferenceHeader extends LightningElement {
    //Header Image
    bannerImage = conferenceResource + '/ASSET/img/motion.png'; 
    conferenceHeading = conferenceHeading;
}