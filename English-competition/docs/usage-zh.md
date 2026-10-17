# English Test 使用说明

一个完全离线的英语背单词应用，内置 **3682 个单词、7237 条中文释义**，无需联网、无需安装任何依赖。

## 三种用法

| 用法 | 怎么做 | 适合谁 |
|---|---|---|
| **浏览器直接打开** | 双击 `index.html` | 最快，装了 Chrome / Edge 就能用 |
| **桌面版 exe** | 从 [Releases](https://github.com/2049168557-blip/English-competition/releases) 下载压缩包，解压后双击 `English Test.exe` | 想放 U 盘、想独立窗口、不想开浏览器标签页 |
| **源码运行** | `npm install` 然后 `npm start` | 想改代码 |

三种用法的功能完全一致。区别只在数据存放位置（见下文「数据存在哪」）。

## 功能

- 每轮 100 题，从 3682 词随机抽取
- 三种模式
  - **中译英**：看中文释义，选正确英文单词
  - **英译中**：看英文单词，选出**全部**正确释义（多选）
  - **混合模式**：两种题型随机
- 两个独立错题本（中译英 / 英译中），可单独开一轮温习
- 手动加词 / 文本文件批量导入，自定义词直接进入题库和词典
- 词典页：A–Z 字母跳转、按英文或中文搜索
- 单词朗读发音（TTS）
- 进度条、正确率圆环、用时统计、错题回顾
- 响应式布局，窗口可拖动缩放（最小 720×560）

## 干扰项是怎么来的

错题选项不是随机抓的。程序按下面的分数在全词表里挑出**最像**的三个词：

```
分数 = 1 − 编辑距离(a, b) / 较长词长度     # 整体相似度
     + 0.6 × 共同前缀长度 / 较长词长度    # respective vs perspective
     + 0.3 × 共同后缀长度 / 较长词长度    # brilliant vs radiant
```

所以你会看到 `respective` 的干扰项里有 `perspective`，`brilliant` 的干扰项里有 `radiant`——靠词形猜是猜不出来的，必须真的认识这个单词。

英译中模式的干扰项则从全部 5501 个不重复释义里随机抽取（排除该词自己的释义），数量与正确选项相同。

## 数据存在哪

全部数据只有三个 `localStorage` 键：

| 键 | 内容 |
|---|---|
| `bcz_wrong_ce` | 中译英错题本 |
| `bcz_wrong_ec` | 英译中错题本 |
| `bcz_user_words` | 自定义单词 |

- **浏览器打开**：数据存在该浏览器 profile 里，换浏览器或清除站点数据会丢。
- **桌面版**：`main.js` 把 Electron 的 `userData` 目录钉在 exe 同级，所以整个文件夹拷到 U 盘或换电脑，错题本和自定义词都跟着走。

应用**不发起任何网络请求**——源码里没有 `fetch`、`XMLHttpRequest`、WebSocket，也不引用任何远程资源。断网、飞行模式下功能完整。

## 批量导入格式

`Add Word → Bulk Import` 接受 `.txt` / `.csv` / `.tsv`，一行一条：

```text
# 以 # 或 // 开头的行会被忽略
ubiquitous 普遍存在的、无处不在的
proficient 熟练的，精通的
genuine 真正的 / 真诚的
```

- 切分点是**第一个中文字符**，所以单词和释义之间用空格、`=`、`:`、`-`、`→` 都能识别
- 多个释义之间用 `、` `，` `；` 或 `/` 分隔
- 解析失败的行会在预览里列出原因，导入前可以逐条勾选或取消

## 桌面版文件夹里都有什么

解压后约 270 MB，看着文件很多，但绝大部分是 Electron（Chromium）运行时。

**你只需要关心 1 个文件：双击 `English Test.exe`。**

| 类别 | 文件 | 说明 |
|---|---|---|
| 主程序 | `English Test.exe` | Electron 运行时改名而来，双击即启动 |
| 应用本体 | `resources/app.asar` | 打包后的应用代码，就是本仓库的 `main.js` + `index.html` |
| Chromium 引擎 | `chrome_*.pak`、`resources.pak`、`icudtl.dat`、`snapshot_blob.bin`、`v8_context_snapshot.bin` | 浏览器内核资源与 V8 快照 |
| 图形接口 | `d3dcompiler_47.dll`、`libEGL.dll`、`libGLESv2.dll`、`vulkan-1.dll`、`vk_swiftshader.dll` | GPU 渲染，软件渲染兜底 |
| 音视频 | `ffmpeg.dll` | Chromium 自带，本项目实际用不到 |
| 多语言 | `locales/` | 几十种语言的 UI 字符串 |
| 许可证 | `LICENSE`、`LICENSES.chromium.html` | Chromium 的开源许可证 |
| 运行时生成 | `userData/`、`log/` | 错题本等数据，首次运行后出现 |

### 哪些能动、哪些不能动

| 操作 | 结果 |
|---|---|
| 双击 `English Test.exe` | ✅ 启动 |
| 移动 / 复制整个文件夹 | ✅ 可以，数据跟着走 |
| 改 exe 文件名 | ✅ 可以，快捷方式要重新指向 |
| 删除任何 `.dll` / `.pak` / `.bin` | ❌ 启动不了 |
| 删除 `resources/app.asar` | ❌ 只剩空白错误页 |
| 删除 `locales/` | ⚠️ 能跑，但界面文本可能缺翻译 |
| 删除 `userData/` | ⚠️ 清空错题本和自定义词 |

体积大是 Electron 的正常现象：整个应用自身只有 249 KB，其余 269 MB 是浏览器内核。

## 自己打包 exe

```bash
npm run pack
```

产物在 `dist/English Test win32-x64/`。想要自定义图标，把一个 `.ico` 放到 `build/icon.ico`，并在 `package.json` 的 `pack` 脚本里加上 `--icon=build/icon.ico`。

也可以直接推一个 `v*` 标签，让仓库里的 GitHub Actions 在 Windows 上自动打包（见 `.github/workflows/build-windows.yml`）。

> 注意：GitHub 仓库单文件上限 100 MB，打包产物（约 115 MB 的 zip）**不能提交进仓库**，只能作为 Release 附件上传。
