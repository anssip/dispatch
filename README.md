# Dispatch

A tool for REST API design, and for request testing and management. This is a tool similar to Postman, Insomnia and Paw, but better geared towards developers. It supports templates for request bodies and these templates can be used as building blocks in the requests. It will include a strong Git/GitHub integration making it easy for teams to share the Dispatch projects.

## Status

Dispatch is under development at the monent and is not ready for real use yet.

![Screenshot](https://i.imgur.com/7AHNyCT.png)

## TODO

next:

- use auth in the CURL preview
- copy button for the curl preview
- automatic setting of content-type: application/json when JSON body used
- Request sending
- Ordering of requests in the sidebar list

### OAuth2Form

- Logging to the output pane when fetching OAuth2 tokens!!

- refactor this to be tied to the selected auth method

In OAuth 2.0, the term “grant type” refers to the way an application gets an access token.

### Authorization code flow

[What is the OAuth 2.0 Authorization Code Grant Type?](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type)

- Implicit

  - Don't show the refresh_token field nor the Refresh button

    - https://developer.okta.com/blog/2018/05/24/what-is-the-oauth2-implicit-grant-type

  - Resource Owner Password grant

    - fields: Username, password, accessTokenUrl
    - request to the `token` URL
    - https://developer.okta.com/authentication-guide/implementing-authentication/password

  - Client Credentials grant
    - fields: accessTokenUrl
    - clientId / clientSecret sent in basic auth into the `token` URL
    - https://developer.okta.com/authentication-guide/implementing-authentication/client-creds

  * Render request methods (GET, POST, PUT) in different colors

  - Auth: Basic auth, Bearer token, later: OAuth 2
  - request sending
  - non JSON requests?

### working Client Credential request

curl --request POST \
 --url https://dispatch-rest-dev.eu.auth0.com/oauth/token \
 --header 'content-type: application/json' \
 --data '{"client_id":"a9lqkFe4IfYQExWVHo4jBXpiESSXZxYq","client_secret":"Bhoz9vTSSJwKoqvSkXPgY3b2uNSY3NEtQCAgF39cgyd9z3fdQzi7SITlXO4VoOt2","audience":"http","grant_type":"client_credentials"}'
