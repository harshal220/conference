/********************************************************************************
         * Date 	        ||	Author				||	Description
         * 18-Sept-2021		||	Harshal Kolhe		|| 	Created.
    *******************************************************************************/

public with sharing class Conference_SOQL {

    /*
     *Apex ClassName : Conference_SOQL
     *Aped MethodName: getContactList
     *Desc			 : Create constant method , which return the list of SObject.
     *Parameters     : Object list Id's.
     *Return type    : list<Sobject>
     *Author		 : Harshal Kolhe.
     *Created Date	 : 18/09/2021
     */
    public static List < Contact > getContactList(List<Id> contactIdList) {
        
        List < Contact > listContact = [SELECT Id,Name,Picture_Path__c,Email
                                       FROM Contact
                                       WHERE Id IN : contactIdList 
                                       WITH SECURITY_ENFORCED
        ];
        return listContact;
    }

    /*
     *Apex ClassName : Conference_SOQL
     *Aped MethodName: getConferenceList
     *Desc			 : Create constant method , which return the list of SObject.
     *Parameters     : Object list Id's.
     *Return type    : list<Sobject>
     *Author		 : Harshal Kolhe.
     *Created Date	 : 18/09/2021
     */
    public static List < Conference__c > getConferenceList(List<Id> conferenceIdList) {
        
        List < Conference__c > listConference = [SELECT Id,Name,Conference_Time__c,Conference_Duration__c,Conference_Room__c,
                                                    Conference_Topic__c,Conference_Description__c,Level__c
                                            FROM Conference__c
                                            WHERE Id IN : conferenceIdList 
                                            WITH SECURITY_ENFORCED
        ];
        return listConference;
    }    
}