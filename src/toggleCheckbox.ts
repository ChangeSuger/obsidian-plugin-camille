import {
  Editor,
} from 'obsidian';

const CHECKBOX_REGEX = /(?<prefix>^\s*-\s)(?<checkbox>(\[(\s|x)\]\s)?)(?<content>.*)/;

export function toggleCheckboxs (editor: Editor) {
  const [from, to] = [editor.getCursor("from"), editor.getCursor("to")];
  for (let line = from.line; line <= to.line; line++) {
    toggleCheckboxByLine(editor, line);
  }
  editor.setSelection(from, to);
}

function toggleCheckboxByLine(editor: Editor, cursorLine: number) {
  const line = editor.getLine(cursorLine);
  const matchResult = line.match(CHECKBOX_REGEX);

  let replacement: string;

  if (matchResult) {
    if (matchResult.groups?.checkbox) {
      replacement = `${matchResult.groups?.prefix}${matchResult.groups?.content}`;
    } else {
      replacement = `${matchResult.groups?.prefix}[ ] ${matchResult.groups?.content}`;
    }
  } else {
    replacement = `- [ ] ${line}`;
  }

  editor.replaceRange(replacement, {
    line: cursorLine,
    ch: 0,
  }, {
    line: cursorLine,
    ch: line.length,
  });
}