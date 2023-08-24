import CamillePlugin from './main';
import {
  App,
  DropdownComponent,
  PluginSettingTab,
  Setting,
  TextComponent,
  ToggleComponent
} from 'obsidian';

export type yamlFrontmatterSettings = {
  date: {
    add: boolean;
    dateFormat: string;
  };
  updated: {
    add: boolean;
    dateFormat: string;
  }
  author: {
    add: boolean;
    name: string;
  };
}

export interface CamillePluginSettings {
  yamlFrontmatter: yamlFrontmatterSettings;
}

export const DEFAULT_SETTINGS: CamillePluginSettings = {
  yamlFrontmatter: {
    date: {
      add: true,
      dateFormat: 'yyyy-MM-DD',
    },
    updated: {
      add: true,
      dateFormat: 'yyyy-MM-DD',
    },
    author: {
      add: false,
      name: '',
    }
  }
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
      .setName('Create Date')
      .setDesc('在 YAML Front-matter 中添加 date 字段（创建时间）')
      .addToggle((toggle: ToggleComponent) => {
        toggle
          .setValue(this.plugin.settings.yamlFrontmatter.date.add)
          .setTooltip(this.plugin.settings.yamlFrontmatter.date.add? '添加' : '不添加')
          .onChange(async (value: boolean) => {
            this.plugin.settings.yamlFrontmatter.date.add = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    if (this.plugin.settings.yamlFrontmatter.date.add) {
      new Setting(containerEl)
        .setName('Date Format')
        .setClass('CS-sub-setting')
        .addDropdown((dropdown: DropdownComponent) =>
          dropdown
            .addOption('yyyy-MM-DD', 'yyyy-MM-DD')
            .addOption('yyyy-MM-DD-hh:mm', 'yyyy-MM-DD-hh:mm')
            .addOption('yyyy-MM-DD-hh:mm:ss', 'yyyy-MM-DD-hh:mm:ss')
            .setValue(this.plugin.settings.yamlFrontmatter.date.dateFormat)
            .onChange(async (value) => {
              this.plugin.settings.yamlFrontmatter.date.dateFormat = value;
              await this.plugin.saveSettings();
            })
        );
    }

    new Setting(containerEl)
      .setName('Updated Date')
      .setDesc('在 YAML Front-matter 中添加 updated 字段（更新时间）')
      .addToggle((toggle: ToggleComponent) => {
        toggle
          .setValue(this.plugin.settings.yamlFrontmatter.updated.add)
          .setTooltip(this.plugin.settings.yamlFrontmatter.updated.add? '添加' : '不添加')
          .onChange(async (value: boolean) => {
            this.plugin.settings.yamlFrontmatter.updated.add = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    if (this.plugin.settings.yamlFrontmatter.updated.add) {
      new Setting(containerEl)
        .setName('Date Format')
        .setClass('CS-sub-setting')
        .addDropdown((dropdown: DropdownComponent) =>
          dropdown
            .addOption('yyyy-MM-DD', 'yyyy-MM-DD')
            .addOption('yyyy-MM-DD-hh:mm', 'yyyy-MM-DD-hh:mm')
            .addOption('yyyy-MM-DD-hh-mm-ss', 'yyyy-MM-DD-hh-mm-ss')
            .setValue(this.plugin.settings.yamlFrontmatter.updated.dateFormat)
            .onChange(async (value) => {
              this.plugin.settings.yamlFrontmatter.updated.dateFormat = value;
              await this.plugin.saveSettings();
            })
        );
    }

    new Setting(containerEl)
      .setName('Author')
      .setDesc('在 YAML Front-matter 中添加 author 字段')
      .addToggle((toggle: ToggleComponent) => {
        toggle
          .setValue(this.plugin.settings.yamlFrontmatter.author.add)
          .setTooltip(this.plugin.settings.yamlFrontmatter.author.add? '添加' : '不添加')
          .onChange(async (value: boolean) => {
            this.plugin.settings.yamlFrontmatter.author.add = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    if (this.plugin.settings.yamlFrontmatter.author.add) {
      new Setting(containerEl)
        .setName('Author Name')
        .setClass('CS-sub-setting')
        .addText((text: TextComponent) =>
          text
            .setValue(this.plugin.settings.yamlFrontmatter.author.name)
            .onChange(async (value) => {
              this.plugin.settings.yamlFrontmatter.author.name = value;
              await this.plugin.saveSettings();
            })
        )
    }
  }
}
