@basic
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        Given I set query parameters to
            | name | value |
            | name | test  |
            | type | user  |
        When I GET /api/users/2
        Then response status code should be 200
        Then response body should be valid json
        Then response header "Server" should exist
        Then response header "Server" should be "cloudflare"
        Then response body should have path "$.data.id"
        Then I expect that path "$.data.first_name" from body has value of "Janet"
        Then I expect that path "$.data.id" from body has value of 2
        Then I keep the value of header "Server" as "sourceServer"
        Then response body should be json data of
        """
        {
            "data": {
                "id": 2,
                "first_name": "Janet",
                "last_name": "Weaver",
                "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
            }
        }
        """
        Then I expect that the stored value in "sourceServer" is "cloudflare"


    @todo
    Scenario: Getting user information 2

    @skip
    Scenario: Getting user information 3
        

