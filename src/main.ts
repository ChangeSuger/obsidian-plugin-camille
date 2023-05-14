import { Editor, MarkdownView, Plugin } from 'obsidian';
import { updateFrontMatter } from './yamlFrontMatter';
import { CamillePluginSettings, CamilleSettingTab, DEFAULT_SETTINGS } from './settings';

import { test } from './test';

export default class CamillePlugin extends Plugin {
	settings: CamillePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'front-matter-update',
			name: 'Update Front-matter',
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

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
