import {
	Editor,
	EditorSuggest,
	EditorPosition,
	EditorSuggestTriggerInfo,
	TFile,
	EditorSuggestContext,
} from 'obsidian';

import CamillePlugin from '../main';

const codeLanguageList: string[] = [
  "bash",
  "c",
  "csharp",
  "css",
  "dockerfile",
  "go",
  "html",
  "java",
  "javascript",
  "json",
  "matlab",
  "node",
  "php",
  "plain",
  "powershell",
  "python",
  "react",
  "ruby",
  "scss",
  "shell",
  "sql",
  "text",
  "typescript",
  "vue",
  "xml",
  "yaml",
];

export class CodeLanguageSuggest extends EditorSuggest<string> {
	plugins: CamillePlugin;
	codeLanguageList: string[];

	constructor (plugins: CamillePlugin) {
		super(plugins.app);
		this.plugins = plugins;
		this.codeLanguageList = codeLanguageList;
	}

	onTrigger(cursor: EditorPosition, editor: Editor, _: TFile | null): EditorSuggestTriggerInfo | null {
		const line = editor.getLine(cursor.line);
		const match = line.match(/```(.*)/)?.first();
		const matchNextLine = editor.getLine(cursor.line + 1).match(/```(.*)/)?.first();
		if (match && matchNextLine) {
			return {
				start: {
					ch: line.lastIndexOf(match),
					line: cursor.line,
				},
				end: cursor,
				query: match,
			};
		}
		return null;
	}

	getSuggestions (context: EditorSuggestContext): string[] {
		const codeLanguageQuery = context.query
			.replace(/```/, '')
			.toLowerCase();
		return this.codeLanguageList
			.filter(codeLanguage => includeSearchText(codeLanguageQuery, codeLanguage));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		const suggestions = el.createDiv({ cls: "code-language-suggest-container" });
		suggestions
			.createDiv({ cls: "code-language-suggest-item" })
			.setText(value);
	}

	selectSuggestion(value: string): void {
		if (this.context) {
			this.context.editor.replaceRange(
				`\`\`\`${value} \n`,
				this.context.start,
				this.context.end
			);
		}
	}
}

function includeSearchText (searchText: string, text: string): boolean {
	let _text = text;
	const chars = searchText.split('');
	for (const char of chars) {
		const index = _text.indexOf(char);
		if (index === -1) {
			return false;
		} else {
			_text = _text.slice(_text.indexOf(char) + 1);
		}
	}
	return true;
}