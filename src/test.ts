import {
  Editor,
  EditorPosition,
  parseYaml,
  stringifyYaml,
  MarkdownView,
  moment,
} from 'obsidian';

export function test (editor: Editor, view: MarkdownView) {
  console.log(editor.getLine(editor.getCursor().line));
}