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
import { updateFrontMatter } from './yamlFrontMatter';

import { test } from './test';

export default class CamillePlugin extends Plugin {
	settings: CamillePluginSettings;

	async onload () {
		await this.loadSettings();

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
