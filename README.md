# Dispatch

A tool for REST API design, and for request testing and management. This is a tool similar to Postman, Insomnia and Paw, but better geared towards developers. It supports templates for request bodies and these templates can be used as building blocks in the requests. It will include a strong Git/GitHub integration making it easy for teams to share the Dispatch projects.


## Status

Dispatch is under development at the monent and is not ready for real use yet.

### TODO

* Application menu
  - Open...
  - keyboard shortcuts
  - automatic saving
  - saving when opening a new project or closing the current project
  - name editing does not work properly in the body editor
  

* Context management
* Env management
* OK: Add Context (a container for templates)
* Add Environments (a container for env variables)

* Body JSON view to show request JSON which has references to the objects and variables defined in the context.
  * CTRL+SPACE opens a context picker which fills in the reference in format `{{ctx.foo.bar}}`
  * Context references can be shown with a special icon (later).
  * All variables that come from the context references are shown in the body UI, with the possibility to fill values. The values can be also supplied by the defaul tcontext. The UI should thus show a table with columns: `variable` | `value-from-context` | `override`. The value could be a large JSON object, like a Kafka topic schema.


### LATER

* Mojave dark mode for the native dialogs

This is a React & Electron app.
