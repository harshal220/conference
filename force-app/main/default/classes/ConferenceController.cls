/********************************************************************************
         * Date 	        ||	Author				||	Description
         * 15-Sept-2021		||	Harshal Kolhe		|| 	Created.
    *******************************************************************************/

public with sharing class ConferenceController {
   
    /*
     *Apex ClassName : ConferenceController
     *Aped MethodName: createConference
     *Desc			 : Create conference with speakers.
     *Parameters     : conference Id & JSON string speaker.
     *Return type    : String
     *Author		 : Harshal Kolhe.
     *Created Date	 : 16/09/2021
     */
    @AuraEnabled
    public static string createConference(string conferenceId,string speakerData){
        try {
            if(speakerData !=null && string.isNotBlank(conferenceId) && string.isNotBlank(speakerData) ){
                
                //JSON string to the apex function and then deserialize into a class speakerData.
                List<speakerData> speakerList = (List<speakerData>) JSON.deserialize(speakerData, List<speakerData>.class);
                
                //Intialise conference speaker list.
                list<Conference_Speaker__c> listConferenceSpeaker = new list<Conference_Speaker__c>();
                
                for(speakerData eachItem:speakerList){
                    Conference_Speaker__c objConference = new Conference_Speaker__c();
                    objConference.Speaker__c = eachItem.speakerId;
                    objConference.Conference__c =  conferenceId;
                    listConferenceSpeaker.add(objConference);
                }
    
                if(listConferenceSpeaker.size()>0){
                    //Inserting conference speaker list
                    insert listConferenceSpeaker;
                    return 'success';
                }
    
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return '';
    }

    /*
     *Apex ClassName : speakerData
     *Desc			 : Wrapper class for JSON string data.
     *Author		 : Harshal Kolhe.
     *Created Date	 : 16/09/2021
     */
    private class speakerData{
        Integer Id{get; set;}
        String speakerId {get; set;}
        String speakerName {get; set;}
        String speakerEmail {get; set;}
    }

    /*
     *Apex ClassName : ConferenceController
     *Method Name    : getAllConferences
     *Desc			 : Fetching all conference with related speakers
     *Return type    : List<WrapData> wrapperList.
     *Author		 : Harshal Kolhe.
     *Created Date	 : 17/09/2021
     */
    @AuraEnabled(cacheable=true)
    public static List<WrapData> getAllConferences(){
        
		list<Conference_Speaker__c> conferenceSpeakerList = [SELECT id,Conference__r.Name,Conference__c,Speaker__r.Name,Speaker__c 
                                                             FROM Conference_Speaker__c 
                                                            ];
        if(conferenceSpeakerList == null || conferenceSpeakerList.isEmpty()){
            return null;
        }

        map<Conference__c,list<Contact>> mapofConferenceSpeaker = getMapOfConferenceSpeaker(conferenceSpeakerList);
        List<WrapData> wrapDataList = new List<WrapData>();
        if(mapofConferenceSpeaker.size()>0){
            for(Conference__c conFerance : mapofConferenceSpeaker.keySet()){
                WrapData wd = new WrapData(conFerance,mapofConferenceSpeaker.get(conFerance));
                wrapDataList.add(wd);
            }
        }

        return wrapDataList;
    }

    /*
     *Apex ClassName : ConferenceController
     *Method Name    : getMapOfConferenceSpeaker
     *Desc			 : Creating data conference adn speaker. Method to post data to getAllConferences method.
     *Return type    : map<Conference__c,list<Contact>> 
     *Parameter      : list<Conference_Speaker__c> conferenceSpeakerList
     *Author		 : Harshal Kolhe.
     *Created Date	 : 17/09/2021
     */
    private static map<Conference__c,list<Contact>> getMapOfConferenceSpeaker(list<Conference_Speaker__c> conferenceSpeakerList){
        //Set of speaker id's
        set<Id> conSpeakerSet = new set<Id>();
        //Set of conference id's
        set<Id> conferenceSet = new set<Id>();
    
        //Iterating Conference speaker list
        // Adding Id's to set.
        for(Conference_Speaker__c conf:conferenceSpeakerList){
            conSpeakerSet.add(conf.Speaker__c);
            conferenceSet.add(conf.Conference__c);
        }
        //contact list of id's
        list<ID> contactIdList = new list<ID>();
        // Converting list from set of speakers.
        contactIdList.addAll(conSpeakerSet);
    
        //fetching speakers from conference_speakers
        list<Contact> speakerList = Conference_SOQL.getContactList(contactIdList);
       
        // Creating map Id Vs Contact
        Map<Id, Contact> mapOfSpeaker = new Map<Id, Contact>();        
        // Add all the records to the map.
        mapOfSpeaker.putAll(speakerList);

        //Conference Id's list
        list<ID> conferenceIdList = new list<ID>();
        // Add all the records to the map.		
        conferenceIdList.addAll(conferenceSet);  
 
        //fetching Conference record
        list<Conference__c> conferenceList = Conference_SOQL.getConferenceList(conferenceIdList);
       
        Map<Id, Conference__c> mapOfConference = new Map<Id, Conference__c>();
        mapOfConference.putAll(conferenceList);

        map<Conference__c,list<Contact>> mapofConferenceSpeaker = new map<Conference__c,list<Contact>>();
    
        for(Conference_Speaker__c conf:conferenceSpeakerList){
            //contactidlist.add(conf.Speaker__c);
            if(!mapofConferenceSpeaker.containsKey(mapOfConference.get(conf.Conference__c))){
                mapofConferenceSpeaker.put(mapOfConference.get(conf.Conference__c),new list<Contact>{mapOfSpeaker.get(conf.Speaker__c)});
            }else{
                list<Contact> tempcontactIdList = mapofConferenceSpeaker.get(mapOfConference.get(conf.Conference__c));
                tempcontactIdList.add(mapOfSpeaker.get(conf.Speaker__c));
            } 
        }

        return mapofConferenceSpeaker;
    }

    /*
     *Apex ClassName : ConferenceController.WrapData
     *Method Name    : 
     *Desc			 : Creating wrapper data which store Conference and List of speaker.
     *Return type    : 
     *Parameter      :
     *Author		 : Harshal Kolhe.
     *Created Date	 : 17/09/2021
     */
    public class WrapData{
        @AuraEnabled
        public List<Contact> confSpList;
        @AuraEnabled
        public Conference__c conf;

        public WrapData(Conference__c conf,List<Contact> confSpList){
            this.conf = conf;
            this.confSpList = confSpList;
        }
    }

    
    /*
     *Apex ClassName : ConferenceController.WrapData
     *Method Name    : enrollSession
     *Desc			 : Enrolling the session and sending email to attendee. (Future Work)
     *Return type    : String 
     *Parameter      :
     *Author		 : Harshal Kolhe.
     *Created Date	 : 19/09/2021
     */
    @AuraEnabled(cacheable=true)
    public static string enrollSession(String fName,String lName,String emailAdd,String sessionName,String sessionTime,String location){
        if(string.isNotBlank(fName) && string.isNotBlank(lName) && string.isNotBlank(emailAdd)){
            EmailTemplate emailTemp = [Select Id,DeveloperName,Subject from EmailTemplate where DeveloperName =: 'Session_Enrollment'];

            if(emailTemp!=null){
                Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                // In progress.
                    message.setTargetObjectId('0035g00000EMpXjAAL');
                // In progress.
                message.setSenderDisplayName('newMotion Learning');
                message.setReplyTo('no-reply@newMotion.com');
                message.setUseSignature(false);
                message.setBccSender(false);
                message.setSaveAsActivity(false);
                message.setTemplateID(emailTemp.Id);
                message.setHtmlBody('<h2>Hi '+fName+' '+lName+ ',</h2>'+
                '<p>Congratulations , You have successfully enrolled for '+sessionName+' !!</p><br/><br/>'+
                '<h3>Session Details</h3>'+
                '<h4>Session Name     :   '+sessionName+'</h4>'+
                '<h4>Session Time       : '+convertDate(sessionTime)+'</h4>'+
                '<h4>Session Location :  '+location+'</h4><br/>'+
                '<p>Please reach 5 min before session time.</p>');

                message.toAddresses = new String[] {
                    emailAdd
                };
                Messaging.SingleEmailMessage[] messages = new List < Messaging.SingleEmailMessage > {
                    message
                };
                Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
                if (results[0].success) {
                    //System.debug('The email was sent successfully.');
                    return 'The email was sent successfully.';
                }else {
                    System.debug('The email failed to send: ‘+results[0].errors[0].message');
                    return results[0].errors[0].message;
                }
            }
        }

        return null;
    }

    /*
     *Apex ClassName : ConferenceController
     *Method Name    : convertDate
     *Desc			 : Comverting string to date. (Future Work)
     *Return type    : DateTime 
     *Parameter      :
     *Author		 : Harshal Kolhe.
     *Created Date	 : 19/09/2021
     */
    private static DateTime convertDate(String sessionTime){

        if(string.isNotBlank(sessionTime)){
            List<String> DateAndTimeList = sessionTime.split('T');
            List<String> dayList = DateAndTimeList[0].split('-'); 
            List<string> timeList = DateAndTimeList[1].split(':');
            DateTime dt = DateTime.newInstance(Integer.valueOf(dayList[0]), Integer.valueOf(dayList[1]), Integer.valueOf(dayList[2]), Integer.valueOf(timeList[0]), Integer.valueOf(timeList[1]), Integer.valueOf(timeList[2].split('\\.')[0]));
            //System.debug('DateTime is : '+dt)
            return dt;
        }
        return null;
    }

}