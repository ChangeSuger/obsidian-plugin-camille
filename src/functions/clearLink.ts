import {
  Editor,
} from 'obsidian';

const LINK_REGEX = /\[(?<content>.*?)\]\(.*?\)/g;

export function clearLinkByLine (editor: Editor, line: number) {
  const lineContent = editor.getLine(line);
  let remplacement = lineContent;
  const matchResultArray = [...lineContent.matchAll(LINK_REGEX)];

  matchResultArray.forEach((matchResult) => {
    remplacement = remplacement.replace(matchResult[0], matchResult[1]);
  });

  editor.replaceRange(remplacement, {
    line,
    ch: 0,
  }, {
    line,
    ch: lineContent.length,
  });
}