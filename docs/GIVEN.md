# Autokin - Given Gherkin Steps

## Given that a secure endpoint is up at _`{domain}`_ 
This step is used to define that the scenario will connect to a domain API with secured or using HTTPS.

```gherkin
    Scenario: Getting user information 
        Given that a secure endpoint is up at mysecureddomain.com
```

In the example above, we are defining that the API call will be at `https://mysecuredomain.com`.


## Given that a endpoint is up at _`{domain}`_
This step is the counterpart of the previous step, instead of using `https` this denotes that we are connecting to `http` only. Example, if the API is hosted at `http://mydomain.com`

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
```

Before any API call we need to have this `Given` step to specify the API domain and the protocol to use.

## Given I set _`{name}`_ header to _`{value}`_              
In most request HTTP headers are set to define the behaviour of the request. This step will add header information to our scenario. For example, we want to add HTTP header `Content-Type` with value of `application/json`.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
```

In the above example, we add 2 headers to our request.

## Given I set headers to                         
We can use this alternative steps to add multiple headers.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set headers to
            | name          | value             | 
            | Content-Type  | application/json  | 
            | DocId         | 3001              | 
```    

This adds 2 headers similar to the earlier example.

## Given I set query parameter _`{name}`_ to _`{value}`_ 
If we want to add query parameter to our request, we can use this step. For example, we need `name` query parameter with `John` as value.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set query parameter name to John
```

## Given I set query parameters to                   
If we want to set multiple parameters at the same time, we can use this step instead.

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set query parameters to 
            | name          | value             | 
            | name          | John              | 
            | gender        | male              | 
```    
That should set our request with 2 query parameters.

## Given I set the JSON body to                      
Now let say that we need to set the body of the request, we can do this using this step.

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "name": "New Task",
            "priority": 1,
            "notes": "Go document things"
        }
        """
```    

## Given I set the cookie to _`{cookie value pair}`_     
In some cases, request required some prepopulated cookies, so let's have some example.

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set the cookie to channel=direct
```  
This will create a cookie bounded to the domain that was previously sepcified.

## Given I have basic authentication credentials _`{username}`_ and _`{password}`_ 
Set basic authentication, can be as simple as the following example.

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I have basic authentication credentials myusername and mypa55w0rd
``` 

The step will automaticall add HTTP Header `Authorization` with Based64 encoded credentials.

```http
Authorization: Basic bXl1c2VybmFtZTpteXBhNTV3MHJk
```

## Given I set the bearer token to _`{token}`_ 
Sets bearer authorisation token to our request.

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set the bearer token to bXl1c2VybmFtZQ==:bXlwYTU1dzByZA==
``` 

So this will add HTTP Header as follows
```http
Authorization: Bearer bXl1c2VybmFtZQ==:bXlwYTU1dzByZA==
```

## Given I set the bearer token with _`{stored value name}`_ 
Sets bearer token with a previously stored value. For example, in one of the previous API call we do a login, and from the sucessful response, we kep the session token as `userSession`, we can use this to chain our scenarios.

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set the bearer token with "userSession" 
``` 

#

See more examples on using [Then](../blob/master/docs/THEN.md) and [When](../blob/master/docs/WHEN.md) gherkin steps.