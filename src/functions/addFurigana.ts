import {
  App,
  Editor,
  Modal,
  Setting,
} from 'obsidian';

class FuriganaModal extends Modal {
  text: string;
  furigana: string;

  constructor(app: App, text: string, furigana: string, onSubmit: (text: string, furigana: string) => void) {
    super(app);
    this.text = text;
    this.furigana = furigana;

    // @ts-ignore
    this.setTitle('add/edit furigana');

    new Setting(this.contentEl)
      .setName('文本')
      .addText((text) => {
        text.setValue(this.text);
        text.onChange(value => {
          this.text = value;
        });
      });

    new Setting(this.contentEl)
      .setName('注音')
      .addText((text) => {
        text.setValue(this.furigana);
        text.onChange(value => {
          this.furigana = value;
        });
      });

    new Setting(this.contentEl)
      .addButton((button) => {
        button
          .setButtonText('确定')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(this.text, this.furigana);
          });
      });
  }
}

const FURIGANA_REGEX = /^<ruby>(?<text>.*?)<rt>(?<furigana>.*?)<\/rt><\/ruby>$/g;

export function addFurigana(editor: Editor, app: App) {
  const origin = editor.getSelection();
  const [from, to] = [editor.getCursor("from"), editor.getCursor("to")];

  function onSubmit(text: string, furigana: string) {
    const replacement = `<ruby>${text}<rt>${furigana}</rt></ruby>`;
    editor.replaceRange(replacement, from, to);
  }

  const matchResult = origin.match(FURIGANA_REGEX);
  if (matchResult) {
    const matchResultArray = [...origin.matchAll(FURIGANA_REGEX)];
    const lastMatchResult = matchResultArray[matchResultArray.length - 1];
    const text = lastMatchResult.groups?.text || '';
    const furigana = lastMatchResult.groups?.furigana || '';

    new FuriganaModal(app, text, furigana, onSubmit).open();
  } else {
    new FuriganaModal(app, origin, '', onSubmit).open();
  }
}