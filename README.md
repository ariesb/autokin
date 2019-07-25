[![Build Status](https://travis-ci.org/ariesb/autokin.svg?branch=master)](https://travis-ci.org/ariesb/autokin) [![Coverage Status](https://coveralls.io/repos/github/ariesb/autokin/badge.svg?branch=master)](https://coveralls.io/github/ariesb/autokin?branch=master)

# Autokin (Automation by Gherkin)

This is a simple package/library that helps tester to do automation of REST/API using Gherkin without knowing JavaScript coding. All you need to know is Gherkin and you can start working and creating automated test for contract testing, or simple API test.

One of the simplest item that we do not want to missed is to break contract of front end apps to our service apps. To make sure that we can detect this easy and early on we want the following:

:thumbsup: Validate each endpoints response schema.  
:thumbsup: Validate possible response data.  
:thumbsup: Validate data fetch with authentications.  
:thumbsup: Enable chanining of multiple endpoint calls.  
:thumbsup: Validate HTTP status code and header data.  
:thumbsup: Ability to drive test using data.  
:thumbsup: Supports data generation for inputs.  
:thumbsup: Easy to write and not too technical.  
:thumbsup: Easy to integrate with CI/CD environment.  
:thumbsup: Supported with generated test reports.  

If these are something you need then Autokin can help you on that. Explore!

## What's New
* Ability to test response JSON Data against JSON Schema (https://json-schema.org/). See example.
* Allow pre-define variable set that can be loaded use within features
* **Autokin Generators**: Ability to generate data randomly or based on certain list
* Ability to test response execution time
* New Console Log Outputs

## Creating an Autokin Project

### Make a project folder
```bash
mkdir my-autokin-project
```
Name the folder anything that you see fit. Before proceeding to next step make sure that you are inside the new folder.

```bash
cd my-autokin-project
```

Next, let us install Autokin.

### Install Autokin
You can simple do it by:
```bash
npm install autokin --save-dev
```

That simple, and now we are ready to create our first project. 

### Creating a project
To create a new Autokin project, run the following command.
```bash
./node_modules/.bin/autokin -i
```

This will create the necessary folder structure and sample files.

```json
   my-autokin-project
      ├── features
      |    ├── support
      |         ├── steps.js
      |
      └── first.feature
```

Let's run the test!

### Running the test
Simply, issue the command below to run the test.

```bash
./node_modules/.bin/autokin -e
```

It should have the following output:
```bash
./node_modules/.bin/autokin -e
Autokin Test Run
Feature: My Feature > My First Scenario - ✔ Passed

Test Result Summary
┌────────────┬────────┬───────────┬───────┐
│ Features   │ Result │ Scenarios │ Steps │
├────────────┼────────┼───────────┼───────┤
│ My Feature │    --- │         1 │     0 │
└────────────┴────────┴───────────┴───────┘

┌────────────────────────┬────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┐
│ Features / Scenarios   │ Result │ Steps │ Passed │ Failed │ Skipped │ Pending │ Ambiguous │ Unknown │
├────────────────────────┴────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┤
│ My Feature                                                                                          │
├────────────────────────┬────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┤
│      My First Scenario │ ---    │     0 │      0 │      0 │       0 │       0 │         0 │       0 │
└────────────────────────┴────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┘
```

## Creating your first REST Gherkin

For example we do have an endpoint as https://reqres.in/api/users/2, which is to fetch a user information. So let's start writing our Feature and Scenario, open the `first.feature` file that was previously generated. The file should have the following content:

```gherkin
@autokin
Feature: My Feature
	As Autokin tester
	I want to verify that all API are working as they should

Scenario: My First Scenario
```

Now I want to say that I want to access the endpoint:

```gherkin
@autokin
Feature: My Feature
	As Autokin tester
	I want to verify that all API are working as they should

Scenario: My First Scenario
    Given that a secure endpoint is up at reqres.in
    When I GET /api/users/2
```
We added 2 lines, first we define that we want to access a secure (https) endpoint at the domain `reqres.bin`. Then on the second line, we said that we want to do a `GET` to `/api/users/2`.

At this point we already access the endpoint, and we can run test.
```bash
./node_modules/.bin/autokin -e
Autokin Test Run
Feature: My Feature > My First Scenario - ✔ Passed

Test Result Summary
┌────────────┬────────┬───────────┬───────┐
│ Features   │ Result │ Scenarios │ Steps │
├────────────┼────────┼───────────┼───────┤
│ My Feature │    100 │         1 │     2 │
└────────────┴────────┴───────────┴───────┘

┌────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┐
│ Features / Scenarios   │ Result   │ Steps │ Passed │ Failed │ Skipped │ Pending │ Ambiguous │ Unknown │
├────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┤
│ My Feature                                                                                            │
├────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┤
│      My First Scenario │ ✔ Passed │     2 │      2 │      0 │       0 │       0 │         0 │       0 │
└────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┘
```

Let's add some test on it. We know that the endpoint will return a 200 status code. Let us add that as verification item, but instead of 200 we expect 400 for it to generate an error. We add the new step after the `When`.

```gherkin
Scenario: My First Scenario
    Given that a secure endpoint is up at reqres.in
    When I GET /api/users/2
    Then response status code should be 400
```
Yes, it should be that sentence, we can only change the value that we expect. Let's run the test again.

```
./node_modules/.bin/autokin -e
Autokin Test Run
Feature: My Feature > My First Scenario - ✖ Failed

Test Result Summary
┌────────────┬───────────────────┬───────────┬───────┐
│ Features   │            Result │ Scenarios │ Steps │
├────────────┼───────────────────┼───────────┼───────┤
│ My Feature │ 66.66666666666666 │         1 │     3 │
└────────────┴───────────────────┴───────────┴───────┘

┌────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┐
│ Features / Scenarios   │ Result   │ Steps │ Passed │ Failed │ Skipped │ Pending │ Ambiguous │ Unknown │
├────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┤
│ My Feature                                                                                            │
├────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┤
│      My First Scenario │ ✖ Failed │     3 │      2 │      1 │       0 │       0 │         0 │       0 │
└────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┘
```

As expected it will generate an error. Fixing the expected value to 200 and running the test will have a clean successful run.

```gherkin
Scenario: My First Scenario
    Given that a secure endpoint is up at reqres.in
    When I GET /api/users/2
    Then response status code should be 200
```
Yes, it should be that sentence, we can only change the value that we expect. Let's run the test again.

```
./node_modules/.bin/autokin -e
Autokin Test Run
Feature: My Feature > My First Scenario - ✔ Passed

Test Result Summary
┌────────────┬────────┬───────────┬───────┐
│ Features   │ Result │ Scenarios │ Steps │
├────────────┼────────┼───────────┼───────┤
│ My Feature │    100 │         1 │     3 │
└────────────┴────────┴───────────┴───────┘

┌────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┐
│ Features / Scenarios   │ Result   │ Steps │ Passed │ Failed │ Skipped │ Pending │ Ambiguous │ Unknown │
├────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┤
│ My Feature                                                                                            │
├────────────────────────┬──────────┬───────┬────────┬────────┬─────────┬─────────┬───────────┬─────────┤
│      My First Scenario │ ✔ Passed │     3 │      3 │      0 │       0 │       0 │         0 │       0 │
└────────────────────────┴──────────┴───────┴────────┴────────┴─────────┴─────────┴───────────┴─────────┘
```

## Targetting Test with Tags
Let say I have now several features like the two examples below:

` my-first-feature.feature`
```gherkin
@core
Feature: My Feature
	As Autokin tester
	I want to verify that all API are working as they should

Scenario: My First Scenario
    Given that a secure endpoint is up at reqres.in
    When I GET /api/users/2
```
The above feature file we tag that as `@core` feature, while below we tag that as `@fix-321` to denote that this is for the fix for `321 issue`.

` my-second-feature.feature`
```gherkin
@fix-321
Feature: My Feature
	As Autokin tester
	I want to verify that all API are working as they should

Scenario: Verify if API does not accept character id
    Given that a secure endpoint is up at reqres.in
    When I GET /api/users/abc
```

So now we want to run the test but only focus on running `@fix-321`. WE can do this by using the following command.

```bash
./node_modules/.bin/autokin -e -t @fix-321
```

If we want to run only `@core` then we can use the following:
```bash
./node_modules/.bin/autokin -e -t @core
```
If we are nto passing the tags `-t` or `--tags` parameter, it will run everything.

What if we want to run everything but not the `@core`, then we can also use the following command:

```bash
./node_modules/.bin/autokin -e -t "not @core"
```

See more about [tags](docs/TAGS.md).

## Chaining
Chaining is a way to continue another test that was previously executed. This is some how the nearest to chaining scenarios for Autokin. Let us say that you want to Login the user then use the session token to retrieve user information.

```http
    POST https://www.autokinjs.com/login
    Headers:
    Content-Type: application/json
    {
        "username": "juan",
        "password": "p3dr0"
    }

    Response:
    {
        "sessionId": "2AA21boNhOM5zR3Xgn96qw=="
    }

    GET https://www.autokinjs.com/user/1001
    Headers: 
    Content-Type: application/json
    SessionId: 2AA21boNhOM5zR3Xgn96qw==

    Response:
    {
        "id": 1001,
        "name": "Juan Pedro",
        "age": 30 
    }
```

So having that we can have this Feature definition:

```gherkin
@chaining
Feature: My Chaining Feature
	As Autokin tester
	I want to verify that all API are working as they should

    Scenario: Login to the system
        Given that a secure endpoint is up at www.autokinjs.com
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "juan",
            "password": "p3dr0"
        }
        """
        When I POST /login
        Then response status code should be 200
        Then I keep the value of body path "$.sessionId" as "userSessionToken"

    Scenario: Get user information
        Given that a secure endpoint is up at www.autokinjs.com
        Given I set Content-Type header to application/json
        Given I set SessionId header from "userSessionToken"
        When I GET /user/1001
        Then response status code should be 200

```

As you see in the above example, we login then we store the session token to a variable `userSessionToken`, the variable name can be anything as long as a one word. Following to our next scenario, as needed by our API, we set the header `SessionId` to the value of the previously stored data by sepcifying that we are getting the stored value from the variable `userSessionToken`.

## JSON Schema Comparison
It is important that contracts among consumer of the API ensure that the data expected are always correct. With this JSON Schema comparison, we can add assertion on the response data if it conforms to expected schema. We can store the schema to a file and use that as expected schema.

```http
    POST https://www.autokinjs.com/login
    Headers:
    Content-Type: application/json
    {
        "username": "juan",
        "password": "p3dr0"
    }

    Response:
    {
        "sessionId": "2AA21boNhOM5zR3Xgn96qw=="
    }
```

**Expected Login Response Schema**

`feature/schema/login-response-schema.json`
```json
{
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://autokinjs.com/root.json",
  "type": "object",
  "required": [
    "sessionId",
    "name"
  ],
  "properties": {
    "sessionId": {
      "$id": "#/properties/sessionId",
      "type": "string",
      "pattern": "^(.*)$"
    },
    "name": {
      "$id": "#/properties/name",
      "type": "string",
      "pattern": "^(.*)$"
    }
  }
}
```

```gherkin
@schemachecks
Feature: My Schema Check Feature
	As Autokin tester
	I want to verify that all API contracts are correct

    Scenario: Login to the system
        Given that a secure endpoint is up at www.autokinjs.com
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "juan",
            "password": "p3dr0"
        }
        """
        When I POST /login
        Then response status code should be 200
        Then I keep the value of body path "$.sessionId" as "userSessionToken"
        Then I expect response data schema complies to "./features/schema/login-response-schema.json"
```
Based on the result of the response, it only include `sessionId` and does not return any property `name`. In the schema, it was defined that `name` is required property of the response schema.

```
Feature: My Schema Check Feature > Login to the system
        ✔ Passed - Given that a secure endpoint is up at www.autokinjs.com
        ✔ Passed - Given I set Content-Type header to application/json
        ✔ Passed - Given I set the JSON body to
        ✔ Passed - When I POST /login
        ✔ Passed - Then response status code should be 200
        ✔ Passed - Then I keep the value of body path "$.sessionId" as "userSessionToken"
        ✖ Failed - Then I expect response data schema complies to "./features/schema/login-response-schema.json"
                 - Expected schema not match from the reponse data. Found 1 errors. [Missing required property: name]

```

## Pre-define Variable Set
Iin most case we do not want to hard code values in our test and we want to control the value based on certain environment to run it. You can specify pre-defined variable set using a JSON file.

**Pre-defined Staging Environment Variables**
```features/data/uat.variables.json```
```json
{
  "host": "www.uat.autokinjs.com",
  "username": "autokin"
}
```

For example above is our variable set, and we have 2 key-value that we can use within our test. Using the above anticipated variables, the following can be our test:
```gherkin
Feature: My Feature
	As Autokin tester
	I want to verify that all API are working as they should

    Scenario: Login to the system
        Given that a secure endpoint is up at {host}
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "{username}",
            "password": "p3dr0"
        }
        """
        When I POST /login
        Then response status code should be 200
        Then I keep the value of body path "$.sessionId" as "userSessionToken"
```

In the above example, we can use the variable by using curly braces to enclose our variable name, such as ``{host}``. In the example above, we used the variable as our source for the ``host``, and we also used another variable in the ``username`` as part of the body.

**Specifying pre-define variable in runtime**
```bash
./node_modules/.bin/autokin -e -v ./features/data/uat.variables.json
```
  
## Autokin Generators
In some cases we want to include auto generated data as part of the API request, some of these are emails, ids, names, and maybe passwords. With Autokin Generators, this can be done as well with minimal syntax to understand.

**Generate Email Addresses**
```gherkin
    Scenario: Login to the system
        Given that a secure endpoint is up at {host}
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "{generate:email(gmail.com)}",
            "password": "p3dr0"
        }
        """
        When I POST /login
```

**Generate Passwords**
```gherkin
    Scenario: Login to the system
        Given that a secure endpoint is up at {host}
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "me@gmail.com",
            "password": "{generate:any(8,numbers,uppercase,lowercase)}"
        }
        """
        When I POST /login
```
This will generate password with length of 8 characters that can be either `numbers`, `uppercase` letters, or `lowercase` letters. If you want `symbols` just add it from the list.

**Generate Names**
```gherkin
    Scenario: Create Customer to the system
        Given that a secure endpoint is up at {host}
        Given I set Content-Type header to application/json
        Given I set the JSON body to 
        """
        {
            "username": "{generate:emails(gmail.com)}",
            "password": "{generate:any(8,numbers,uppercase,lowercase)}",
            "firstname": "{generate:firstname(male)}",
            "lastname": "{generate:lastname}"
        }
        """
        When I POST /create
```
### Autokin Generators
| Generator  | Description  |
|---|---|
| `{generate:email(domain)}`    | Generate random emails, with specified domain name. If not supplied it will have `autokinjs.com` as email domain.   |
| `{generate:firstname()}`    | Generate firstname base on existing name list, it can be either male or female.    |
| `{generate:firstname(male)}`    | Generate male firstname.    |
| `{generate:firstname(female)}`    | Generate female firstname.    |
| `{generate:lastname}`    | Generate lastname base on existing list.    |
| `{generate:uuid}`    | Generate UUID v4.    |
| `{generate:any(length, ...options )}`    | Generate random characters based on length and options. <br /><br />Options can be `numbers`, `lowercase`, `uppercase`, or `symbols`.  <br /><br />To generate only symbols: `{generate:any(10,symbols)}`. <br /><br />If you want both `numbers` and `symbols`: `{generate:any(10,numbers,symbols)}`    |

See more [examples](docs/examples).

## Autokin Gherkin Steps
There are several steps that we can use to combine different test, expectations, and behaviour that is needed in our test. Here are the list of steps:

### Given
| Step  | Description  |
|---|---|
| Given that a secure endpoint is up at {domain}    | Secured Endpoint Domain (https)   |
| Given that a endpoint is up at {domain}           | HTTP only Endpoint Domain         |
| Given I set {name} header to {value}              | Add headers  |
| Given I set {name} header from {stored value name} | Add header with value from stored value  |
| Given I set headers to                            | Add multiple headers |
| Given I set query parameters to                   | Add query parameters |
| Given I set query parameter {name} to {value}     | Add query parameter |
| Given I set query parameter {name} from {stored value name}     | Add query parameter from the stored value |
| Given I set the JSON body to                      | Set the body of the request |
| Given I set the cookie to {cookie value pair}     | Add cookie value |
| Given I set the cookie {name} to {value}  | Add cookie value |
| Given I set the cookie {name} from {stored value name}  | Add cookie with value from stored value |
| Given I have basic authentication credentials {username} and {password} | Set basic authentication |
| Given I set the bearer token to {token} | Sets bearer token |
| Given I set the bearer token with {stored value name} | Sets bearer token with stored value |

### When
| Step  | Description  |
|---|---|
| When I GET {uri} | Do a GET request |
| When I POST to {uri} | Do a POST request |
| When I PUT to {uri} | Do a PUT request |
| When I perform DELETE to {uri} | Do a DELETE request |
| When I PATCH to {uri} | Do a PATCH request |

### Then
| Step  | Description  |
|---|---|
| Then response status code should be {expected status code} |  Assert for response status code |
| Then response status code should not be {expected status code} | Assert that response status code must not be equat to the expected |
| Then response header {name} should exist | Assert if header exist from response |
| Then response header {name} should not exist | Assert that header must not exist from response |
| Then response header {name} should be {expected value}| Assert that the header from response must have the value expected |
| Then response header {name} should not be {expected value} | Assert that the header must not have the value expected |
| Then response body should be valid json | Assert that response should have a JSON body |
| Then response body should be json data of | Assert if the expected JSON data is the same with the response body |
| Then I expect that path {path} from body has value of {expected value}|  Assert JSON body if the path specified has the expected value |
| Then response body should have path {path} | Assert if path exist from JSON body |
| Then response time is not greater than {response time}ms | Assert if response time is not greater than expected |
| Then response time is greater than {response time}ms | Assert if response time is greater than expected |
| Then I keep the value of body path {path} as {storage name}| Store the value of the path as the specified storage name |
| Then I keep the value of header {name} as {storage name} |  Store the value of the header as the specified storage name |
| Then I expect that the stored value in {storage name} is {expected value}|  Assert if the stored name has the expected value |
| Then I expect response data schema complies to {schema path} |  Assert if the response JSON body complies to JSON schema file |

For complete examples, [see docs ](docs).

