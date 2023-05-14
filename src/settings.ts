import CamillePlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface CamillePluginSettings {
  dateFormat: string;
  author: string;
}

export const DEFAULT_SETTINGS: CamillePluginSettings = {
  dateFormat: 'YYYY-MM-DD',
  author: 'Camille@ChangeSuger',
}

export class CamilleSettingTab extends PluginSettingTab {
  plugin: CamillePlugin;

  constructor (app: App, plugin: CamillePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display (): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: '插件设置' });

    new Setting(containerEl)
      .setName('Date format')
      .setDesc('Default date format')
      .addText((text) =>
        text
          .setPlaceholder('YYYY-MM-DD')
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Author')
      .setDesc('Author Name for YAML Front-matter')
      .addText((text) =>
        text
          .setValue(this.plugin.settings.author)
          .onChange(async (value) => {
            this.plugin.settings.author = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
