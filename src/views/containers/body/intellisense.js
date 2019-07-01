import CodeMirror from "codemirror";

CodeMirror.defineOption("intellisense", null, (cm, options) => {
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

function hint(cm, self, data) {
  const cur = cm.getCursor();
  return {
    list: ["completion", "is here", "to stay"],
    from: CodeMirror.Pos(cur.line, cur.ch),
    // from: CodeMirror.Pos(cur.line, cur.ch - prefix.length),
    to: CodeMirror.Pos(cur.line, cur.ch)
  };
}
