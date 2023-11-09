import { Editor, EditorPosition } from 'obsidian';

// Copy line up/down
export function copyLineUpOrDown (editor: Editor, direction: 'up' | 'down') {
  const [from, to] = [editor.getCursor("from"), editor.getCursor("to")];
  const lineCount = to.line - from.line + 1;
  const firstPosition: EditorPosition = { line: from.line, ch: 0 };
  const lastPosition: EditorPosition = { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length };

  const content = editor.getRange(
    firstPosition,
    { line: to.line, ch: editor.getLine(to.line).length }
  );
  const contentNext = editor.getRange(
    firstPosition,
    lastPosition
  );
  const replace = content + '\n' + contentNext;

  editor.replaceRange(replace, firstPosition, lastPosition);

  editor.setSelection(
    {
      ...from,
      line: from.line + (direction === 'up' ? 0 : lineCount)
    },
    {
      ...to,
      line: to.line + (direction === 'up' ? 0 : lineCount)
    }
  );
}
