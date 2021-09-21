@isTest
public with sharing class inlineEditTableControllerTest {
    @TestSetup
    public static void makeData(){
        List<Account> testAccount = new List<Account>();
        for (Integer i = 0; i < 2; i++) {
            testAccount.add(new Account(
                Name = 'testAccount' + i
            ));
        }

        insert testAccount;
    }
    
    @isTest
    public static void deleteAccountTest() {
        List<Id> listTest = new List<Id>();        
        Account deleteAccount = [
                SELECT Id
                FROM Account
                LIMIT 1
        ];
        listTest.add(deleteAccount.Id);        

        Test.startTest();        
        inlineEditTableController.deleteAccount(listTest);       
        Test.stopTest();

        System.assertEquals(1, [SELECT Id FROM Account LIMIT 50].size());
    }

    @isTest
    public static void deleteAccountNigativTest() {
        List<Id> listTest = new List<Id>();        
        Account deleteAccount = [
                SELECT Id
                FROM Account
                LIMIT 1
        ];
        listTest.add(deleteAccount.Id);

        Case caseTest = new Case(
            Status = 'Working',
            Origin = 'Web',
            AccountId = deleteAccount.Id
        );
        insert caseTest;

        Test.startTest();        
        try {
            inlineEditTableController.deleteAccount(listTest); 
        } catch (Exception ex) {

        }      
        Test.stopTest();

        System.assertEquals(2, [SELECT Id FROM Account].size());
    }

    @isTest
    public static void getAccountTableController(){
        List<Account> expectedListAcc = [
            SELECT Name,Id 
            FROM Account
            LIMIT 50
        ];

        Test.startTest();
        List<Account> getAccController = inlineEditTableController.getAccountTableController();
        Test.stopTest();

        for (Integer i = 0; i<expectedListAcc.size(); i++) {
            System.assertEquals(expectedListAcc.get(i), getAccController.get(i));
        }
    }

    @IsTest
    static void saveDraftValuesTest() {
        Account[] acct = [
            SELECT Name,Id, Rating 
            FROM Account
            LIMIT 50          
        ];
        acct[0].Rating = 'TestRating';

        Test.startTest();
        inlineEditTableController.saveDraftValues(acct);
        Test.stopTest();
        
        Account equalsAcc = [
            SELECT Name, Id, Rating  
            FROM Account
            WHERE Rating = 'TestRating'
        ];
        System.assertEquals('TestRating', equalsAcc.Rating);        
    }

    @IsTest
    static void saveDraftValuesNigativTest() {
        Account[] acct = [
            SELECT Name,Id, Rating 
            FROM Account
            LIMIT 50         
        ];
        acct[0].Rating = 'TestRating';
        acct[0].Id = null;

        Test.startTest();
        try {
        inlineEditTableController.saveDraftValues(acct);
        } catch (Exception ex) {

        }
        Test.stopTest();
        
        List <Account> equalsAcc = [
            SELECT Name, Id, Rating  
            FROM Account
            LIMIT 50         
        ];

        for (Account oneAccount : equalsAcc) {
            System.assertNotEquals('TestRating', oneAccount.Rating); 
        }               
    }
}
