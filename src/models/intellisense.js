import CodeMirror from "codemirror";
import RequestBuilder from "./RequestBuilder";
const NAME_MATCH = /[\w.\][]+$/;
const R = require("ramda");

const pos = CodeMirror.Pos;

export function getCompletions(type, history, objectWithCompleteValues) {
  const nameMatch = history.match(NAME_MATCH);
  // const nameMatchLong = history.match(NAME_MATCH_FLEXIBLE);
  const matchedName = nameMatch && nameMatch[0];

  const allKeys = collectKeys(objectWithCompleteValues);
  const matchedKeys = matchedName
    ? R.filter(k => k.includes(matchedName), allKeys)
    : allKeys;

  const valueFor = path => {
    const parts = path.split(".");
    return parts.reduce((acc, key) => acc[key], objectWithCompleteValues);
  };

  return matchedKeys.map(k => ({
    type,
    matchedName,
    fillValue: valueFor(k),
    text: k,
    displayText: k,
    render: renderHint,
    hint
  }));
}

function renderHint(element, self, data) {
  const fillValue = data.fillValue
    ? typeof data.fillValue === "string"
      ? data.fillValue
      : JSON.stringify(data.fillValue)
    : "";

  // TODO: render differently based on data.type: "env" or "context"
  const hintClass = data.type === "env" ? "dp-hint-env" : "dp-hint-ctx";
  element.innerHTML = `<em class="${hintClass}">${
    data.text
  }</em> <em class="dp-hint-value">${fillValue.substring(0, 20)}</em>`;
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
        list: [
          ...getCompletions("env", history, environment),
          ...getCompletions("context", history, context)
        ],
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
