// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で「販売中」「売り切れ」の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     2.3.0
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
	/**
	 * <input type="switch">
	 *
	 * @example
	 * <x-input-switch
	 *   checked="【任意】コントロールがチェックされているかどうか"
	 *   disabled="【任意】コントロールが無効であるかどうか"
	 *   storage-key="【任意】コントロールを切り替えたとき、この値を localStorage のキーとして保存する（値はチェック状態によって true / false のいずれかとなる）"
	 *   polyfill="【任意】`hidden`  : カスタム要素 v1 未対応ブラウザ（Microsoft Edge 44 等）では関連する <label> を含めて非表示にする
	 *                     `checkbox`: カスタム要素 v1 未対応ブラウザ（Microsoft Edge 44 等）では代替に <input type=checkbox> を生成する">
	 * </x-input-switch>
	 *
	 * @version 1.4.0 2020-02-04 初期表示で checked 状態を自動変更するとき、 change イベントを発生させるように変更
	 */
	class InputSwitch extends HTMLElement {
		static get observedAttributes() {
			return ['checked', 'disabled'];
		}

		static get formAssociated() {
			return true;
		}

		constructor() {
			super();

			try {
				this._myLocalStorage = localStorage;
			} catch(e) {
				console.info('Storage access blocked.');
			}

			const cssString = `
				:host {
					--width: 3.6em; /* 外枠の幅 */
					--height: 1.8em; /* 外枠の高さ */
					--padding: .2em; /* 外枠と円の間隔 */
					--color-on: #29f; /* オンの時の背景色 */
					--color-off: #ccc; /* オフの時の背景色 */
					--animation-duration: .5s; /* アニメーションに掛かる時間 */

					display: inline-block;
					position: relative;
					height: var(--height);
					width: var(--width);
					vertical-align: top;
				}

				.slider {
					--color: var(--color-off);

					border-radius: var(--height);
					height: var(--height);
					width: var(--width);
					position: absolute;
					top: 0;
					left: 0;
					background: var(--color);
					transition: background-color var(--animation-duration);
				}

				.slider::before {
					--circle-diameter: calc(var(--height) - var(--padding) * 2);

					border-radius: 50%;
					content: "";
					height: var(--circle-diameter);
					width: var(--circle-diameter);
					position: absolute;
					left: var(--padding);
					top: var(--padding);
					background: #fff;
					transition: transform var(--animation-duration);
				}

				:host([checked]) .slider {
					--color: var(--color-on);
				}

				:host([checked]) .slider::before {
					transform: translateX(calc(3.6em - 1.8em)); /* TODO Edge 18 はここにカスタムプロパティを使うと認識されない */
				}
			`;

			const shadow = this.attachShadow({mode: 'open'});
			shadow.innerHTML = `
				<span class="slider"></span>
			`;

			if (shadow.adoptedStyleSheets !== undefined) {
				const cssStyleSheet = new CSSStyleSheet();
				cssStyleSheet.replaceSync(cssString);

				shadow.adoptedStyleSheets = [cssStyleSheet];
			} else {
				/* adoptedStyleSheets 未対応環境 */
				shadow.innerHTML += `<style>${cssString}</style>`;
			}

			this._changeEventListener = this._changeEvent.bind(this);
		}

		connectedCallback() {
			const hostElement = this;

			hostElement.setAttribute('role', 'switch');

			const storageKey = hostElement.getAttribute('storage-key');
			this._storageKey = storageKey;

			if (storageKey !== null && storageKey !== '') {
				/* ストレージから前回アクセス時のチェック情報を取得する */
				try {
					const storageValue = this._myLocalStorage.getItem(storageKey);
					switch (storageValue) {
						case 'true':
							if (!hostElement.checked) {
								hostElement.checked = true;
								hostElement.dispatchEvent(new Event('change'));
							}
							break;
						case 'false':
							if (hostElement.checked) {
								hostElement.checked = false;
								hostElement.dispatchEvent(new Event('change'));
							}
							break;
					}
				} catch(e) {
					/* ストレージ無効環境やプライベートブラウジング時 */
				}
			}

			hostElement.setAttribute('aria-checked', hostElement.checked);
			if (!hostElement.disabled) {
				hostElement.tabIndex = 0;
			} else {
				hostElement.setAttribute('aria-disabled', 'true');
			}

			hostElement.addEventListener('click', this._changeEventListener);
			hostElement.addEventListener('keydown', this._changeEventListener);
		}

		disconnectedCallback() {
			const hostElement = this;

			hostElement.removeEventListener('click', this._changeEventListener);
			hostElement.removeEventListener('keydown', this._changeEventListener);
		}

		/**
		 * スイッチの状態を変更する
		 *
		 * @param {Event} ev - Event
		 */
		_changeEvent(ev) {
			const hostElement = this;

			const exec = (hostElement) => {
				if (!hostElement.disabled) {
					const checked = !hostElement.checked;

					hostElement.checked = checked;
					hostElement.dispatchEvent(new Event('change'));

					const storageKey = this._storageKey;
					if (storageKey !== null && storageKey !== '') {
						/* コントロールのチェック情報をストレージに保管する */
						try {
							this._myLocalStorage.setItem(storageKey, checked);
						} catch(e) {
							/* ストレージ無効環境やプライベートブラウジング時 */
						}
					}
				}
			}

			switch (ev.type) {
				case 'click':
					exec(hostElement);
					break;
				case 'keydown':
					switch (ev.key) {
						case ' ':
							exec(hostElement);
							ev.preventDefault();
							break;
					}
					break;
			}
		}

		attributeChangedCallback(name, oldValue, newValue) {
			switch (name) {
				case 'checked': {
					const checked = newValue !== null;

					this.setAttribute('aria-checked', checked);
					break;
				}
				case 'disabled': {
					const disabled = newValue !== null;

					if (disabled) {
						this.removeAttribute('tabindex');
						this.blur();
					} else {
						this.tabIndex = 0;
					}
					this.setAttribute('aria-disabled', disabled);
					break;
				}
			}
		}

		get checked() {
			return this.getAttribute('checked') !== null;
		}
		set checked(value) {
			if (typeof value !== 'boolean') {
				console.warn('Only a boolean value can be specified for the `checked` attribute of the <x-input-switch> element.');
				return;
			}

			if (value) {
				this.setAttribute('checked', '');
			} else {
				this.removeAttribute('checked');
			}
		}

		get disabled() {
			return this.getAttribute('disabled') !== null;
		}
		set disabled(value) {
			if (typeof value !== 'boolean') {
				console.warn('Only a boolean value can be specified for the `disabled` attribute of the <x-input-switch> element.');
				return;
			}

			if (value) {
				this.setAttribute('disabled', '');
			} else {
				this.removeAttribute('disabled');
			}
		}
	}

	if (document.querySelector('.items-box-content') !== null) {
		customElements.define(
			'w0s-input-switch', InputSwitch
		);

		/* 売り切れ商品の表示切り替えボタンのクラス名 */
		const CLASSNAME_STATUS_ATRA = 'w0s-search-status-area';

		/* 売り切れ商品のアイテムボックスに付与するクラス名 */
		const CLASSNAME_ITEMS_BOX_SOLDOUT = '-soldout';

		/* CSS */
		const CSS = `
			/* float: left を display: grid に変換 */
			.items-box-content {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(100px ,1fr));
				grid-gap: 4px;
			}
			@media screen and (min-width: 768px) {
				.items-box-content {
					grid-template-columns: repeat(auto-fit, minmax(160px ,1fr));
					grid-gap: 20px;
				}

				.user-details .items-box-content {
					grid-template-columns: repeat(auto-fit, minmax(220px ,1fr));
				}
			}
			.items-box[hidden] {
				display: none !important;
			}
			.items-box,
			.items-box-overflow .items-box {
				float: none;
			}
			@media screen and (max-width: 767px) {
				.search-container .items-box,
				.category-brand-list .items-box,
				.items-box-overflow .items-box {
					width: auto;
				}
			}
			.search-container .items-box,
			.search-container .items-box:nth-child(2n+1),
			.search-container .items-box:nth-child(3n),
			.category-brand-list .items-box,
			.category-brand-list .items-box:nth-child(2n+1),
			.category-brand-list .items-box:nth-child(3n),
			.items-box-overflow .items-box,
			.items-box-overflow .items-box:nth-child(2n+1),
			.items-box-overflow .items-box:nth-child(3n) {
				margin: 0;
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

		let statusOnSale = true;
		let statusSoldOut = true;

		/* 検索画面はURLパラメーターによって「販売中」「売り切れ」の表示初期値を変える */
		if (document.querySelector('.search-container') !== null) {
			const urlParams = (new URL(document.location)).searchParams;
			statusOnSale = urlParams.get('status_on_sale') === '1';
			statusSoldOut = urlParams.get('status_trading_sold_out') === '1';

			if (!statusOnSale && !statusSoldOut) {
				statusOnSale = true;
				statusSoldOut = true;
			}
		}

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

		if (document.querySelector(`.items-box:not(.${CLASSNAME_ITEMS_BOX_SOLDOUT})`) !== null && document.querySelector(`.items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`) !== null) {
			const statusCtrlAreaElement = document.createElement('div');
			statusCtrlAreaElement.className = CLASSNAME_STATUS_ATRA;
			document.querySelector('.items-box-container h1, .items-box-container h2').insertAdjacentElement('afterend', statusCtrlAreaElement);

			/* 販売中商品の表示切り替え */
			const statusOnSaleLabelElement = document.createElement('label');
			statusOnSaleLabelElement.textContent = '販売中商品を表示';
			statusCtrlAreaElement.appendChild(statusOnSaleLabelElement);

			const statusOnSaleSwitchElement = document.createElement('w0s-input-switch');
			statusOnSaleSwitchElement.checked = statusOnSale;
			statusOnSaleSwitchElement.setAttribute('storage-key', 'search-status-on-sale');
			statusOnSaleSwitchElement.addEventListener('change', (ev) => {
				const checked = ev.target.checked;
				for (const itemsBoxOnSaleElement of document.querySelectorAll(`.items-box:not(.${CLASSNAME_ITEMS_BOX_SOLDOUT})`)) {
					itemsBoxOnSaleElement.hidden = !checked;
				}
			});
			statusOnSaleLabelElement.insertAdjacentElement('afterbegin', statusOnSaleSwitchElement);

			/* 売り切れ商品の表示切り替え */
			const statusSoldOutLabelElement = document.createElement('label');
			statusSoldOutLabelElement.textContent = '売り切れ商品を表示';
			statusCtrlAreaElement.appendChild(statusSoldOutLabelElement);

			const statusSoldOutSwitchElement = document.createElement('w0s-input-switch');
			statusSoldOutSwitchElement.checked = statusSoldOut;
			statusSoldOutSwitchElement.setAttribute('storage-key', 'search-status-sold-out');
			statusSoldOutSwitchElement.addEventListener('change', (ev) => {
				const checked = ev.target.checked;
				for (const itemsBoxSoldoutElement of document.querySelectorAll(`.items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`)) {
					itemsBoxSoldoutElement.hidden = !checked;
				}
			});
			statusSoldOutLabelElement.insertAdjacentElement('afterbegin', statusSoldOutSwitchElement);
		}
	}
})();
