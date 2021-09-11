@isTest
public with sharing class contactTableNameAndIdNameControllerTest {
    @TestSetup
    static void makeData(){
        List<Contact> listAddContacts= new List<Contact>();
        for (Integer i = 0; i < 100; i++) {
            Contact newContact = new Contact(
                LastName = 'Test' + i,
                FirstName = 'Sutap' + i
            );
            listAddContacts.add(newContact);
        }       
        insert listAddContacts;
    }
    @isTest
    public static void getContactNameAndIdTest() {
        List<Contact> getContacts = [
            SELECT Name, Id FROM Contact
        ];
        
       Test.startTest();
       List<Contact> getContactsController = contactTableNameAndIdNameController.getContactNameAndId();
       Test.stopTest();
       
       System.assertEquals(getContacts, getContactsController);
    }
}
