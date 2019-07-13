import CodeMirror from "codemirror";
import RequestBuilder from "./RequestBuilder";
const NAME_MATCH_FLEXIBLE = /[\w.\][\-/]+$/;
const NAME_MATCH = /[\w.\][]+$/;
const AFTER_VARIABLE_MATCH = /{{\s*[\w.\][]*$/;
const AFTER_TAG_MATCH = /{%\s*[\w.\][]*$/;
const COMPLETE_AFTER_WORD = /[\w.\][-]+/;
const COMPLETE_AFTER_CURLIES = /[^{]*{[{%]\s*/;
const COMPLETION_CLOSE_KEYS = /[}|-]/;
const TYPE_VARIABLE = "variable";
const TYPE_TAG = "tag";
const TYPE_CONSTANT = "constant";
const MAX_CONSTANTS = -1;
const MAX_VARIABLES = -1;
const MAX_TAGS = -1;
const R = require("ramda");

const pos = CodeMirror.Pos;

export function getCompletions(history, context, environment) {
  const nameMatch = history.match(NAME_MATCH);
  // const nameMatchLong = history.match(NAME_MATCH_FLEXIBLE);
  const matchedName = nameMatch && nameMatch[0];

  const allKeys = [...collectKeys(environment), ...collectKeys(context)];
  const matchedKeys = matchedName
    ? R.filter(k => k.includes(matchedName), allKeys)
    : allKeys;

  return matchedKeys.map(k => ({
    matchedName,

    text: k,
    displayText: k,
    render: renderHint,
    hint
  }));
}

function renderHint(element, self, data) {
  element.innerHTML = `<b>${data.text}</b>`;
}

function hint(cm, self, data) {
  const cursor = cm.getCursor();
  const from = pos(
    cursor.line,
    cursor.ch - (data.matchedName ? data.matchedName.length : 0)
  );

  const previousChars = cm.getRange(pos(from.line, from.ch - 10), from);
  const prefix = previousChars.match(/{{[^}]*$/) ? "" : "{{ ";

  const to = pos(cursor.line, cursor.ch);
  const nextChars = cm.getRange(to, pos(to.line, to.ch + 10));
  const suffix = nextChars.match(/^\s*}}/) ? "" : " }}";

  cm.replaceRange(`${prefix}${data.text}${suffix}`, from, to);
}

export function collectKeys(obj, parent = "") {
  const combine = (parent, child) =>
    parent !== "" ? `${parent}.${child}` : child;
  return R.flatten(
    Object.keys(obj).map(k => {
      const val = obj[k];
      return typeof val == "object"
        ? [k, ...collectKeys(val, combine(parent, k))]
        : combine(parent, k);
    })
  );
}

CodeMirror.defineOption("intellisense", null, (cm, options) => {
  if (!options) return;
  const requestBuilder = new RequestBuilder();
  const context = options.context && requestBuilder.evalObject(options.context);
  const environment = options.environment;
  let keydownTimeout;

  function getHintsContainer() {
    const elem = document.querySelector("#hints-container");
    if (elem) return elem;
    const container = document.createElement("div");
    container.id = "hints-container";
    container.className = "theme--dropdown__menu";
    document.body.appendChild(container);
    return container;
  }

  function showHints() {
    console.log("showHints", context, environment);
    const cursor = cm.getCursor();
    const history = cm.getRange(pos(cursor.line, cursor.ch - 80), cursor);

    const hint = (cm, self, data) => {
      return {
        list: getCompletions(history, context, environment),
        from: pos(cursor.line, cursor.ch),
        // from: pos(cur.line, cur.ch - prefix.length),
        to: pos(cursor.line, cursor.ch)
      };
    };

    cm.showHint({
      hint,
      container: getHintsContainer(),
      closeCharacters: /[}|-]/,
      completeSingle: false,
      extraKeys: {
        Tab: (cm, widget) => {
          // Override default behavior and don't select hint on Tab
          widget.close();
          return CodeMirror.Pass;
        }
      }
    });
  }

  cm.on("keydown", async (cm, e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length > 1) {
      return;
    }
    if (keydownTimeout) {
      clearTimeout(keydownTimeout);
    }
    keydownTimeout = setTimeout(() => {
      showHints();
    }, 1000);
  });

  cm.on("endCompletion", () => {
    // clearTimeout(keydownDebounce);
  });

  cm.removeKeyMap("autocomplete-keymap");

  // Add keymap
  cm.addKeyMap({
    name: "autocomplete-keymap",
    "Ctrl-Space": showHints
  });
});
