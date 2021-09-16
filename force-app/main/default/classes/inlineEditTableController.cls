public with sharing class inlineEditTableController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountTableController() {            
        return [
            SELECT Name, Rating, Id
            FROM Account                 
        ];             
    }

    @AuraEnabled
    public static String deleteAccount(List<Id> idAccountDelete) {        
        List<Account> lstAccToDelete = new List<Account>();
        String respons = '';      
        for (Id idAcc : idAccountDelete) {
            lstAccToDelete.add([
                SELECT Id 
                FROM Account
                WHERE Id =: idAcc
                LIMIT 1
            ]);
        }
        try {           
            delete lstAccToDelete;                   
        } catch (Exception ex) {            
            respons = ex.getMessage();                             
        }
        return respons;            
    }
    
    @AuraEnabled
    public static String saveDraftValues(Object data) {
        System.debug(data);
        List<Account> listOfAccounts = (List<Account>) JSON.deserialize(
                JSON.serialize(data),
                List<Account>.class
        );
        String responsSave = '';
        System.debug(listofAccounts); 
        try {
            update listOfAccounts;        
        } catch (Exception ex) {            
            responsSave = ex.getMessage();                             
        }
        return responsSave; 
        
    }  
}