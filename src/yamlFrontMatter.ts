import {
  Editor,
  EditorPosition,
  parseYaml,
  stringifyYaml,
  MarkdownFileInfo,
} from "obsidian";

import { getFullDate } from "./util";

const YAML_REGEX = /^---\n(?:((?:.|\n)*?)\n)?---(?=\n|$)/;

// Get yaml section
function getYaml (editor: Editor): string {
  const matchResult = editor.getValue().match(YAML_REGEX);

  return matchResult?.[0] ?? '';
}

// Get objectify yaml of current file
function getObjectYaml (editor: Editor) {
  const stringYaml = getYaml(editor);

  return stringYaml ? parseYaml(stringYaml.slice(4, -4)) : {};
}

// update yaml Front-matter
export function updateFrontMatter (editor: Editor, ctx: MarkdownFileInfo) {
  const yamlSection = getYaml(editor);
  const file = ctx.file;
  const objectYaml = {
    ...getObjectYaml(editor),
    title: file?.basename,
    date: getFullDate(file?.stat.ctime),
    updated: getFullDate(),
  }

  const replacement = yamlSection
    ? `---\n${stringifyYaml(objectYaml)}---`
    : `---\n${stringifyYaml(objectYaml)}---\n`;

  const startPosition: EditorPosition = {line: 0, ch: 0};
  const endPosition: EditorPosition = yamlSection
    ? editor.offsetToPos(yamlSection.length)
    : startPosition;
  
  editor.replaceRange(replacement, startPosition, endPosition);
}
