@IsTest
public with sharing class contactControllerTest {
   
    @TestSetup
    static void addContacts(){
        List<Contact> listAddContacts= new List<Contact>();
        for (Integer i = 0; i < 100; i++) {
            Contact newContact = new Contact(
                LastName = 'Test' + i,
                FirstName = 'Sutap' + i
            );
            listAddContacts.add(newContact);
        }
        listAddContacts.add(new Contact(
            LastName = 'OneContact',
            FirstName = 'FirstNameContact'            
        ));
        insert listAddContacts;
    }

    @IsTest
    static void getContactsTest(){
        Test.startTest();
        List<Contact> getContactsController = contactController.getContacts('');
        Test.stopTest();

        List<Contact> allContacts = [
            SELECT LastName, FirstName, CreatedDate 
            FROM Contact
        ];
        
        System.assertEquals(allContacts, getContactsController);
        
    }

    @IsTest
    static void getOneContactTest(){
        Test.startTest();
        List<Contact> getOneContactsController = contactController.getContacts('FirstNameContact');
        Test.stopTest();

        List<Contact> oneContacts = [
            SELECT LastName, FirstName, CreatedDate 
            FROM Contact
            WHERE FirstName = 'FirstNameContact'
        ];
        System.assertEquals(oneContacts, getOneContactsController);
    }

    @IsTest
    static void deleteContactTest() {
        Contact testContact = [
            SELECT Id 
            FROM Contact
            WHERE LastName = 'OneContact'
            LIMIT 1
            ];
       
        List<Id> idtestContact = New List<Id>();
        idtestContact.add(testContact.Id);
        
        Test.startTest();
        contactController.deleteContact(idtestContact);
        Test.stopTest();

        List<Contact> nullContact = [
            SELECT Id 
            FROM Contact
            WHERE LastName = 'OneContact'            
            ];
        System.assertEquals(0, nullContact.size());
    }
    
}
