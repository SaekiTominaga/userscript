// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で「販売中」「売り切れ」の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     3.0.0
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
	/**
	 * <input type="switch">
	 *
	 * @example
	 * <x-input-switch
	 *   checked="[Optional] Whether the control is checked."
	 *   disabled="[Optional] Whether the form control is disabled."
	 *   storage-key="[Optional] Save this value as localStorage key when switching controls. (value is `true` or `false` depending on the check state)"
	 * </x-input-switch>
	 *
	 * @version 2.0.5
	 */
	var t,e,i,s,n=this&&this.__classPrivateFieldSet||function(t,e,i){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,i),i},a=this&&this.__classPrivateFieldGet||function(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)};class InputSwitch extends HTMLElement{constructor(){super(),t.set(this,null),e.set(this,void 0),i.set(this,void 0),s.set(this,void 0);try{n(this,t,localStorage)}catch(t){console.info("Storage access blocked.")}const a='\n\t\t\t:host {\n\t\t\t\t--switch-width: 3.6em; /* 外枠の幅 */\n\t\t\t\t--switch-height: 1.8em; /* 外枠の高さ */\n\t\t\t\t--switch-padding: .2em; /* 外枠と球の間隔（マイナス値指定可能） */\n\t\t\t\t--switch-bgcolor-on: #29f; /* オンの時の背景色 */\n\t\t\t\t--switch-bgcolor-off: #ccc; /* オフの時の背景色 */\n\t\t\t\t--switch-bgcolor-disabled-on: #666; /* [disabled] オンの時の背景色 */\n\t\t\t\t--switch-bgcolor-disabled-off: #666; /* [disabled] オフの時の背景色 */\n\t\t\t\t--switch-ball-color: #fff; /* スライダーの球の色（background プロパティ） */\n\t\t\t\t--switch-animation-duration: .5s; /* アニメーションに掛かる時間（transition-duration プロパティ） */\n\t\t\t\t--switch-outline-mouse-focus: none; /* マウスフォーカス時のフォーカスインジゲーター（outline プロパティ） */\n\n\t\t\t\tposition: relative;\n\t\t\t\tdisplay: inline-block;\n\t\t\t\twidth: var(--switch-width);\n\t\t\t\theight: var(--switch-height);\n\t\t\t}\n\n\t\t\t:host(:focus:not(:focus-visible)) {\n\t\t\t\toutline: var(--switch-outline-mouse-focus);\n\t\t\t}\n\n\t\t\t.slider {\n\t\t\t\t--switch-bgcolor: var(--switch-bgcolor-off);\n\n\t\t\t\tborder-radius: var(--switch-height);\n\t\t\t\tposition: absolute;\n\t\t\t\tinset: 0;\n\t\t\t\tbackground: var(--switch-bgcolor);\n\t\t\t\ttransition: background var(--switch-animation-duration);\n\t\t\t}\n\n\t\t\t@supports not (inset: 0) {\n\t\t\t\t.slider {\n\t\t\t\t\ttop: 0;\n\t\t\t\t\tright: 0;\n\t\t\t\t\tbottom: 0;\n\t\t\t\t\tleft: 0;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t.slider::before {\n\t\t\t\t--switch-ball-diameter: calc(var(--switch-height) - var(--switch-padding) * 2);\n\t\t\t\t--switch-ball-transform: translateX(0);\n\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tcontent: "";\n\t\t\t\twidth: var(--switch-ball-diameter);\n\t\t\t\theight: var(--switch-ball-diameter);\n\t\t\t\tposition: absolute;\n\t\t\t\tinset: var(--switch-padding);\n\t\t\t\tbackground: var(--switch-ball-color);\n\t\t\t\ttransform: var(--switch-ball-transform);\n\t\t\t\ttransition: transform var(--switch-animation-duration);\n\t\t\t}\n\n\t\t\t@supports not (inset: 0) {\n\t\t\t\t.slider::before {\n\t\t\t\t\ttop: var(--switch-padding);\n\t\t\t\t\tleft: var(--switch-padding);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t:host([checked]) .slider {\n\t\t\t\t--switch-bgcolor: var(--switch-bgcolor-on);\n\t\t\t}\n\n\t\t\t:host([checked]) .slider::before {\n\t\t\t\t--switch-ball-transform: translateX(calc(var(--switch-width) - var(--switch-height)));\n\t\t\t}\n\n\t\t\t:host([disabled]) .slider {\n\t\t\t\t--switch-bgcolor: var(--switch-bgcolor-disabled-off);\n\t\t\t}\n\t\t\t:host([disabled][checked]) .slider {\n\t\t\t\t--switch-bgcolor: var(--switch-bgcolor-disabled-on);\n\t\t\t}\n\t\t',r=this.attachShadow({mode:"open"});if(r.innerHTML='\n\t\t\t<span class="slider"></span>\n\t\t',void 0!==r.adoptedStyleSheets){const t=new CSSStyleSheet;t.replaceSync(a),r.adoptedStyleSheets=[t]}else r.innerHTML+=`<style>${a}</style>`;n(this,e,this._changeEvent.bind(this)),n(this,i,this._clickEvent.bind(this)),n(this,s,this._keydownEvent.bind(this))}static get formAssociated(){return!0}static get observedAttributes(){return["checked","disabled","storage-key"]}connectedCallback(){const n=this.checked,r=this.disabled;if(null!==a(this,t)){const e=this.storageKey;if(null!==e&&""!==e){switch(a(this,t).getItem(e)){case"true":n||(this.checked=!0);break;case"false":n&&(this.checked=!1)}}}this.tabIndex=r?-1:0,this.setAttribute("role","switch"),this.setAttribute("aria-checked",String(n)),this.setAttribute("aria-disabled",String(r)),r||(this.addEventListener("change",a(this,e),{passive:!0}),this.addEventListener("click",a(this,i)),this.addEventListener("keydown",a(this,s)))}disconnectedCallback(){this.removeEventListener("change",a(this,e)),this.removeEventListener("click",a(this,i)),this.removeEventListener("keydown",a(this,s))}attributeChangedCallback(t,n,r){switch(t){case"checked":{const t=null!==r;this.setAttribute("aria-checked",String(t));break}case"disabled":{const t=null!==r;this.setAttribute("aria-disabled",String(t)),t?(this.tabIndex=-1,this.removeEventListener("change",a(this,e)),this.removeEventListener("click",a(this,i)),this.removeEventListener("keydown",a(this,s)),this.blur()):(this.tabIndex=0,this.addEventListener("change",a(this,e),{passive:!0}),this.addEventListener("click",a(this,i)),this.addEventListener("keydown",a(this,s)));break}}}get checked(){return null!==this.getAttribute("checked")}set checked(t){if("boolean"!=typeof t)throw new TypeError(`Only a boolean value can be specified for the \`checked\` attribute of the <${this.localName}> element.`);t?this.setAttribute("checked",""):this.removeAttribute("checked")}get disabled(){return null!==this.getAttribute("disabled")}set disabled(t){if("boolean"!=typeof t)throw new TypeError(`Only a boolean value can be specified for the \`disabled\` attribute of the <${this.localName}> element.`);t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get storageKey(){return this.getAttribute("storage-key")}set storageKey(t){if(null!==t){if("string"!=typeof t)throw new TypeError(`Only a string value can be specified for the \`storage-key\` attribute of the <${this.localName}> element.`);this.setAttribute("storage-key",t)}else this.removeAttribute("storage-key")}_changeEvent(){const e=this.checked;if(this.checked=!e,null!==a(this,t)){const i=this.storageKey;null!==i&&""!==i&&a(this,t).setItem(i,String(!e))}}_clickEvent(t){this.dispatchEvent(new Event("change")),t.preventDefault()}_keydownEvent(t){switch(t.key){case" ":this.dispatchEvent(new Event("change")),t.preventDefault()}}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap;

	if (document.querySelector(':is(.search-container, .user-details) .items-box-content, .category-brand-list.items-box-content') !== null) {
		const SWITCH_TAG_NAME = 'w0s-input-switch'; // <input type="switch"> のカスタム要素名

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

		customElements.define(
			SWITCH_TAG_NAME, InputSwitch
		);

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
			let statusOnSale = true;
			let statusSoldOut = true;

			let storageValueOnSale = null;
			let storageValueSoldOut = null;

			try {
				storageValueOnSale = localStorage.getItem(STORAGE_KEY_ON_SALE);
				storageValueSoldOut = localStorage.getItem(STORAGE_KEY_SOLD_OUT);
			} catch(e) {
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
				const urlParams = (new URL(document.location)).searchParams;

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
			document.querySelector('.items-box-container h1, .items-box-container h2').insertAdjacentElement('afterend', statusCtrlAreaElement);

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
			statusOnSaleSwitchElement.addEventListener('change', (ev) => {
				changeOnSale(ev.target.checked);
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
			statusSoldOutSwitchElement.addEventListener('change', (ev) => {
				changeSoldOut(ev.target.checked);
			}, { passive: true });
			statusSoldOutLabelElement.insertAdjacentElement('afterbegin', statusSoldOutSwitchElement);
		}
	}
})();
