# JianCSS

JianCSS 是一个轻量级、现代化的CSS框架，结合了丰富的UI组件和JavaScript工具，旨在快速构建响应式网页应用。

## 目录

- [安装](#安装)
- [CSS控件](#css控件)
  - [布局系统](#布局系统)
  - [色彩系统](#色彩系统)
  - [组件](#组件)
  - [工具类](#工具类)
  - [响应式设计](#响应式设计)
- [JavaScript控件](#javascript控件)
  - [DOM选择器](#dom选择器)
  - [Table组件](#table组件)
  - [Dialog组件](#dialog组件)
  - [Pagination组件](#pagination组件)
- [使用示例](#使用示例)
- [自定义主题](#自定义主题)
- [浏览器兼容性](#浏览器兼容性)

## 安装

### CDN
```html
<link rel="stylesheet" href="https://your-domain.com/jian.css">
<link rel="stylesheet" href="https://your-domain.com/layouts.css">
<script src="https://your-domain.com/jian.js"></script>
```

### 本地安装
下载文件并引入到HTML中：
```html
<link rel="stylesheet" href="jian.css">
<link rel="stylesheet" href="layouts.css">
<script src="jian.js"></script>
```

## CSS控件

### 布局系统

#### Grid布局
- `.grid`: 创建弹性网格容器，自动换行
- `--gap`: 控制网格间距的CSS变量

#### Flexbox布局
- `.flex`: 启用弹性盒子布局
- `.flex-row`: 水平排列
- `.flex-col`: 垂直排列
- `.flex-row-reverse`: 水平反向排列
- `.flex-col-reverse`: 垂直反向排列
- `.flex-wrap`: 允许换行
- `.flex-nowrap`: 不允许换行
- `.flex-wrap-reverse`: 反向换行

#### Flex项目属性
- `.flex-1`: 平均分配空间
- `.flex-auto`: 自适应内容大小
- `.flex-initial`: 根据内容调整大小
- `.flex-none`: 不伸缩
- `.flex-grow`: 允许放大
- `.flex-grow0`: 不允许放大
- `.flex-shrink`: 允许缩小
- `.flex-shrink0`: 不允许缩小

#### 对齐方式
- `.justify-start`: 内容靠左对齐
- `.justify-end`: 内容靠右对齐
- `.justify-center`: 内容居中对齐
- `.justify-between`: 两端对齐
- `.justify-around`: 均匀分布，两侧有空隙
- `.justify-evenly`: 均匀分布，空隙相等
- `.items-start`: 垂直顶部对齐
- `.items-end`: 垂直底部对齐
- `.items-center`: 垂直居中对齐
- `.items-baseline`: 基线对齐
- `.items-stretch`: 拉伸填满容器
- `.self-auto`: 自动对齐
- `.self-start`: 自身靠上对齐
- `.self-end`: 自身靠下对齐
- `.self-center`: 自身居中对齐
- `.self-stretch`: 自身拉伸
- `.self-baseline`: 自身基线对齐
- `.content-start`: 多行内容顶部对齐
- `.content-end`: 多行内容底部对齐
- `.content-center`: 多行内容居中对齐
- `.content-between`: 多行内容两端对齐
- `.content-around`: 多行内容均匀分布
- `.content-stretch`: 多行内容拉伸

#### 24格栅格系统
- `.col1` - `.col24`: 对应1到24列的宽度
- 每列宽度基于24分之一计算

#### 间距系统
- `.m0`, `.m8`, `.m16`, `.m24`, `.m32`: 统一外边距
- `.mx0` - `.mx32`: 水平方向外边距
- `.my0` - `.my32`: 垂直方向外边距
- `.mt0` - `.mt32`: 顶部外边距
- `.mb0` - `.mb32`: 底部外边距
- `.ml0` - `.ml32`: 左侧外边距
- `.mr0` - `.mr32`: 右侧外边距
- `.m-auto`: 自动外边距

- `.p0`, `.p8`, `.p16`, `.p24`, `.p32`: 统一内边距
- `.px0` - `.px32`: 水平方向内边距
- `.py0` - `.py32`: 垂直方向内边距
- `.pt0` - `.pt32`: 顶部内边距
- `.pb0` - `.pb32`: 底部内边距
- `.pl0` - `.pl32`: 左侧内边距
- `.pr0` - `.pr32`: 右侧内边距

#### 间隙系统
- `.gap0`, `.gap8`, `.gap16`, `.gap24`, `.gap32`: 设置子元素间间隙

### 色彩系统

#### 背景色
- `.bg-card`: 卡片背景色
- `.bg-blue`: 蓝色背景
- `.bg-black`: 黑色背景
- `.bg-gray`: 灰色背景
- `.bg-red`: 红色背景
- `.bg-yellow`: 黄色背景
- `.bg-green`: 绿色背景
- `.bg-indigo`: 靛蓝色背景
- `.bg-pink`: 粉色背景
- `.bg-purple`: 紫色背景
- `.bg-white`: 白色背景
- `.bg-miku`: Miku蓝背景
- `.bg-cyan`: 青色背景
- `.bg-clear`: 透明背景

#### 边框色
- `.border-blue`: 蓝色边框
- `.border-black`: 黑色边框
- `.border-gray`: 灰色边框
- `.border-red`: 红色边框
- `.border-yellow`: 黄色边框
- `.border-green`: 绿色边框
- `.border-indigo`: 靛蓝色边框
- `.border-pink`: 粉色边框
- `.border-purple`: 紫色边框
- `.border-white`: 白色边框
- `.border-miku`: Miku蓝边框
- `.border-cyan`: 青色边框

#### 文字色
- `.text-black`: 黑色文字
- `.text-gray`: 灰色文字
- `.text-blue`: 蓝色文字
- `.text-red`: 红色文字
- `.text-yellow`: 黄色文字
- `.text-green`: 绿色文字
- `.text-indigo`: 靛蓝色文字
- `.text-pink`: 粉色文字
- `.text-purple`: 紫色文字
- `.text-miku`: Miku蓝文字
- `.text-cyan`: 青色文字

#### 主题变量
- `--blue`: #3b82f6
- `--gray`: #6b7280
- `--white`: #fff
- `--dark`: #1f2937
- `--red`: #ef4444
- `--green`: #31c48d
- `--yellow`: #ffbf00
- `--orange`: #f97316
- `--purple`: #a855f7
- `--pink`: #ec4899
- `--cyan`: #06b6d4
- `--indigo`: #6366f1
- `--miku`: #39C5BB
- `--border`: 1px solid #e5e7eb
- `--background`: var(--white)
- `--text`: var(--text-black)
- `--text-black`: #334155
- `--box-shadow`: 0 1px 2px 0 rgb(0 0 0 / 5%)
- `--shadow-bg`: #f9fafb

### 组件

#### 按钮
- `.btn`: 基础按钮样式
- `.btns`: 按钮组水平排列
- `.btnls`: 按钮组垂直排列

#### 输入框
- `.input`: 输入框样式
- `.select`: 下拉选择框样式

#### 卡片
- `.card`: 卡片组件样式

#### 表格
- `table`: 表格基础样式
- `thead th`: 表头样式
- `tbody tr`: 表格行样式

#### 对话框
- `dialog.dialog`: 对话框样式

#### 导航
- `.left-nav`: 左侧导航栏
- `.has-left-nav`: 有左侧导航的内容区
- `.page-header`: 页面头部

#### 其他组件
- `.prompt`: 提示文本
- `.bubble`: 气泡标签
- `.corner-mark`: 角标
- `.loading_i`: 加载图标
- `.bubbles`: 气泡容器
- `.rounded-full`: 圆形边框
- `.block`: 块级元素
- `.inline-block`: 行内块元素
- `.hidden`: 隐藏元素
- `blockquote`: 引用块

### 工具类

#### 尺寸
- `.w-full`: 100%宽度
- `.h-full`: 100%高度
- `.min-h-screen`: 最小屏幕高度

#### 定位
- `.relative`: 相对定位
- `.absolute`: 绝对定位
- `.fixed`: 固定定位
- `.top0`, `.right0`, `.bottom0`, `.left0`: 边界定位
- `.z10` - `.z50`: 层叠顺序

#### 文本
- `.text-left`: 左对齐
- `.text-center`: 居中对齐
- `.text-right`: 右对齐

#### 边框和圆角
- `.rounded`: 小圆角
- `.rounded-lg`: 大圆角
- `.rounded-full`: 圆形
- `.border`: 边框
- `.border0`: 无边框

#### 溢出
- `.overflow-auto`: 自动溢出滚动
- `.overflow-hidden`: 隐藏溢出内容

#### 其他
- `.no-border`: 移除边框
- `.no-padding`: 移除内边距
- `.box-border`: 盒模型包含边框
- `.hover-shadow`: 悬停阴影效果

### 响应式设计

#### 断点
- `xs`: 425px以上
- `sm`: 640px以上
- 更高断点在源代码中继续定义

#### 响应式类
- `.xs-flex`, `.sm-flex`: 响应式Flexbox
- `.xs-block`, `.sm-block`: 响应式块级元素
- `.xs-hidden`, `.sm-hidden`: 响应式隐藏
- `.xs-col1` - `.xs-col24`, `.sm-col1` - `.sm-col24`: 响应式栅格
- `.xs-m*`, `.sm-m*`: 响应式外边距
- `.xs-p*`, `.sm-p*`: 响应式内边距

## JavaScript控件

### DOM选择器

#### `$` 函数
一个轻量级的DOM选择器，支持多种选择方式：

```javascript
$('#myId') - 通过ID选择元素
$('.class') - 通过类名选择元素
$('tag') - 通过标签名选择元素
$('#id .class') - 复合选择器
```

### Table组件

#### 创建表格
```javascript
const table = new Jian.Table('#my-table', [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
], {
    headerMap: {
        id: '用户ID',
        name: '姓名',
        age: { title: '年龄', align: 'center' }
    },
    align: { id: 'center' }
});
```

#### 构造函数参数
- `query`: 表格元素的选择器或元素本身
- `data`: 表格数据（对象数组或数组数组）
- `opts`: 配置选项
  - `headerMap`: 列标题映射
  - `align`: 列对齐方式
  - `escapeHtml`: 是否转义HTML（默认true）

#### 方法
- `set(data, opts)`: 更新表格数据和选项
- `render()`: 渲染表格到DOM

### Dialog组件

#### 创建对话框
```javascript
const dialog = new Jian.Dialog('#my-dialog', {
    title: '编辑用户',
    showClose: true,
    footer: [
        { text: '取消', style: 'bg-clear', action: () => dialog.close() },
        { text: '保存', style: 'bg-blue', action: () => console.log('saved') },
        { text: '提示', style: '', position: 'left' }
    ]
});
dialog.open();
```

#### 构造函数参数
- `query`: dialog元素的选择器或元素本身
- `options`: 配置选项
  - `title`: 对话框标题
  - `showClose`: 是否显示关闭按钮
  - `footer`: 底部按钮配置
  - `onOpen`: 打开回调
  - `onClose`: 关闭回调

#### 方法
- `open(modal)`: 打开对话框
- `close()`: 关闭对话框
- `isOpen()`: 检查对话框是否打开
- `body(str)`: 获取或设置内容区域
- `footer(str)`: 获取或设置底部栏
- `header(str)`: 获取或设置标题栏
- `setTitle(title)`: 设置标题

### Pagination组件

#### 创建分页
```javascript
const pagination = new Jian.Pagination('#pagination-container', {
    total: 100,           // 总条目数
    pageSize: 10,         // 每页条目数（默认10）
    currentPage: 1,       // 当前页码（默认1）
    visiblePages: 5,      // 显示的页码按钮数（默认5）
    useHash: true,        // 使用URL hash记录页码（默认false）
    hashPrefix: 'page',   // URL hash前缀（默认'page'）
    onPageChange: (page) => console.log('跳转到第', page, '页')
});
```

#### 构造函数参数
- `query`: 分页容器元素的选择器或元素本身
- `options`: 配置选项
  - `total`: 总条目数
  - `totalPages`: 总页数（可选）
  - `pageSize`: 每页条目数
  - `currentPage`: 当前页码
  - `visiblePages`: 显示的页码按钮数
  - `useHash`: 是否使用URL hash
  - `hashPrefix`: URL hash前缀
  - `onPageChange`: 页码变化回调

#### 属性
- `totalPages`: 获取总页数
- `currentPage`: 获取当前页码
- `pageSize`: 获取每页条目数

#### 方法
- `update(options)`: 更新配置并重新渲染
- `goTo(page)`: 跳转到指定页
- `next()`: 下一页
- `prev()`: 上一页
- `first()`: 第一页
- `last()`: 最后一页
- `render()`: 渲染分页组件

## 使用示例

### 基础布局
```html
<div class="grid gap16">
  <div class="col12">十二分之一宽度</div>
  <div class="col12">十二分之一宽度</div>
</div>
```

### 按钮组
```html
<div class="btns">
  <button class="btn bg-blue">按钮1</button>
  <button class="btn bg-green">按钮2</button>
  <button class="btn bg-red">按钮3</button>
</div>
```

### 表格使用
```html
<table id="my-table"></table>
<script>
  const table = new Jian.Table('#my-table', [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 }
  ], {
    headerMap: {
      id: 'ID',
      name: '姓名',
      age: '年龄'
    }
  });
</script>
```

### 对话框使用
```html
<dialog id="my-dialog">
  <p>对话框内容</p>
</dialog>
<script>
  const dialog = new Jian.Dialog('#my-dialog', {
    title: '确认删除',
    showClose: true,
    footer: [
      { text: '取消', style: 'bg-clear', action: () => dialog.close() },
      { text: '确认', style: 'bg-red', action: () => {
        // 执行删除操作
        dialog.close();
      }}
    ]
  });
  
  // 打开对话框
  dialog.open();
</script>
```

### 分页使用
```html
<div id="pagination-container"></div>
<script>
  const pagination = new Jian.Pagination('#pagination-container', {
    total: 100,
    pageSize: 10,
    currentPage: 1,
    onPageChange: (page) => {
      console.log(`切换到第 ${page} 页`);
      // 在这里加载对应页的数据
    }
  });
</script>
```

## 自定义主题

可以通过修改CSS变量来自定义主题：

```css
:root {
  --blue: #your-color;
  --background: #your-background-color;
  --text: #your-text-color;
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

对于旧版浏览器，可能需要添加相应的polyfill。