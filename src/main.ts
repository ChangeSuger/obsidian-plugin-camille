import {
	Editor,
	MarkdownView,
	Plugin,
	EditorSuggest,
	EditorPosition,
	EditorSuggestTriggerInfo,
	TFile,
	EditorSuggestContext,
} from 'obsidian';
import {
	CamillePluginSettings,
	CamilleSettingTab,
	DEFAULT_SETTINGS,
} from './settings';
import { updateFrontMatter } from './functions/yamlFrontMatter';
import { toggleCheckboxByLine } from './functions/toggleCheckbox';
import { clearLinkByLine } from './functions/clearLink';
import { editSection } from './functions/util';
import { copyLineUpOrDown } from './functions/vscodeShortcuts';
import { test } from './functions/test';

import { codeLanguageList } from './codeLanguageList';

export default class CamillePlugin extends Plugin {
	settings: CamillePluginSettings;

	async onload () {
		await this.loadSettings();
		this.registerEditorSuggest(new CodeLanguageSuggest(this));

		this.addCommand({
			id: 'yaml-front-matter-update',
			name: '更新 YAML Front-matter',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				updateFrontMatter(editor, view, this.settings.yamlFrontmatter);
			},
		});

		this.addCommand({
			id: 'toggle-checkbox',
			name: "Toggle Checkbox",
			editorCallback: (editor: Editor) => {
				editSection(editor, toggleCheckboxByLine);
			},
		});

		this.addCommand({
			id: 'clear-link',
			name: "Clear Link",
			editorCallback: (editor: Editor) => {
				editSection(editor, clearLinkByLine);
			}
		});

		this.addCommand({
			id: 'copy-line-up',
			name: "Copy Line up",
			editorCallback: (editor: Editor) => {
				copyLineUpOrDown(editor, 'up');
			}
		});

		this.addCommand({
			id: 'copy-line-down',
			name: "Copy Line Down",
			editorCallback: (editor: Editor) => {
				copyLineUpOrDown(editor, "down");
			}
		});

		this.addCommand({
			id: 'test',
			name: 'test',
			editorCallback: test,
		});

		this.addSettingTab(new CamilleSettingTab(this.app, this));
	}

	onunload () {

	}

	async loadSettings () {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings () {
		await this.saveData(this.settings);
	}
}

class CodeLanguageSuggest extends EditorSuggest<string> {
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
		if (match) {
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
			.filter(codeLanguage => codeLanguage.includes(codeLanguageQuery));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		const suggestions = el.createDiv({ cls: "code-language-suggester-container" });
		suggestions
			.createDiv({ cls: "code-language-suggester-item" })
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