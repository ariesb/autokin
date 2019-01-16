# Example: GET with 404 Not Found Response

**Request**
```HTTP
https://reqres.in/api/users/301
```

**Response**
```HTTP
HTTP/2 404
date: Tue, 15 Feb 2018 09:00:12 GMT
content-type: application/json; charset=utf-8
content-length: 2
set-cookie: __cfduid=d50c03ab804ef7093fe8a5068865396d51547542812; expires=Wed, 15-Jan-20 09:00:12 GMT; path=/; domain=.reqres.in; HttpOnly
x-powered-by: Express
access-control-allow-origin: *
etag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
server: cloudflare
cf-ray: 499726924a4d3349-HKG

{}
```

### Check if response has 404 status code
```
Feature: HTTP Bin REST Service
    As Autokin developer
    I want to verify that all API are working as they should

    Scenario: Getting user information 
        Given that a secure endpoint is up at reqres.in
        When I GET /api/users/301
        Then response status code should be 404
```
