var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で「販売中」「売り切れ」の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     3.0.1
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
    'use strict';
    var _myLocalStorage, _changeEventListener, _clickEventListener, _keydownEventListener;
    class InputSwitch extends HTMLElement {
        constructor() {
            super();
            _myLocalStorage.set(this, null);
            _changeEventListener.set(this, void 0);
            _clickEventListener.set(this, void 0);
            _keydownEventListener.set(this, void 0);
            try {
                __classPrivateFieldSet(this, _myLocalStorage, localStorage);
            }
            catch (e) {
                console.info('Storage access blocked.');
            }
            const cssString = `
			:host {
				--switch-width: 3.6em; /* 外枠の幅 */
				--switch-height: 1.8em; /* 外枠の高さ */
				--switch-padding: .2em; /* 外枠と球の間隔（マイナス値指定可能） */
				--switch-bgcolor-on: #29f; /* オンの時の背景色 */
				--switch-bgcolor-off: #ccc; /* オフの時の背景色 */
				--switch-bgcolor-disabled-on: #666; /* [disabled] オンの時の背景色 */
				--switch-bgcolor-disabled-off: #666; /* [disabled] オフの時の背景色 */
				--switch-ball-color: #fff; /* スライダーの球の色（background プロパティ） */
				--switch-animation-duration: .5s; /* アニメーションに掛かる時間（transition-duration プロパティ） */
				--switch-outline-mouse-focus: none; /* マウスフォーカス時のフォーカスインジゲーター（outline プロパティ） */

				position: relative;
				display: inline-block;
				width: var(--switch-width);
				height: var(--switch-height);
			}

			:host(:focus:not(:focus-visible)) {
				outline: var(--switch-outline-mouse-focus);
			}

			.slider {
				--switch-bgcolor: var(--switch-bgcolor-off);

				border-radius: var(--switch-height);
				position: absolute;
				inset: 0;
				background: var(--switch-bgcolor);
				transition: background var(--switch-animation-duration);
			}

			@supports not (inset: 0) {
				.slider {
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
				}
			}

			.slider::before {
				--switch-ball-diameter: calc(var(--switch-height) - var(--switch-padding) * 2);
				--switch-ball-transform: translateX(0);

				border-radius: 50%;
				content: "";
				width: var(--switch-ball-diameter);
				height: var(--switch-ball-diameter);
				position: absolute;
				inset: var(--switch-padding);
				background: var(--switch-ball-color);
				transform: var(--switch-ball-transform);
				transition: transform var(--switch-animation-duration);
			}

			@supports not (inset: 0) {
				.slider::before {
					top: var(--switch-padding);
					left: var(--switch-padding);
				}
			}

			:host([checked]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-on);
			}

			:host([checked]) .slider::before {
				--switch-ball-transform: translateX(calc(var(--switch-width) - var(--switch-height)));
			}

			:host([disabled]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-disabled-off);
			}
			:host([disabled][checked]) .slider {
				--switch-bgcolor: var(--switch-bgcolor-disabled-on);
			}
		`;
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
			<span class="slider"></span>
		`;
            if (shadow.adoptedStyleSheets !== undefined) {
                const cssStyleSheet = new CSSStyleSheet();
                cssStyleSheet.replaceSync(cssString);
                shadow.adoptedStyleSheets = [cssStyleSheet];
            }
            else {
                /* adoptedStyleSheets 未対応環境 */
                shadow.innerHTML += `<style>${cssString}</style>`;
            }
            __classPrivateFieldSet(this, _changeEventListener, this._changeEvent.bind(this));
            __classPrivateFieldSet(this, _clickEventListener, this._clickEvent.bind(this));
            __classPrivateFieldSet(this, _keydownEventListener, this._keydownEvent.bind(this));
        }
        static get formAssociated() {
            return true;
        }
        static get observedAttributes() {
            return ['checked', 'disabled', 'storage-key'];
        }
        connectedCallback() {
            const checked = this.checked;
            const disabled = this.disabled;
            if (__classPrivateFieldGet(this, _myLocalStorage) !== null) {
                const storageKey = this.storageKey;
                if (storageKey !== null && storageKey !== '') {
                    /* ストレージから前回アクセス時のチェック情報を取得する */
                    const storageValue = __classPrivateFieldGet(this, _myLocalStorage).getItem(storageKey);
                    switch (storageValue) {
                        case 'true':
                            if (!checked) {
                                this.checked = true;
                            }
                            break;
                        case 'false':
                            if (checked) {
                                this.checked = false;
                            }
                            break;
                    }
                }
            }
            this.tabIndex = disabled ? -1 : 0;
            this.setAttribute('role', 'switch');
            this.setAttribute('aria-checked', String(checked));
            this.setAttribute('aria-disabled', String(disabled));
            if (!disabled) {
                this.addEventListener('change', __classPrivateFieldGet(this, _changeEventListener), { passive: true });
                this.addEventListener('click', __classPrivateFieldGet(this, _clickEventListener));
                this.addEventListener('keydown', __classPrivateFieldGet(this, _keydownEventListener));
            }
        }
        disconnectedCallback() {
            this.removeEventListener('change', __classPrivateFieldGet(this, _changeEventListener));
            this.removeEventListener('click', __classPrivateFieldGet(this, _clickEventListener));
            this.removeEventListener('keydown', __classPrivateFieldGet(this, _keydownEventListener));
        }
        attributeChangedCallback(name, _oldValue, newValue) {
            switch (name) {
                case 'checked': {
                    const checked = newValue !== null;
                    this.setAttribute('aria-checked', String(checked));
                    break;
                }
                case 'disabled': {
                    const disabled = newValue !== null;
                    this.setAttribute('aria-disabled', String(disabled));
                    if (disabled) {
                        this.tabIndex = -1;
                        this.removeEventListener('change', __classPrivateFieldGet(this, _changeEventListener));
                        this.removeEventListener('click', __classPrivateFieldGet(this, _clickEventListener));
                        this.removeEventListener('keydown', __classPrivateFieldGet(this, _keydownEventListener));
                        this.blur();
                    }
                    else {
                        this.tabIndex = 0;
                        this.addEventListener('change', __classPrivateFieldGet(this, _changeEventListener), { passive: true });
                        this.addEventListener('click', __classPrivateFieldGet(this, _clickEventListener));
                        this.addEventListener('keydown', __classPrivateFieldGet(this, _keydownEventListener));
                    }
                    break;
                }
                case 'storage-key': {
                    break;
                }
            }
        }
        get checked() {
            return this.getAttribute('checked') !== null;
        }
        set checked(value) {
            if (typeof value !== 'boolean') {
                throw new TypeError(`Only a boolean value can be specified for the \`checked\` attribute of the <${this.localName}> element.`);
            }
            if (value) {
                this.setAttribute('checked', '');
            }
            else {
                this.removeAttribute('checked');
            }
        }
        get disabled() {
            return this.getAttribute('disabled') !== null;
        }
        set disabled(value) {
            if (typeof value !== 'boolean') {
                throw new TypeError(`Only a boolean value can be specified for the \`disabled\` attribute of the <${this.localName}> element.`);
            }
            if (value) {
                this.setAttribute('disabled', '');
            }
            else {
                this.removeAttribute('disabled');
            }
        }
        get storageKey() {
            return this.getAttribute('storage-key');
        }
        set storageKey(value) {
            if (value === null) {
                this.removeAttribute('storage-key');
                return;
            }
            if (typeof value !== 'string') {
                throw new TypeError(`Only a string value can be specified for the \`storage-key\` attribute of the <${this.localName}> element.`);
            }
            this.setAttribute('storage-key', value);
        }
        /**
         * スイッチの状態を変更する
         */
        _changeEvent() {
            const checked = this.checked;
            this.checked = !checked;
            if (__classPrivateFieldGet(this, _myLocalStorage) !== null) {
                const storageKey = this.storageKey;
                if (storageKey !== null && storageKey !== '') {
                    /* スイッチのチェック情報をストレージに保管する */
                    __classPrivateFieldGet(this, _myLocalStorage).setItem(storageKey, String(!checked));
                }
            }
        }
        /**
         * スイッチをクリックしたときの処理
         *
         * @param {MouseEvent} ev - Event
         */
        _clickEvent(ev) {
            this.dispatchEvent(new Event('change'));
            ev.preventDefault();
        }
        /**
         * スイッチにフォーカスした状態でキーボードが押された時の処理
         *
         * @param {KeyboardEvent} ev - Event
         */
        _keydownEvent(ev) {
            switch (ev.key) {
                case ' ':
                    this.dispatchEvent(new Event('change'));
                    ev.preventDefault();
                    break;
            }
        }
    }
    _myLocalStorage = new WeakMap(), _changeEventListener = new WeakMap(), _clickEventListener = new WeakMap(), _keydownEventListener = new WeakMap();
    if (document.querySelector(':is(.search-container, .user-details) .items-box-content, .category-brand-list.items-box-content') !== null) {
        const SWITCH_TAG_NAME = 'input-switch'; // <input type="switch"> のカスタム要素名
        const STORAGE_KEY_ON_SALE = 'search-status-on-sale'; // 販売中商品の切り替え時のストレージキー
        const STORAGE_KEY_SOLD_OUT = 'search-status-sold-out'; // 売り切れ商品の切り替え時のストレージキー
        const CLASSNAME_STATUS_ATRA = 'w0s-search-status-area'; // 売り切れ商品の表示切り替えボタンのクラス名
        const CLASSNAME_ITEMS_BOX_SOLDOUT = '-soldout'; // 売り切れ商品のアイテムボックスに付与するクラス名
        /* CSS */
        const CSS = `
			/* float: left を display: grid に変換 */
			:is(.search-container, .user-details) .items-box-content,
			.category-brand-list.items-box-content {
				display: grid;
				grid-gap: 10px;
				grid-template-columns: repeat(auto-fit, minmax(100px, .1667fr));
			}
			@media screen and (min-width: 768px) {
				:is(.search-container, .user-details) .items-box-content,
				.category-brand-list.items-box-content {
					grid-gap: 20px;
				}

				.search-container .items-box-content {
					grid-template-columns: repeat(auto-fit, minmax(160px, .25fr));
				}

				.user-details .items-box-content {
					grid-template-columns: repeat(auto-fit, minmax(220px, .3333fr));
				}

				.category-brand-list.items-box-content {
					grid-template-columns: repeat(auto-fit, minmax(188px, .25fr));
				}
			}

			:is(.search-container, .category-brand-list, .user-details) .items-box {
				float: none;
				width: auto;
				max-width: none;
			}
			:is(.search-container, .category-brand-list, .user-details) .items-box[hidden] {
				display: none !important;
			}

			:is(.search-container, .category-brand-list, .user-details) :is(.items-box, .items-box:nth-child(2n+1), .items-box:nth-child(3n)) {
				margin: 0;
			}

			:is(.search-container, .category-brand-list, .user-details) .items-box-photo {
				width: auto;
				height: auto;
			}

			:is(.search-container, .category-brand-list, .user-details) .items-box-photo img {
				height: auto;
			}

			/* 「販売中」「売り切れ」表示切り替え機能 */
			.${CLASSNAME_STATUS_ATRA} {
				margin: 32px 4%;
				display: flex;
				flex-wrap: wrap;
				gap: .5em 2.5em;
			}
			@media screen and (min-width: 768px) {
				.${CLASSNAME_STATUS_ATRA} {
					margin-left: 0;
					margin-right: 0;
				}
			}

			.${CLASSNAME_STATUS_ATRA} label {
				display: flex;
				align-items: center;
				gap: 0 .5em;
			}
		`;
        customElements.define(SWITCH_TAG_NAME, InputSwitch);
        /* スタイルを CSS で設定 */
        const styleElement = document.createElement('style');
        styleElement.textContent = CSS;
        document.head.appendChild(styleElement);
        /* 売り切れ商品のアイテムボックスにクラス名を付与して区別する */
        for (const itemsBoxElement of document.querySelectorAll('.items-box')) {
            if (itemsBoxElement.querySelector('.item-sold-out-badge') !== null) {
                itemsBoxElement.classList.add(CLASSNAME_ITEMS_BOX_SOLDOUT);
            }
        }
        if (document.querySelector(`.items-box:not(.${CLASSNAME_ITEMS_BOX_SOLDOUT})`) !== null &&
            document.querySelector(`.items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`) !== null) {
            let statusOnSale = true;
            let statusSoldOut = true;
            let storageValueOnSale = null;
            let storageValueSoldOut = null;
            try {
                storageValueOnSale = localStorage.getItem(STORAGE_KEY_ON_SALE);
                storageValueSoldOut = localStorage.getItem(STORAGE_KEY_SOLD_OUT);
            }
            catch (e) {
                /* Storage access blocked. */
            }
            switch (storageValueOnSale) {
                case 'true':
                    statusOnSale = true;
                    break;
                case 'false':
                    statusOnSale = false;
                    break;
            }
            switch (storageValueSoldOut) {
                case 'true':
                    statusSoldOut = true;
                    break;
                case 'false':
                    statusSoldOut = false;
                    break;
            }
            /* 検索画面は URL パラメーターによって「販売中」「売り切れ」の表示初期値を変える */
            if (document.querySelector('.search-container') !== null) {
                const urlParams = new URL(document.location.toString()).searchParams;
                if (storageValueOnSale === null) {
                    statusOnSale = urlParams.get('status_on_sale') === '1';
                }
                if (storageValueSoldOut === null) {
                    statusSoldOut = urlParams.get('status_trading_sold_out') === '1';
                }
                if (!statusOnSale && !statusSoldOut) {
                    statusOnSale = true;
                    statusSoldOut = true;
                }
            }
            const statusCtrlAreaElement = document.createElement('div');
            statusCtrlAreaElement.className = CLASSNAME_STATUS_ATRA;
            document.querySelector('.items-box-container h1, .items-box-container h2')?.insertAdjacentElement('afterend', statusCtrlAreaElement);
            /* 販売中商品の表示切り替え */
            const changeOnSale = (hidden) => {
                for (const itemsBoxOnSaleElement of document.querySelectorAll(`.items-box:not(.${CLASSNAME_ITEMS_BOX_SOLDOUT})`)) {
                    itemsBoxOnSaleElement.hidden = hidden;
                }
            };
            if (!statusOnSale) {
                changeOnSale(true);
            }
            const statusOnSaleLabelElement = document.createElement('label');
            statusOnSaleLabelElement.textContent = '販売中商品を表示';
            statusCtrlAreaElement.appendChild(statusOnSaleLabelElement);
            const statusOnSaleSwitchElement = document.createElement(SWITCH_TAG_NAME);
            statusOnSaleSwitchElement.checked = statusOnSale;
            statusOnSaleSwitchElement.setAttribute('storage-key', STORAGE_KEY_ON_SALE);
            statusOnSaleSwitchElement.addEventListener('change', () => {
                changeOnSale(statusOnSaleSwitchElement.checked);
            }, { passive: true });
            statusOnSaleLabelElement.insertAdjacentElement('afterbegin', statusOnSaleSwitchElement);
            /* 売り切れ商品の表示切り替え */
            const changeSoldOut = (checked) => {
                for (const itemsBoxSoldoutElement of document.querySelectorAll(`.items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`)) {
                    itemsBoxSoldoutElement.hidden = checked;
                }
            };
            if (!statusSoldOut) {
                changeSoldOut(true);
            }
            const statusSoldOutLabelElement = document.createElement('label');
            statusSoldOutLabelElement.textContent = '売り切れ商品を表示';
            statusCtrlAreaElement.appendChild(statusSoldOutLabelElement);
            const statusSoldOutSwitchElement = document.createElement(SWITCH_TAG_NAME);
            statusSoldOutSwitchElement.checked = statusSoldOut;
            statusSoldOutSwitchElement.setAttribute('storage-key', STORAGE_KEY_SOLD_OUT);
            statusSoldOutSwitchElement.addEventListener('change', () => {
                changeSoldOut(statusSoldOutSwitchElement.checked);
            }, { passive: true });
            statusSoldOutLabelElement.insertAdjacentElement('afterbegin', statusSoldOutSwitchElement);
        }
    }
})();
