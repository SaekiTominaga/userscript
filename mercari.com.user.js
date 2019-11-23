// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で「販売中」「売り切れ」の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     2.2.0
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
	 *   storage-key="【任意】コントロールを切り替えたとき localStorage に保存する">
	 * </x-input-switch>
	 *
	 * @version 1.2.0 2019-11-23 formAssociated() 実装
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

			this.attachShadow({mode: 'open'}).innerHTML = `
				<style>
					:host {
						--switch-width: 3.6em; /* 外枠の幅 */
						--switch-height: 1.8em; /* 外枠の高さ */
						--switch-padding: .2em; /* 外枠と円の間隔 */
						--switch-color-on: #29f; /* オンの時の背景色 */
						--switch-color-off: #ccc; /* オフの時の背景色 */
						--switch-animation-duration: .5s; /* アニメーションに掛かる時間 */

						display: inline-block;
						position: relative;
						height: var(--switch-height);
						width: var(--switch-width);
						vertical-align: top;
					}

					.slider {
						--switch-color: var(--switch-color-off);

						border-radius: var(--switch-height);
						height: var(--switch-height);
						width: var(--switch-width);
						position: absolute;
						top: 0;
						left: 0;
						background: var(--switch-color);
						transition: background-color var(--switch-animation-duration);
					}

					.slider::before {
						--switch-circle-diameter: calc(var(--switch-height) - var(--switch-padding) * 2);

						border-radius: 50%;
						content: "";
						height: var(--switch-circle-diameter);
						width: var(--switch-circle-diameter);
						position: absolute;
						left: var(--switch-padding);
						top: var(--switch-padding);
						background: #fff;
						transition: transform var(--switch-animation-duration);
					}

					:host([checked]) .slider {
						--switch-color: var(--switch-color-on);
					}

					:host([checked]) .slider::before {
						transform: translateX(calc(3.6em - 1.8em)); /* TODO Edge 18 はここにカスタムプロパティを使うと認識されない */
					}
				</style>
				<span class="slider"></span>
			`;

			this._changeEventListener = this._changeEvent.bind(this);

			this.setAttribute('role', 'switch');
		}

		connectedCallback() {
			const hostElement = this;

			const storageKey = this.getAttribute('storage-key');
			this._storageKey = storageKey;

			if (storageKey !== null && storageKey !== '') {
				/* ストレージから前回アクセス時のチェック情報を取得する */
				try {
					const storageValue = this._myLocalStorage.getItem(storageKey);
					switch (storageValue) {
						case 'true':
							hostElement.checked = true;
							break;
						case 'false':
							hostElement.checked = false;
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
