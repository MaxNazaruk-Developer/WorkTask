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
        List<Contact> getContactsController = contactController.getContacts(null);
        List<Contact> getOneContactsController = contactController.getContacts('FirstNameContact');
        List<Contact> allContacts = [
            SELECT LastName, FirstName, CreatedDate 
            FROM Contact
        ];
        List<Contact> oneContacts = [
            SELECT LastName, FirstName, CreatedDate 
            FROM Contact
            WHERE FirstName = 'FirstNameContact'
        ];
        System.assertEquals(allContacts, getContactsController);
        System.assertEquals(oneContacts, getOneContactsController);
    }
    
}
