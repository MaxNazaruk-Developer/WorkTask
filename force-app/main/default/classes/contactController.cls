public with sharing class contactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchKey) { 
        if (String.isBlank(searchKey)) {  
            return [
                SELECT FirstName, LastName, Email, Account.Name, AccountId, MobilePhone, CreatedDate 
                FROM Contact
                ORDER BY CreatedDate DESC           
            ];
        } else {
            String searchName = '%' + searchKey + '%';
            return [
                SELECT FirstName, LastName, Email, Account.Name, AccountId, MobilePhone, CreatedDate 
                FROM Contact 
                WHERE FirstName
                LIKE :searchName
                ORDER BY CreatedDate DESC         
            ];
        }
    }
}
