# Example: GET with JSON Body Response

**Request**
```HTTP
https://reqres.in/api/users/2
```

**Response**
```HTTP
HTTP/2 200
date: Tue, 5 Jul 2018 08:40:03 GMT
content-type: application/json; charset=utf-8
content-length: 137
set-cookie: __cfduid=d63941c1587a94e5fd3c318b30889222d1547541603; expires=Wed, 15-Jan-20 08:40:03 GMT; path=/; domain=.reqres.in; HttpOnly
x-powered-by: Express
access-control-allow-origin: *
etag: W/"89-bSBFK27ZbQL+K8fMuJn/jZrcUuk"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
server: cloudflare
cf-ray: 4997090c9c8bc379-SIN

{"data":{"id":2,"first_name":"Janet","last_name":"Weaver","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"}}
```

### Check if response has valid JSON body
```
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        When I GET /api/users/2
        Then response body should be valid json
```

### Check if response has 200 status code
```
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        When I GET /api/users/2
        Then response status code should be 200
```

### Check if response has 200 status code and valid JSON body
```
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        When I GET /api/users/2
        Then response status code should be 200
        Then response body should be valid json
```

### Check if body has id of 2
```
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        When I GET /api/users/2
        Then I expect that path "$.data.id" from body has value of 2
```

