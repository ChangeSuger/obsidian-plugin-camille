import { Editor, EditorPosition, parseYaml, stringifyYaml, MarkdownFileInfo } from "obsidian";

import { getLocalDate } from "./util";

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

// init yaml for markdown
export function initYaml (editor: Editor, ctx: MarkdownFileInfo) {
  const yamlSection = getYaml(editor);
  const file = ctx.file;
  const objectYaml = {
    ...getObjectYaml(editor),
    title: file?.basename,
    date: getLocalDate(file?.stat.ctime),
    updated: getLocalDate()
  }

  const replacement = yamlSection ? `---\n${stringifyYaml(objectYaml)}---` : `---\n${stringifyYaml(objectYaml)}---\n`;
  const startPosition: EditorPosition = {line: 0, ch: 0};
  const endPosition: EditorPosition = yamlSection ? editor.offsetToPos(yamlSection.length) : startPosition;
  editor.replaceRange(replacement, startPosition, endPosition);
}

// Update updated in yaml format
export function updatedTime (editor: Editor) {
  const yamlSection = getYaml(editor);
  const objectYaml = getObjectYaml(editor);

  objectYaml.updated = getLocalDate();

  const replacement = `---\n${stringifyYaml(objectYaml)}---`;
  const startPosition: EditorPosition = {line: 0, ch: 0};
  const endPosition: EditorPosition = editor.offsetToPos(yamlSection.length);

  editor.replaceRange(replacement, startPosition, endPosition);
}
