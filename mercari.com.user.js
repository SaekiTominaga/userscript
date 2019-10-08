// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で「販売中」「売り切れ」の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     2.1.0
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
	/**
	 * <input type="switch">
	 *
	 * @example
	 * <x-input-switch
	 *   checked="【任意】コントロールがチェックされているかどうか"
	 *   disabled="【任意】コントロールが無効であるかどうか">
	 * </x-input-switch>
	 *
	 * @version 1.0.0 2019-10-08 新規作成
	 */
	class InputSwich extends HTMLElement {
		static get observedAttributes() {
			return ['checked', 'disabled'];
		}

		constructor() {
			super();

			this.attachShadow({mode: 'open'}).innerHTML = `
				<style>
					:host {
						--width: 3.6em; /* 外枠の幅 */
						--height: 1.8em; /* 外枠の高さ */
						--padding: .2em; /* 外枠と円の間隔 */
						--color-off: #ccc; /* オフの時の背景色 */
						--color-on: #29f; /* オンの時の背景色 */
						--animation-duration: .5s; /* アニメーションに掛かる時間 */

						display: inline-block;
						position: relative;
						height: var(--height);
						width: var(--width);
						vertical-align: top;
					}

					.slider {
						border-radius: var(--height);
						height: var(--height);
						width: var(--width);
						position: absolute;
						top: 0;
						left: 0;
						background: var(--color-off);
						transition: background-color var(--animation-duration);
					}

					.slider::before {
						border-radius: 50%;
						content: "";
						height: calc(var(--height) - var(--padding) * 2);
						width: calc(var(--height) - var(--padding) * 2);
						position: absolute;
						left: var(--padding);
						top: var(--padding);
						background: #fff;
						transition: transform var(--animation-duration);
					}

					:host([checked]) .slider {
						background-color: var(--color-on);
					}

					:host([checked]) .slider::before {
						transform: translateX(calc(3.6em - 1.8em)); /* TODO Edge 18 はここにカスタムプロパティを使うと認識されない */
					}
				</style>
				<span class="slider"></span>
			`;
		}

		connectedCallback() {
			const hostElement = this;

			hostElement.setAttribute('role', 'switch');
			hostElement.setAttribute('aria-checked', hostElement.checked);

			if (!hostElement.disabled) {
				hostElement.tabIndex = 0;
			} else {
				hostElement.setAttribute('aria-disabled', 'true');
			}

			const change = (hostElement) => {
				if (!hostElement.disabled) {
					hostElement.checked = !hostElement.checked;

					hostElement.dispatchEvent(new Event('change'));
				}
			}

			hostElement.addEventListener('click', (ev) => {
				change(ev.currentTarget);
			});
			hostElement.addEventListener('keydown', (ev) => {
				switch (ev.key) {
					case ' ':
						change(ev.currentTarget);
						ev.preventDefault();
						break;
				}
			});
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
			'w0s-input-switch', InputSwich
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
