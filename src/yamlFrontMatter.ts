import {
  Editor,
  EditorPosition,
  parseYaml,
  stringifyYaml,
  MarkdownView,
  moment,
} from 'obsidian';

import { yamlFrontmatterSettings } from './settings';

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

// Replace yaml Frontmatter of current file
function replaceYamlFrontMatter (editor: Editor, yamlSection: string, objectYaml: any) {
  const replacement = yamlSection
    ? `---\n${stringifyYaml(objectYaml)}---`
    : `---\n${stringifyYaml(objectYaml)}---\n`;

  const startPosition: EditorPosition = {line: 0, ch: 0};
  const endPosition: EditorPosition = yamlSection
    ? editor.offsetToPos(yamlSection.length)
    : startPosition;

  editor.replaceRange(replacement, startPosition, endPosition);
}

// update yaml Front-matter
export function updateFrontMatter (editor: Editor, view: MarkdownView, settings: yamlFrontmatterSettings) {
  const yamlSection = getYaml(editor);
  const file = view.file;
  const objectYaml = {
    ...getObjectYaml(editor),
    title: file?.basename,
  }

  objectYaml.date = settings.date.add
    ? moment(file?.stat.ctime).format(settings.date.dateFormat)
    : undefined;
  objectYaml.updated = settings.updated.add
    ? moment().format(settings.updated.dateFormat)
    : undefined;
  objectYaml.author = settings.author.add ? settings.author.name : undefined;

  replaceYamlFrontMatter(editor, yamlSection, objectYaml);
}
