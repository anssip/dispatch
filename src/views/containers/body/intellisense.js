import CodeMirror from "codemirror";

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

CodeMirror.defineOption("intellisense", null, (cm, options) => {
  if (!options) return;
  const { context, environment } = options;
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
    console.log("showHints", typeof context, environment);
    const cursor = cm.getCursor();
    const history = cm.getRange(
      CodeMirror.Pos(cursor.line, cursor.ch - 80),
      cursor
    );

    const inVariable = history.match(AFTER_VARIABLE_MATCH);
    const inTag = history.match(AFTER_TAG_MATCH);
    const isOut = !inVariable && !inTag;
    const allowMatchingVariables = isOut || inVariable;
    const allowMatchingTags = isOut || inTag;

    // Define fallback segment to match everything or nothing
    const fallbackSegment = options.showAllOnNoMatch
      ? ""
      : "__will_not_match_anything__";

    // See if we're completing a variable name
    const nameMatch = history.match(NAME_MATCH);
    const nameMatchLong = history.match(NAME_MATCH_FLEXIBLE);
    const nameSegment = nameMatch ? nameMatch[0] : fallbackSegment;
    const nameSegmentLong = nameMatchLong ? nameMatchLong[0] : fallbackSegment;
    const nameSegmentFull = history;

    const hint = (cm, self, data) => {
      return {
        list: [...Object.keys(environment), Object.keys(context)],
        from: CodeMirror.Pos(cursor.line, cursor.ch),
        // from: CodeMirror.Pos(cur.line, cur.ch - prefix.length),
        to: CodeMirror.Pos(cursor.line, cursor.ch)
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

      // Good for debugging
      // ,closeOnUnfocus: false
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

  // Clear timeout if we already closed the completion
  cm.on("endCompletion", () => {
    // clearTimeout(keydownDebounce);
  });

  // Remove keymap if we're already added it
  cm.removeKeyMap("autocomplete-keymap");

  // Add keymap
  cm.addKeyMap({
    name: "autocomplete-keymap",
    "Ctrl-Space": showHints
  });
});
