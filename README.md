# Dispatch

A tool for REST API design, and for request testing and management. This is a tool similar to Postman, Insomnia and Paw, but better geared towards developers. It supports templates for request bodies and these templates can be used as building blocks in the requests. It will include a strong Git/GitHub integration making it easy for teams to share the Dispatch projects.

## Status

Dispatch is under development at the monent and is not ready for real use yet.

![Screenshot](https://i.imgur.com/7AHNyCT.png)

## TODO

next:

- Sidebar.js to connect to the AuthContainer. Renders a SidebarList with render props for each rendered list item: list item is either a Request or an AuthMethod.
  - Sidebar passes selection etc. functions down to SidebarList
- Selecting an auth method from the list renders OAuth2Form (to be renamed and refactored to AuthForm)

### OAuth2Form

- refactor this to be tied to the selected auth method

In OAuth 2.0, the term “grant type” refers to the way an application gets an access token.

### Authorization code flow

[What is the OAuth 2.0 Authorization Code Grant Type?](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type)

- Clean up oauth2.js
- Store the OAuth token info to req.auth and persist
- Bind the form fields with oauth2.js

* Auth: Basic auth, Bearer token, later: OAuth 2
* request sending
* non JSON requests?

# Auth data model

```
project:
    - AuthContainer
      - methods[]
        - methd: type, [attributes], tokens
    - requests:
      - request
        - auth method index
```
