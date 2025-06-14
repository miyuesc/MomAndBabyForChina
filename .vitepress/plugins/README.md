# VitePress 表格插件

这是一个为 VitePress 开发的自定义表格插件，用于解析特定的表格语法并添加高级表格功能。

## 功能特性

- 🔧 **自定义表格语法**：支持 `:table:(参数)` 语法
- 📌 **固定表头**：支持表格表头固定
- 📍 **固定列**：支持左侧和右侧列固定
- 📐 **自定义尺寸**：支持设置表格宽度和高度
- 🎨 **样式集成**：与 VitePress 主题完美集成

## 语法说明

### 基本语法

```markdown
:table:(参数列表)
| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
```

### 参数说明

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `width` | 字符串 | 表格宽度 | `width=100%` 或 `width=800px` |
| `height` | 字符串 | 表格高度 | `height=400px` 或 `height=50vh` |
| `fixedHeader` | 布尔值 | 是否固定表头 | `fixedHeader=true` 或 `fixedHeader=false` |
| `fiexdLeft` | 布尔值/数字 | 固定左侧列数 | `fiexdLeft=true`（等同于1）或 `fiexdLeft=2` |
| `fiexdRight` | 布尔值/数字 | 固定右侧列数 | `fiexdRight=true`（等同于1）或 `fiexdRight=1` |

> 注意：`fiexdLeft` 和 `fiexdRight` 保持了原有的拼写以兼容现有内容，同时也支持正确拼写 `fixedLeft` 和 `fixedRight`。

## 使用示例

### 示例 1：基础固定表头

```markdown
:table:(height=300px,fixedHeader=true)
| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25 | 工程师 |
| 李四 | 30 | 设计师 |
```

### 示例 2：固定表头和左右列

```markdown
:table:(height=400px,width=100%,fixedHeader=true,fiexdLeft=2,fiexdRight=1)
| 品牌 | 型号 | 功能 | 价格 | 评分 | 操作 |
|------|------|------|------|------|------|
| 品牌A | 型号1 | 功能描述 | ¥1000 | 4.5 | 查看 |
| 品牌B | 型号2 | 功能描述 | ¥1200 | 4.8 | 查看 |
```

### 示例 3：仅设置尺寸

```markdown
:table:(width=80%,height=200px)
| 列1 | 列2 |
|-----|-----|
| 数据1 | 数据2 |
```

## 生成的 HTML 结构

插件会为表格添加以下 class 和样式：

- **固定表头**：`table__fixed-header` class
- **固定列**：`td__fixed` class（应用于需要固定的单元格）
- **内联样式**：width 和 height 直接应用为内联样式

## CSS 样式

插件包含完整的 CSS 样式，支持：

- 固定表头的粘性定位
- 固定列的粘性定位和层级管理
- 响应式设计
- 自定义滚动条样式
- 与 VitePress 主题变量集成

## 安装和配置

1. 将插件文件放置在 `.vitepress/plugins/` 目录下
2. 在 `.vitepress/config.js` 中引入并使用插件：

```javascript
import tablePlugin from './plugins/table-plugin.js';

export default defineConfig({
  // ... 其他配置
  markdown: {
    config: (md) => {
      md.use(tablePlugin);
    },
  },
});
```

3. 确保 CSS 样式已添加到主题中

## 注意事项

1. `:table:(参数)` 语法必须紧跟在表格前一行
2. 参数之间用逗号分隔，等号两边不要有空格
3. 固定列功能在移动端可能需要额外的响应式处理
4. 建议为大型表格设置合适的高度以启用滚动功能

## 兼容性

- ✅ VitePress 1.x
- ✅ 现代浏览器（支持 CSS sticky 定位）
- ✅ 移动端响应式