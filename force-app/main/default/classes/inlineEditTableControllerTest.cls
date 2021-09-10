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

        System.assertEquals(1, [SELECT Id FROM Account].size());
    }

    @isTest
    public static void getAccountTableController(){
        List<Account> expectedListAcc = [
            SELECT Name,Id 
            FROM Account
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
}
