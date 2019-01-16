[![Build Status](https://travis-ci.org/ariesb/autokin.svg?branch=master)](https://travis-ci.org/ariesb/autokin) [![Coverage Status](https://coveralls.io/repos/github/ariesb/autokin/badge.svg?branch=master)](https://coveralls.io/github/ariesb/autokin?branch=master)

# Autokin (Automation by Gherkin)

This is a simple package/library that helps tester to do automation of REST/API using Gherkin without knowing JavaScript coding. 

All you need to know is Gherkin and you can start working and creating automated test for contract testing, or simple API test.

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
      |         ├── support.js
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
.

1 scenario (1 passed)
0 steps
0m00.001s
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
...

1 scenario (1 passed)
2 steps (2 passed)
0m03.274s
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
...F

Failures:

1) Scenario: My First Scenario # features/first.feature:6
   ✔ Before # node_modules/autokin/lib/autokin-rest-steps.js:15
   ✔ Given that a secure endpoint is up at reqres.in # node_modules/autokin/lib/autokin-rest-steps.js:27
   ✔ When I GET /api/users/2 # node_modules/autokin/lib/autokin-rest-steps.js:79
   ✖ Then response status code should be 400 # node_modules/autokin/lib/autokin-rest-steps.js:124
       AssertionError
           + expected - actual

           -200
           +400

           at World.<anonymous> (lib/autokin-rest-steps.js:125:48)

1 scenario (1 failed)
3 steps (1 failed, 2 passed)
0m01.008s
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
....

1 scenario (1 passed)
3 steps (3 passed)
0m01.017s
```

## Autokin Gherkin Steps
There are several steps that we can use to combine different test, expectations, and behaviour that is needed in our test. Here are the list of steps:

### Given
| Step  | Description  |
|---|---|
| Given that a secure endpoint is up at {domain}    | Secured Endpoint Domain (https)   |
| Given that a endpoint is up at {domain}           | HTTP only Endpoint Domain         |
| Given I set {name} header to {value}              | Add headers  |
| Given I set headers to                            | Add multiple headers |
| Given I set query parameters to                   | Add query parameters |
| Given I set the JSON body to                      | Set the body of the request |
| Given I set the cookie to {cookie value pair}     | Add cookie value |
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
| Then I keep the value of body path {path} as {storage name}| Store the value of the path as the specified storage name |
| Then I keep the value of header {name} as {storage name} |  Store the value of the header as the specified storage name |
| Then I expect that the stored value in {storage name} is {expected value}|  Assert if the stored name has the expected value |

For complete examples, [see docs ](docs).

