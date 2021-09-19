/********************************************************************************
         * Date 	        ||	Author				||	Description
         * 18-Sept-2021		||	Harshal Kolhe		|| 	Created.
    *******************************************************************************/

public class uploadContactPictureController {
    
    public blob picture { get; set; }
    public String errorMessage { get; set; }
    private final Contact speaker;
    private ApexPages.StandardController stdController;
    
	public uploadContactPictureController(ApexPages.StandardController stdController) {
        this.speaker = (contact)stdController.getRecord();
        this.stdController = stdController;
       
    }
    
    /*
     *Apex ClassName : uploadContactPictureController
     *Aped MethodName: save
     *Desc			 : Function used to upload profile picture to contact.
     *Return type    : String
     *Author		 : Harshal Kolhe.
     *Created Date	 : 18/09/2021
     */
    public PageReference save() {
        errorMessage = '';
        try {
            //upsert speaker;
            if (picture != null) {
                Attachment attachment = new Attachment();
                attachment.body = picture;
                attachment.name = 'speaker_' + speaker.id + '.jpg';
                attachment.parentid = speaker.id;
                attachment.ContentType = 'application/jpg';
                insert attachment;
                speaker.Picture_Path__c = '/servlet/servlet.FileDownload?file='
                    + attachment.id;
                update speaker;
                //return (new PageReference('/'+speaker.id));
            }
            
            return new ApexPages.StandardController(speaker).view();
            //return null;
        } catch(System.Exception ex) {
            errorMessage = ex.getMessage();
            return null;
        }
    }
}