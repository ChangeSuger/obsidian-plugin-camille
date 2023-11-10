import {
	Editor,
	MarkdownView,
	Plugin,
} from 'obsidian';
import {
	CamillePluginSettings,
	CamilleSettingTab,
	DEFAULT_SETTINGS,
} from './settings';

import { CodeLanguageSuggest } from './functions/codeLanguageSuggest';

import { updateFrontMatter } from './functions/yamlFrontMatter';
import { toggleCheckboxByLine } from './functions/toggleCheckbox';
import { clearLinkByLine } from './functions/clearLink';
import { editSection } from './functions/util';
import { copyLineUpOrDown } from './functions/vscodeShortcuts';
import { test } from './functions/test';

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

	onunload () {}

	async loadSettings () {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings () {
		await this.saveData(this.settings);
	}
}
