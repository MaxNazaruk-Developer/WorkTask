public with sharing class contactTableNameAndIdNameController {    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactNameAndId() {            
        return [
            SELECT Name, Id
            FROM Contact                
        ];             
    }
}
