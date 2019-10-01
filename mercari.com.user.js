// ==UserScript==
// @name        Mercari
// @namespace   https://w0s.jp/
// @grant       GM_getValue
// @description 「メルカリ」の商品検索で 販売中 / 売り切れ の切り替え機能を追加する
// @author      SaekiTominaga
// @version     1.0.0
// @match       https://www.mercari.com/*
// ==/UserScript==
(() => {
	/* 売り切れ商品が1件以上存在する場合のみ処理を行う */
	if (document.querySelector('.search-container .items-box .item-sold-out-badge') !== null) {
		/* 切り替えボタンのクラス名 */
		const CLASSNAME_SALE_SWITCH_BUTTON = 'search-result-sale-swich-button';

		/* 売り切れたアイテムボックスに付与するクラス名 */
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

			/* 切り替えボタン */
			.${CLASSNAME_SALE_SWITCH_BUTTON} {
				padding: .75em;
				border: 1px solid #ccc;
				border-radius: 4px;
				display: inline-block;
				background: #fff;
			}
			.${CLASSNAME_SALE_SWITCH_BUTTON}:hover {
				background-color: #fafafa;
			}
		`;

		const supportGMgetValue = window.GM_getValue !== undefined; // GM_getValue() をサポートしているか

		/* 売り切れ商品のアイテムボックスにクラス名を付与して区別する */
		const saleSwitchButtonElement = document.createElement('button');
		saleSwitchButtonElement.type = 'button';
		saleSwitchButtonElement.textContent = '販売中 / 売り切れ の表示を切り替える';
		saleSwitchButtonElement.className = CLASSNAME_SALE_SWITCH_BUTTON;
		saleSwitchButtonElement.addEventListener('click', () => {
			for (const itemsBoxSoldoutElement of document.querySelectorAll(`.search-container .items-box.${CLASSNAME_ITEMS_BOX_SOLDOUT}`)) {
				itemsBoxSoldoutElement.hidden = !itemsBoxSoldoutElement.hidden;
			}
		});
		document.querySelector('.search-result-head').insertAdjacentElement('afterend', saleSwitchButtonElement);

		/* 売り切れ商品のアイテムボックスにクラス名を付与して区別する */
		for (const itemsBoxElement of document.querySelectorAll('.search-container .items-box')) {
			if (itemsBoxElement.querySelector('.item-sold-out-badge') !== null) {
				/* 売り切れ商品 */
				itemsBoxElement.classList.add(CLASSNAME_ITEMS_BOX_SOLDOUT);
			}
		}

		/* スタイルを CSS で設定 */
		const styleElement = document.createElement('style');
		styleElement.textContent = CSS;
		document.head.appendChild(styleElement);
	}
})();
