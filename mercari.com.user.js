// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @description 「メルカリ」の商品検索で売り切れ商品の表示切り替え機能を追加する
// @author      SaekiTominaga
// @version     1.0.1
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
	/* 売り切れ商品が1件以上存在する場合のみ処理を行う */
	if (document.querySelector('.search-container .items-box .item-sold-out-badge') !== null) {
		/* 売り切れ商品の表示切り替えボタンのクラス名 */
		const CLASSNAME_SALE_SWITCH_BUTTON = 'search-result-sale-swich-button';

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
			}
			.items-box {
				float: none;
			}
			.search-container .items-box {
				width: auto;
			}
			.search-container .items-box,
			.search-container .items-box:nth-child(2n+1),
			.search-container .items-box:nth-child(3n) {
				margin: 0;
			}

			/* 売り切れ商品の表示切り替えボタン */
			.${CLASSNAME_SALE_SWITCH_BUTTON} {
				margin: 0 4%;
				padding: .75em;
				border: 1px solid #ccc;
				border-radius: 4px;
				display: inline-block;
				background: #fff;
			}
			@media screen and (min-width: 768px) {
				.${CLASSNAME_SALE_SWITCH_BUTTON} {
					margin: 0;
				}
			}
			.${CLASSNAME_SALE_SWITCH_BUTTON}:hover {
				background-color: #fafafa;
			}
		`;

		/* 売り切れ商品の表示切り替えボタン */
		const saleSwitchButtonElement = document.createElement('button');
		saleSwitchButtonElement.type = 'button';
		saleSwitchButtonElement.textContent = '売り切れ商品を非表示にする';
		saleSwitchButtonElement.dataset.text = '売り切れ商品を表示する';
		saleSwitchButtonElement.className = CLASSNAME_SALE_SWITCH_BUTTON;
		saleSwitchButtonElement.addEventListener('click', (ev) => {
			const saleSwitchButtonElement = ev.target;
			const text = saleSwitchButtonElement.dataset.text
			saleSwitchButtonElement.dataset.text = saleSwitchButtonElement.textContent;
			saleSwitchButtonElement.textContent = text;

			for (const itemsBoxSoldoutElement of document.querySelectorAll(`.search-container .items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`)) {
				itemsBoxSoldoutElement.hidden = !itemsBoxSoldoutElement.hidden;
			}
		});
		document.querySelector('.search-result-head').insertAdjacentElement('afterend', saleSwitchButtonElement);

		/* 売り切れ商品のアイテムボックスにクラス名を付与して区別する */
		for (const itemsBoxElement of document.querySelectorAll('.search-container .items-box')) {
			if (itemsBoxElement.querySelector('.item-sold-out-badge') !== null) {
				itemsBoxElement.classList.add(CLASSNAME_ITEMS_BOX_SOLDOUT);
			}
		}

		/* スタイルを CSS で設定 */
		const styleElement = document.createElement('style');
		styleElement.textContent = CSS;
		document.head.appendChild(styleElement);
	}
})();
