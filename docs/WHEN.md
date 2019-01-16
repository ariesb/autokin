# Autokin - When Gherkin Steps

## When I GET _`{uri}`_
To perform a simple `GET` request, we use this `When` step. 

```gherkin
    Scenario: Getting user information 
        Given that a endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set DocId header to 3001
        When I GET /users/info
```

## When I POST to _`{uri}`_
To submit a `POST` request, this step will help us.

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
        When I POST to /tasks
```  

## When I PUT to _`{uri}`_
With this step we can do a simple `PUT`

```gherkin
    Scenario: Creating a new task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        When I PUT to /tasks
```  

## When I perform DELETE to _`{uri}`_
Performing a `DELETE` request is simple as using this step

```gherkin
    Scenario: Delete a task 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        Given I set query parameter taskId to 1001
        WHEN I perform DELETE to /tasks
```  

## When I PATCH to _`{uri}`_
When you need to use the `PATCH` method us this step.

```gherkin
    Scenario: Some patch request 
        Given that a secure endpoint is up at mydomain.com
        Given I set Content-Type header to application/json
        WHEN I PATCH to /patch/uri
```  

#

See more examples on using [Then](THEN.md) and [Given](GIVEN.md) gherkin steps.