public with sharing class inlineEditTableController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountTableController() {            
        return [
            SELECT Name, Rating, Id
            FROM Account                 
        ];             
    }

    @AuraEnabled
    public static void deleteAccount(List<Id> idAccountDelete) {
        List<Account> listAccountDelete = new List<Account>();
        for (Id idAccount : idAccountDelete) {
            Account listSenchAccount = [
                SELECT Id 
                FROM Account
                WHERE Id =: idAccount
                LIMIT 1
            ];
            listAccountDelete.add(listSenchAccount);
        }
        try {
            delete listAccountDelete;
        } catch (Exception e) {
            
        }       
    }
    
}
