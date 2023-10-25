# Obsidian Plugin Camille

这是绘开发，绘自用的 Obsidian 插件，包含绘常用的功能：

- YAML Front-matter
  - 快捷键更新 YAML Front-matter 的部分信息（创建日期、修改日期、作者）
- 代码块
  - 代码类型提示
- 复选框
  - 快捷创建与删除（Toggle Checkbox）
- 链接
  - 快捷清理选中文本中各行已有的链接

TODO:

- Setting 面板完善
- 优化对选中区域执行操作后选中区域自动变化逻辑（提升使用体验）

## Create a new release

```bash
git tag -a v0.0.1 -m "Release v0.0.1"

git push origin --tags
```

## 开发指南

> [Obsidian 的开发文档](https://docs.obsidian.md/Home)中关于 Obsidian 插件 API 的介绍基本只有类型定义，没有具体使用说明，大部分 API 需要参考已有的插件才能知道用法，想实现什么功能可以先找一个具有相似功能的插件，然后参考其源码

- 可用 ICON 参考：[lucide.dev](https://lucide.dev/) 
- 使用 `Ctrl + Shift + I` 可以打开 DevTool 进行调试

### 插件生命周期

`onload()` 生命周期函数在用户激活 Obsidian 插件时触发，在插件更新时也会被触发，插件大部分功能都将在此函数中实现

`onunload()` 生命周期函数在插件被禁用时触发，插件所调用的任何资源必须在这里得到释放，以防止插件被禁用后对 Obsidian 的性能产生影响
