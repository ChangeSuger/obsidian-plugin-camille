import {
  Editor,
} from 'obsidian';

const CHECKBOX_REGEX = /(?<prefix>^\s*-\s)(?<checkbox>(\[(\s|x)\]\s)?)(?<content>.*)/;

export function toggleCheckboxByLine(editor: Editor, line: number) {
  const lineContent = editor.getLine(line);
  const matchResult = lineContent.match(CHECKBOX_REGEX);

  let replacement: string;

  if (matchResult) {
    if (matchResult.groups?.checkbox) {
      replacement = `${matchResult.groups?.prefix}${matchResult.groups?.content}`;
    } else {
      replacement = `${matchResult.groups?.prefix}[ ] ${matchResult.groups?.content}`;
    }
  } else {
    replacement = `- [ ] ${lineContent}`;
  }

  editor.replaceRange(replacement, {
    line,
    ch: 0,
  }, {
    line,
    ch: lineContent.length,
  });
}