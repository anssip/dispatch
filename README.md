# gasbag
A very talkative REST automation and testing tool for developers


## TODO:

* Introduce (Overstated)[https://github.com/fabiospampinato/overstated] for requests and templates.

* Body JSON view to show request JSON which has references to the objects and variables defined in the context.
  * CTRL+SPACE opens a context picker which fills in the reference in format `{{foo.bar}}`
  * Context references can be shown with a special icon (later).
  * All variables that come from the context references are shown in the body UI, with the possibility to fill values. The values can be also supplied by the defaul tcontext. The UI should thus show a table with columns: `variable` | `value-from-context` | `override`
  
* Code editor with json-templater token highlighting
