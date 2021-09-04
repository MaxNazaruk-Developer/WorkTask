@isTest
public with sharing class leadsTableControllerTest {
    @TestSetup
    static void makeData(){
        List<Lead> listAddLeads= new List<Lead>();
        for (Integer i = 0; i < 100; i++) {
            Lead newLead = new Lead(
                FirstName = 'Test' + i,
                LastName = 'Sutap' + i,
                Phone = '546546' + i,
                Title = 'police' + i,
                Company = 'Lead Company'
            );
            listAddLeads.add(newLead);
        }       
        insert listAddLeads;
    }
    @isTest
    public static void getLeadsTableControllerTest() {
        List<Lead> getLeads = [
            SELECT Name,Phone,Title, Id FROM Lead
        ];
            
       Test.startTest();
       List<Lead> getLeadController = leadsTableController.getLeadsTableController();
       Test.stopTest();
           
       System.assertEquals(getLeads, getLeadController);
    }
}
