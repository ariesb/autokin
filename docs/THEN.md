# Autokin - Then Gherkin Steps


## Then response status code should be _`{expected status code}`_
If we want to test if the response to the request that we did is having the expected status code. Let say we are expecting a successful request having a 200 status code.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should be 200
```

If the status code is not as expected this will generate a failed test.

## Then response status code should not be _`{expected status code}`_
This is the same as above but a negative test instead.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should not be 404
```

## Then response header _`{expected HTTP Header}`_ should exist
This will assert if the expected HTTP Header exist from the response.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should not be 200
        Then response header "Server" should exist
```
If the header does not exists then it will failed the test, and will have a message `Expected header (Server) is missing.`

## Then response header _`{expected HTTP Header}`_ should not exist
This is the negative test of the previous HTTP Header test. If the expected header exists then the test will failed.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should not be 200
        Then response header "Server" should not exist
```

## Then response header _`{expected HTTP Header}`_ should be _`{expected HTTP Header value}`_
If we want to test not just the existence of the header, we can also assert if the value of the response header is the same as what we are expecting.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should not be 200
        Then response header "Server" should be "Autokin Server 2.1"
```

### Then response header _`{expected HTTP Header}`_ should not be _`{expected HTTP Header value}`_'
This step is the reverse or negative test for the HTTP Header and value check.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response status code should not be 200
        Then response header "Server" should not be "Autokin Server"
```

## Then response body should be valid json
This is a simple assert step to validate if the response body is in JSON format.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response body should be valid json
```

## Then response body should be json data of
If we want to assert the JSON body as a whole and compare to what we expect we can use this step.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response body should be json data of
        """
        {
            "id": 3001,
            "name": "Juan Pedro",
            "country": "PH"
        }
        """
```

This step will compare each of the JSON property and value as well. If the structure or the value does not match to the response then it will fail the test.


# Asserting for JSON Paths and Value
The following steps will be used to assert paths and values of the JSON body response.

For our examples, we will use this response body
```json
{
    "id": 3001,
    "name": "Juan Pedro",
    "country": "PH",
    "tasks": [
        {
            "tid": 1,
            "name": "Task 1"
        },
        {
            "tid": 2,
            "name": "Task 2"
        }
    ]
}
```

## Then I expect that path _`{path}`_ from body has value of _`{expected value}`_ 
Let us assert for a specific path with expected value, for example, in the above reponse we want to check for 
* path for `id` to have the value `3001` 
* and the path for `country` to have the expected value of `PH`

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then I expect that path "$.id" from body has value of 3001
        Then I expect that path "$.country" from body has value of "PH"
```

## Then response body should have path _`{expected JSON path}`_
This simple step is just to assert if the expected path exists.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then response body should have path "$.id"
        Then response body should have path "$.tasks[0].tid"
        Then response body should have path "$.tasks[1].name"
```

For more information, see https://goessner.net/articles/JsonPath/, and Autokin is using https://github.com/json-path/JsonPath for JSON Path processing.

# Storing Response Values
To chain scenarios, we need to keep some of the value that was part of the repponse from previous scenarios, to do this we can use the following steps.

## Then I keep the value of body path _`{JSON body path}`_ as _`{store name}`_
Let us have an example to store a value form the response body using a specific JSON path.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then Then I keep the value of body path "$.id" as "userId"
```
Now, we can use `userId` in some of the steps to pass as value of the header or parameters. 

## Then I keep the value of header _`{name}`_ as _`{store name}`_
```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then I keep the value of header "Server" as "serverName"
```

## Then I expect that the stored value in _`{store name}`_ is _`{expected value}`_
We can also assert if the value stored is the same as what we are expecting.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
        Then I keep the value of header "Server" as "serverName"
        Then I expect that the stored value in "serverName" is "Autokin Server"
```

#

See more examples on using [When](../blob/master/docs/WHEN.md) and [Given](../blob/master/docs/GIVEN.md) gherkin steps.