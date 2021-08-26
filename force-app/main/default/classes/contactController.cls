public with sharing class contactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT FirstName, LastName, Email, AccountId, MobilePhone, CreatedDate 
            FROM Contact            
       ];
    }
}
