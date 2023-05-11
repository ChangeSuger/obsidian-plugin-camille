import { Plugin } from 'obsidian';
import { updateFrontMatter } from './yamlFrontMatter';

interface CamillePluginSettings {

}

const DEFAULT_SETTINGS: CamillePluginSettings = {

}

export default class CamillePlugin extends Plugin {
	settings: CamillePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'front-matter-update',
			name: 'Update Front-matter',
			editorCallback: updateFrontMatter,
		});
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
