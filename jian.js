/**
 * Jian.js - 轻量级前端工具库
 * 包含表格渲染和消息提示功能
 */

(() => {
    /**
     * DOM 选择器函数 $
     * @param {string|object} query - CSS 选择器字符串或 DOM 元素对象
     * @returns {Element|Element[]|undefined} - 如果找到单个元素返回元素，多个元素返回数组，未找到返回 undefined
     *
     * 使用示例:
     * $('#myId') - 通过 ID 选择
     * $('.class') - 通过类名选择
     * $('tag') - 通过标签名选择
     * $('#id .class') - 复合选择器
     */
    window.$ = ((query) => {
        let elem = undefined;
        switch (typeof query) {
            case "string":
                // 字符串：作为 CSS 选择器查询
                elem = document.querySelectorAll(query)
                if (!elem || elem.length == 0) return undefined;
                if (elem.length == 1) return elem[0];
                break;
            case "object":
                // 对象：直接使用（假设是 DOM 元素）
                elem = query
                break;
        }
        return elem
    });

    /**
     * Table 类 - 表格渲染组件
     * 支持对象数组和数组数组两种数据格式
     *
     * 使用示例:
     * const table = new Jian.Table('#my-table', [
     *     { id: 1, name: 'Alice', age: 25 },
     *     { id: 2, name: 'Bob', age: 30 }
     * ], {
     *     headerMap: {
     *         id: '用户ID',
     *         name: '姓名',
     *         age: { title: '年龄', align: 'center' }
     *     },
     *     align: { id: 'center' }
     * });
     */
    class Table {
        /**
         * 构造函数
         * @param {string|Element} query - 表格元素的选择器或元素本身
         * @param {Array} data - 表格数据（对象数组或数组数组）
         * @param {Object} opts - 配置选项
         * @param {Object} opts.headerMap - 列标题映射，支持字符串或 {title, align} 对象
         * @param {Object} opts.align - 列对齐方式，{key: 'left'|'center'|'right'}
         * @param {boolean} opts.escapeHtml - 是否转义 HTML（默认 true）
         */
        constructor(query, data, opts) {
            this._query = query;
            this._elem = (typeof query == "object") ? query : window.$(query);
            this.opts = {}
            this.opts.align = {}
            this.opts.headerMap = {}
            // 初始化数据并渲染
            this.set(data, opts);
            this.render();
        }

        /**
         * 更新表格数据和选项
         * @param {Array} data - 新的数据
         * @param {Object} opts - 新的配置选项（可选）
         * @returns {Table} - 返回 this 支持链式调用
         */
        set(data, opts) {
            this._data = data || [];
            if (opts != undefined) {
                this.opts = opts;
            }
            this.render();
            return this;
        }

        /**
         * HTML 转义方法，防止 XSS 攻击
         * @param {*} v - 需要转义的值
         * @returns {string} - 转义后的字符串
         */
        _sanitize(v) {
            if (!this.opts.escapeHtml) return v;
            if (v === null || v === undefined) return "";
            return String(v)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        /**
         * 错误处理方法
         * @param {Error|string} err - 错误对象或错误消息
         */
        _handleError(err) {
            // 记录完整错误到控制台用于调试
            console.error("[Table Error]", err && err.message ? err.message : err, err && err.stack ? err.stack : "");
            // 如果元素可用，渲染简化的错误消息
            if (this._elem && this._elem.nodeType === 1) {
                const msg = this._sanitize(err && err.message ? err.message : "Unknown error");
                this._elem.innerHTML = `<div class="text-center text-red">Table render error: ${msg}</div>`;
            }
        }

        /**
         * 获取列标题
         * @param {string} key - 列的键名
         * @returns {string} - 列标题
         */
        _getTitle(key) {
            const v = this.opts.headerMap && this.opts.headerMap[key];
            if (typeof v === "string") return v;
            if (v && typeof v === "object" && v.title) return v.title;
            return String(key);
        }

        /**
         * 获取列对齐方式
         * @param {string|number} key - 列的键名或索引
         * @returns {string} - 对齐方式：left/center/right
         */
        _getAlign(key) {
            // 优先使用显式的 align 映射
            if (this.opts.align && Object.prototype.hasOwnProperty.call(this.opts.align, key)) {
                return String(this.opts.align[key]).toLowerCase();
            }
            if (this.opts.align && Object.prototype.hasOwnProperty.call(this.opts.align, String(key))) {
                return String(this.opts.align[String(key)]).toLowerCase();
            }
            // 回退到 headerMap 中的对齐设置
            const v = this.opts.headerMap && this.opts.headerMap[key];
            if (v && typeof v === "object" && v.align) return String(v.align).toLowerCase();
            // 默认左对齐
            return "left";
        }

        /**
         * 渲染表格到 DOM
         */
        render() {
            try {
                // 检查元素是否存在
                if (!this._elem) {
                    return this._handleError("Element not found for query: " + String(this._query));
                }

                // 检查元素是否是 TABLE 标签
                if (this._elem.tagName && this._elem.tagName.toUpperCase() !== "TABLE") {
                    return this._handleError("Selected element is not a TABLE");
                }

                // 检查数据是否有效
                if (!Array.isArray(this._data) || this._data.length === 0) {
                    this._elem.innerHTML = "";
                    if (!Array.isArray(this._data) || this._data.length === 0) {
                        console.warn("[Table Warning] No data provided or data is empty.");
                    }
                    return;
                }

                let html = "";
                const first = this._data[0];

                // 如果是对象数组 -> 使用对象键作为列标题
                if (first && typeof first === "object" && !Array.isArray(first)) {
                    const headers = Object.keys(first);
                    // 渲染表头
                    html +=
                        "<thead><tr>" +
                        headers.map(h => {
                            const align = this._getAlign(h);
                            return `<th class="text-${align}">` + this._sanitize(this._getTitle(h)) + "</th>";
                        }).join("")
                        + "</tr></thead>";

                    // 渲染表体
                    html +=
                        "<tbody>" +
                        this._data.map(row =>
                            "<tr>" +
                            headers.map(h => {
                                const align = this._getAlign(h);
                                return `<td class="text-${align}">` + this._sanitize(row && row[h]) + "</td>";
                            }).join("")
                            + "</tr>"
                        ).join("")
                        + "</tbody>";
                } else {
                    // 数组数组（或混合）-> 渲染行，确定最大列数
                    const cols = Math.max(...this._data.map(r => Array.isArray(r) ? r.length : 1));
                    html +=
                        "<tbody>" +
                        this._data.map(row => {
                            const arr = Array.isArray(row) ? row : [row];
                            return "<tr>" + Array.from({ length: cols }).map((_, i) => {
                                const align = this._getAlign(i);
                                return `<td class="text-${align}">` + this._sanitize(arr[i]) + "</td>";
                            }).join("") + "</tr>";
                        }).join("")
                        + "</tbody>";
                }

                this._elem.innerHTML = html;
            } catch (err) {
                this._handleError(err);
            }
        }
    }


    /**
     * Dialog 类 - 对话框组件
     * 基于 HTML5 <dialog> 元素，提供原生的模态对话框功能
     *
     * 使用示例:
     * const dialog = new Jian.Dialog('#my-dialog', {
     *     title: '编辑用户',
     *     showClose: true,
     *     footer: [
     *         { text: '取消', style: 'bg-clear', action: () => dialog.close() },
     *         { text: '保存', style: 'bg-blue', action: () => console.log('saved') },
     *         { text: '提示', style: '', position: 'left' }
     *     ]
     * });
     * dialog.open();
     * dialog.body();       // 获取 body 元素
     * dialog.body('<p>内容</p>');  // 设置 body 内容
     * dialog.footer();     // 获取 footer 元素
     * dialog.footer('提示文本');  // 设置 footer 内容
     * dialog.close();
     */
    class Dialog {
        /**
         * 构造函数
         * @param {string|Element} query - dialog 元素的选择器或元素本身
         * @param {Object} options - 配置选项
         * @param {string} options.title - 对话框标题
         * @param {boolean} options.showClose - 是否显示关闭按钮（默认 false）
         * @param {Array} options.footer - 底部按钮配置数组 [{text, style, action, position}, ...]
         * @param {string} options.footer[].text - 按钮文本
         * @param {string} options.footer[].style - 按钮样式类
         * @param {Function} options.footer[].action - 点击回调函数
         * @param {string} options.footer[].position - 按钮位置：left|center|right（默认 right）
         * @param {Function} options.onOpen - 打开回调函数
         * @param {Function} options.onClose - 关闭回调函数
         */
        constructor(query, options = {}) {
            this._elem = (typeof query == "object") ? query : window.$(query);
            if (!this._elem || this._elem.tagName !== 'DIALOG') {
                console.error("[Dialog Error] Element must be a <dialog> element");
                return;
            }

            this._options = options;
            this._headerEl = null;
            this._bodyEl = null;
            this._footerEl = null;

            // 保存原始内容
            this._originalContent = Array.from(this._elem.childNodes);

            // 初始化对话框结构
            this._init();
        }

        /**
         * 初始化对话框结构
         */
        _init() {
            const { title, showClose, footer } = this._options;

            // 创建标题栏
            if (title !== undefined) {
                this._headerEl = document.createElement('div');
                this._headerEl.className = 'dialog-header';
                this._elem.insertBefore(this._headerEl, this._elem.firstChild);
                this._headerEl.innerHTML = `<h3 class="dialog-title">${title}</h3>`;

                // 添加关闭按钮
                if (showClose) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'bg-clear';
                    closeBtn.innerHTML = '&times;';
                    closeBtn.onclick = () => this.close();
                    this._headerEl.appendChild(closeBtn);
                }
            }

            // 获取或创建内容区域，从 dialog 标签读取现有内容
            this._bodyEl = this._elem.querySelector('.dialog-body');
            if (!this._bodyEl) {
                this._bodyEl = document.createElement('div');
                this._bodyEl.className = 'dialog-body';
                // 将原始内容移动到 body
                this._originalContent.forEach(node => {
                    this._bodyEl.appendChild(node);
                });
                this._elem.appendChild(this._bodyEl);
            }

            // 通过 JSON 配置创建底部栏
            if (footer && Array.isArray(footer)) {
                this._footerEl = this._elem.querySelector('.dialog-footer');
                if (!this._footerEl) {
                    this._footerEl = document.createElement('div');
                    this._footerEl.className = 'dialog-footer';
                    this._elem.appendChild(this._footerEl);
                }
                this._renderFooter(footer);
            }
        }

        /**
         * 渲染底部按钮
         * @param {Array} footer - 按钮配置数组
         */
        _renderFooter(footer) {
            if (!this._footerEl) return;

            this._footerEl.innerHTML = '';
            footer.forEach((btnConfig, index) => {
                const button = document.createElement('button');
                button.className = `btn ${btnConfig.style || ''}`;
                button.textContent = btnConfig.text || `按钮${index + 1}`;

                // 添加对齐类
                if (btnConfig.position === 'left') {
                    button.classList.add('pull-left');
                } else if (btnConfig.position === 'center') {
                    button.classList.add('pull-center');
                }

                // 绑定点击事件
                if (typeof btnConfig.action === 'function') {
                    button.onclick = btnConfig.action;
                }

                this._footerEl.appendChild(button);
            });
        }

        /**
         * 打开对话框
         * @param {boolean} modal - 是否模态显示（默认 true）
         */
        open(modal = true) {
            if (this._elem) {
                if (modal) {
                    this._elem.showModal();
                } else {
                    this._elem.show();
                }

                // 触发打开回调
                if (typeof this._options.onOpen === 'function') {
                    this._options.onOpen();
                }
            }
        }

        /**
         * 关闭对话框
         */
        close() {
            if (this._elem) {
                this._elem.close();

                // 触发关闭回调
                if (typeof this._options.onClose === 'function') {
                    this._options.onClose();
                }
            }
        }

        /**
         * 检查对话框是否打开
         * @returns {boolean}
         */
        isOpen() {
            return this._elem && this._elem.open;
        }

        /**
         * 获取或设置内容区域
         * @param {string} str - 可选，设置内容区域的 HTML
         * @returns {Element|null} - 返回 body 元素
         */
        body(str) {
            if (str) {
                this._bodyEl.innerHTML = str;
            }
            return this._bodyEl;
        }

        /**
         * 获取或设置底部栏
         * @param {string} str - 可选，设置底部栏的 HTML
         * @returns {Element|null} - 返回 footer 元素
         */
        footer(str) {
            if (str) {
                this._footerEl.innerHTML = str;
            }
            return this._footerEl;
        }

        /**
         * 获取或设置标题栏
         * @param {string} str - 可选，设置标题栏的 HTML
         * @returns {Element|null} - 返回 header 元素
         */
        header(str) {
            if (str) {
                this._headerEl.innerHTML = str;
            }
            return this._headerEl;
        }

        /**
         * 设置标题
         * @param {string} title
         */
        setTitle(title) {
            if (this._headerEl) {
                const titleEl = this._headerEl.querySelector('.dialog-title');
                if (titleEl) {
                    titleEl.textContent = title;
                }
            }
        }
    }


    /**
     * Pagination 类 - 分页组件
     * 提供完整的分页功能，支持总页数、当前页、每页显示页码数等配置
     *
     * 使用示例:
     * const pagination = new Jian.Pagination('#pagination-container', {
     *     total: 100,           // 总条目数
     *     pageSize: 10,         // 每页条目数（默认 10）
     *     currentPage: 1,       // 当前页码（默认 1）
     *     visiblePages: 5,      // 显示的页码按钮数（默认 5）
     *     useHash: true,        // 使用 URL hash 记录页码（默认 false）
     *     hashPrefix: 'page',   // URL hash 前缀（默认 'page'），例如 #page=3
     *     onPageChange: (page) => console.log('跳转到第', page, '页')
     * });
     * pagination.goTo(3);       // 跳转到第 3 页
     * pagination.update({ total: 200 });  // 更新配置
     */
    class Pagination {
        /**
         * 构造函数
         * @param {string|Element} query - 分页容器元素的选择器或元素本身
         * @param {Object} options - 配置选项
         * @param {number} options.total - 总条目数
         * @param {number} options.totalPages - 总页数（可选，与 total 二选一）
         * @param {number} options.pageSize - 每页条目数（默认 10）
         * @param {number} options.currentPage - 当前页码（默认 1）
         * @param {number} options.visiblePages - 显示的页码按钮数（默认 5）
         * @param {boolean} options.useHash - 是否使用 URL hash 记录页码（默认 false）
         * @param {string} options.hashPrefix - URL hash 前缀（默认 'page'）
         * @param {Function} options.onPageChange - 页码变化回调函数
         */
        constructor(query, options = {}) {
            this._elem = (typeof query == "object") ? query : window.$(query);
            if (!this._elem) {
                console.error("[Pagination Error] Element not found for query:", query);
                return;
            }

            this._options = {
                total: options.total || 0,
                totalPages: options.totalPages || null,
                pageSize: options.pageSize || 10,
                currentPage: options.currentPage || 1,
                visiblePages: options.visiblePages || 5,
                useHash: options.useHash || false,
                hashPrefix: options.hashPrefix || 'page',
                onPageChange: options.onPageChange || null
            };

            // 如果启用 hash，从 URL hash 读取初始页码
            if (this._options.useHash) {
                const initialPage = this._getPageFromHash();
                if (initialPage) {
                    this._options.currentPage = initialPage;
                }
                // 监听 hash 变化
                this._boundHandleHashChange = this._handleHashChange.bind(this);
                window.addEventListener('hashchange', this._boundHandleHashChange);
            }

            this._render();
        }

        /**
         * 获取总页数
         * @returns {number}
         */
        get totalPages() {
            // 如果直接提供了 totalPages，则使用它，否则通过 total 和 pageSize 计算
            if (this._options.totalPages !== null) {
                return this._options.totalPages;
            }
            return Math.ceil(this._options.total / this._options.pageSize) || 1;
        }

        /**
         * 获取当前页码
         * @returns {number}
         */
        get currentPage() {
            return this._options.currentPage;
        }

        /**
         * 设置当前页码
         * @param {number} page
         */
        set currentPage(page) {
            this.goTo(page);
        }

        /**
         * 获取每页条目数
         * @returns {number}
         */
        get pageSize() {
            return this._options.pageSize;
        }

        /**
         * 更新配置并重新渲染
         * @param {Object} options - 新的配置选项
         */
        update(options) {
            Object.assign(this._options, options);
            // 确保当前页在有效范围内
            if (this._options.currentPage > this.totalPages) {
                this._options.currentPage = this.totalPages;
            }
            this._render();
        }

        /**
         * 跳转到指定页
         * @param {number} page - 目标页码
         */
        goTo(page) {
            const validPage = Math.max(1, Math.min(page, this.totalPages));
            if (validPage === this._options.currentPage) return;

            this._options.currentPage = validPage;
            this._render();

            // 更新 URL hash
            if (this._options.useHash) {
                this._updateHash(validPage);
            }

            // 调用回调函数
            if (typeof this._options.onPageChange === 'function') {
                this._options.onPageChange(validPage);
            }
        }

        /**
         * 跳转到上一页
         */
        prev() {
            if (this._options.currentPage > 1) {
                this.goTo(this._options.currentPage - 1);
            }
        }

        /**
         * 跳转到下一页
         */
        next() {
            if (this._options.currentPage < this.totalPages) {
                this.goTo(this._options.currentPage + 1);
            }
        }

        /**
         * 跳转到第一页
         */
        first() {
            this.goTo(1);
        }

        /**
         * 跳转到最后一页
         */
        last() {
            this.goTo(this.totalPages);
        }

        /**
         * 渲染分页组件
         */
        _render() {
            const { currentPage, visiblePages } = this._options;
            const totalPages = this.totalPages;

            if (totalPages <= 1) {
                this._elem.innerHTML = '';
                return;
            }

            let html = '<ul class="pagination m0">';

            // 上一页按钮
            html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a href="javascript:void(0)" class="page-link" ${currentPage === 1 ? 'style="pointer-events: none;"' : `data-action="prev"`}>上一页</a>
            </li>`;

            // 计算显示的页码范围
            let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
            let endPage = Math.min(totalPages, startPage + visiblePages - 1);

            // 调整起始页，确保显示 visiblePages 个页码
            if (endPage - startPage + 1 < visiblePages) {
                startPage = Math.max(1, endPage - visiblePages + 1);
            }

            // 第一页和省略号
            if (startPage > 1) {
                html += `<li class="page-item">
                    <a href="javascript:void(0)" class="page-link" data-action="goto" data-page="1">1</a>
                </li>`;
                if (startPage > 2) {
                    html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
            }

            // 页码按钮
            for (let i = startPage; i <= endPage; i++) {
                html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a href="javascript:void(0)" class="page-link" data-action="goto" data-page="${i}">${i}</a>
                </li>`;
            }

            // 最后页和省略号
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
                html += `<li class="page-item">
                    <a href="javascript:void(0)" class="page-link" data-action="goto" data-page="${totalPages}">${totalPages}</a>
                </li>`;
            }

            // 下一页按钮
            html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a href="javascript:void(0)" class="page-link" ${currentPage === totalPages ? 'style="pointer-events: none;"' : `data-action="next"`}>下一页</a>
            </li>`;

            html += '</ul>';
            this._elem.innerHTML = html;

            // 附加事件监听器
            this._attachEvents();
        }

        /**
         * 从 URL hash 获取页码
         * @returns {number|null}
         */
        _getPageFromHash() {
            if (!window.location.hash) return null;

            const hashValue = window.location.hash.substring(1); // 去掉 #
            const hashPrefix = this._options.hashPrefix;

            if (hashValue.startsWith(hashPrefix + '=')) {
                const pageStr = hashValue.substring(hashPrefix.length + 1);
                const page = parseInt(pageStr);
                if (!isNaN(page) && page >= 1) {
                    return page;
                }
            }
            return null;
        }

        /**
         * 更新 URL hash
         * @param {number} page
         */
        _updateHash(page) {
            const hashValue = `${this._options.hashPrefix}=${page}`;
            window.location.hash = hashValue;
        }

        /**
         * 处理 hash 变化事件
         */
        _handleHashChange() {
            const page = this._getPageFromHash();
            if (page && page !== this._options.currentPage && page <= this.totalPages) {
                this._options.currentPage = page;
                this._render();
                if (typeof this._options.onPageChange === 'function') {
                    this._options.onPageChange(page);
                }
            }
        }

        /**
         * 附加事件监听器
         */
        _attachEvents() {
            // 移除旧的点击事件监听器
            if (this._clickHandler) {
                this._elem.removeEventListener('click', this._clickHandler);
            }

            // 添加新的事件监听器（事件委托）
            this._clickHandler = (e) => {
                const link = e.target.closest('a.page-link');
                if (!link) return;

                // 检查是否禁用
                if (link.style.pointerEvents === 'none') return;

                const action = link.dataset.action;
                if (action === 'prev') {
                    this.prev();
                } else if (action === 'next') {
                    this.next();
                } else if (action === 'goto') {
                    const page = parseInt(link.dataset.page);
                    this.goTo(page);
                }
            };

            this._elem.addEventListener('click', this._clickHandler);
        }

        /**
         * 销毁分页组件，移除事件监听器
         */
        destroy() {
            if (this._clickHandler) {
                this._elem.removeEventListener('click', this._clickHandler);
                this._clickHandler = null;
            }
            if (this._boundHandleHashChange && this._options.useHash) {
                window.removeEventListener('hashchange', this._boundHandleHashChange);
                this._boundHandleHashChange = null;
            }
            if (this._elem) {
                this._elem.innerHTML = '';
            }
        }
    }


    /**
     * Toast 消息提示函数
     * 显示临时通知消息，支持成功/错误/信息/警告四种类型
     *
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型：success|error|info|warning（默认 'info'）
     * @param {number} duration - 显示时长（毫秒，默认 3000ms）
     *
     * 使用示例:
     * Jian.Toast('操作成功！', 'success', 2000);
     * Jian.Toast('发生错误', 'error');
     * Jian.Toast('请注意', 'info', 5000);
     */
    function Toast(message, type = 'info', duration = 3000) {
        // 获取或创建 toast 容器
        const container = document.getElementById('toast-container') || (() => {
            const tc = document.createElement('div');
            tc.id = 'toast-container';
            tc.className = 'toast-container'
            document.body.appendChild(tc);
            return tc;
        })();

        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.className = 'toast ' + type || 'info';

        // 图标定义
        const iconText = {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" /></svg>',
            info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" /></svg>',
            warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" /></svg>'
        };

        // 构建 toast 内容：图标 + 消息 + 关闭按钮
        toast.innerHTML = `<span class="icon">${iconText[type]}</span><span class="message">${message}</span><span class="close" onclick="this.parentElement.remove()">×</span>`;

        // 添加到容器
        container.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            toast.addEventListener('animationend', () => toast.remove());
        }, duration || 3000);
    }

    // 导出到全局命名空间
    window.Jian = {};
    window.Jian.Table = Table;
    window.Jian.Dialog = Dialog;
    window.Jian.Pagination = Pagination;
    window.Jian.Toast = Toast;
})();