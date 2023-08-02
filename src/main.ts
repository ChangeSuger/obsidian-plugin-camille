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
import { updateFrontMatter } from './yamlFrontMatter';

import { test } from './test';

const codeTypeList = require('./codeTypeList.json') as string[];

export default class CamillePlugin extends Plugin {
	settings: CamillePluginSettings;

	async onload () {
		await this.loadSettings();
		this.registerEditorSuggest(new CodeTypeSuggest(this));

		this.addCommand({
			id: 'yaml-front-matter-update',
			name: '更新 YAML Front-matter',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				updateFrontMatter(editor, view, this.settings.yamlFrontmatter);
			},
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

class CodeTypeSuggest extends EditorSuggest<string> {
	plugins: CamillePlugin;
	codeTypeList: string[];

	constructor (plugins: CamillePlugin) {
		super(plugins.app);
		this.plugins = plugins;
		this.codeTypeList = codeTypeList;
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
		let codeTypeQuery = context.query
			.replace(/```/, '')
			.toLowerCase();
		return this.codeTypeList
			.filter(codeType => codeType.includes(codeTypeQuery));
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		const suggestions = el.createDiv({ cls: "code-type-suggester-container" });
		suggestions
			.createDiv({ cls: "code-type-suggester-item" })
			.setText(value);
	}

	selectSuggestion(value: string): void {
		if (this.context) {
			this.context.editor.replaceRange(`\`\`\`${value} `, this.context.start, this.context.end);
		}
	}
}