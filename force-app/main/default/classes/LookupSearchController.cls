/********************************************************************************
         * Date 	        ||	Author				||	Description
         * 15-Sept-2021		||	Harshal Kolhe		|| 	Created.
    *******************************************************************************/
public with sharing class LookupSearchController {
    /*
     *Apex ClassName : LookupSearchController
     *Aped MethodName: search
     *Desc			 : Function used to search for lookup data on basis of search query.
     *Parameters     : Object Name , List Field 
     *Return type    : String
     *Author		 : Harshal Kolhe.
     *Created Date	 : 16/09/2021
     */
    @AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String returningQuery = '';
        returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        return searchRecords.get(0);
    }
}