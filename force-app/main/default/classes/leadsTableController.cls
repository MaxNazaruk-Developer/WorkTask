public with sharing class leadsTableController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadsTableController() {            
        return [
            SELECT Name, Phone, Title, Id
            FROM Lead                 
        ];             
    }
}
