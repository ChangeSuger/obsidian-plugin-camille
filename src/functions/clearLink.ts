import {
  Editor,
} from 'obsidian';

const LINK_REGEX = /\[(?<content>.*?)\]\(.*?\)/g;

export function clearLinkByLine (editor: Editor, line: number) {
  const lineContent = editor.getLine(line);
  let replacement = lineContent;
  const matchResultArray = [...lineContent.matchAll(LINK_REGEX)];

  matchResultArray.forEach((matchResult) => {
    replacement = replacement.replace(matchResult[0], matchResult[1]);
  });

  editor.replaceRange(replacement, {
    line,
    ch: 0,
  }, {
    line,
    ch: lineContent.length,
  });
}

export function clearWhitespaceByLine (editor: Editor, line: number) {
  const lineContent = editor.getLine(line);
  const replacement = lineContent.replace(/\s/g, '');
  editor.replaceRange(replacement, {
    line,
    ch: 0,
  }, {
    line,
    ch: lineContent.length,
  });
}