import {
  Editor,
} from 'obsidian';

type EditFunctionByLine = (editor: Editor, line: number) => void;

export function editSection (
  editor: Editor,
  editFunction: EditFunctionByLine
) {
  const [from, to] = [editor.getCursor("from"), editor.getCursor("to")];
  const [fromLine, toLine] = [editor.getLine(from.line), editor.getLine(to.line)];
  for (let line = from.line; line <= to.line; line++) {
    editFunction(editor, line);
  }
  const [newFromLine, newToLine] = [editor.getLine(from.line), editor.getLine(to.line)];
  editor.setSelection(
    {
      ...from,
      ch: from.ch + (newFromLine.length - fromLine.length)
    }, {
      ...to,
      ch: to.ch + (newToLine.length - toLine.length)
    }
  );
}