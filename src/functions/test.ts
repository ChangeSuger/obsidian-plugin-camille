import {
  Editor,
  MarkdownView,
} from 'obsidian';

export function test (editor: Editor, view: MarkdownView) {
  console.log(
    editor.getCursor("anchor"),
    editor.getCursor("head"),
    editor.getCursor("from"),
    editor.getCursor("to"),
    editor.getCursor()
  );
}