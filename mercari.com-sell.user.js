// ==UserScript==
// @name        MercariSell
// @namespace   https://w0s.jp/
// @description 「メルカリ」の出品ページを使いやすくする
// @author      SaekiTominaga
// @version     1.0.0
// @match       https://www.mercari.com/*/sell/
// ==/UserScript==
(() => {
	/* 出品情報のデフォルト値（ユーザースクリプトの設定画面からこの定数名と同名のキーを設定することでカスタマイズ可能） */
	const SELL_ITEM_CONDITION = '3'; // 【商品の状態】目立った傷や汚れなし
	const SELL_SHIPPING_PAYER = '2'; // 【配送料の負担】送料込み（出品者負担）
	const SELL_SHIPPING_FROMAREA = '13'; // 【発送元の地域】東京都
	const SELL_SHIPPING_DURATION = '2'; // 【発送までの日数】2～3日で発送

	/* 商品名（入力文字数をカウントする） */
	const nameElement = document.querySelector('input[name="name"]');
	if (nameElement !== null) {
		const nameValueLengthElement = document.createElement('div');
		nameElement.closest('div[class^="style_body__"]').appendChild(nameValueLengthElement);

		nameElement.addEventListener('input', () => {
			nameValueLengthElement.textContent = `${nameElement.value.length} / 40`;
		});
	}

	/* 商品の状態 */
	const itemConditionElement = document.querySelector('select[name="itemCondition"]');
	if (itemConditionElement !== null) {
		const optionElements = itemConditionElement.querySelectorAll('option');
		for (const optionElement of optionElements) {
			optionElement.selected = false;
			optionElement.removeAttribute('aria-selected');
		}

		Array.from(optionElements).find(optionElement => optionElement.value === SELL_ITEM_CONDITION).selected = true;
	}

	/* 配送料の負担 */
	const shippingPayerElement = document.querySelector('select[name="shippingPayer"]');
	if (shippingPayerElement !== null) {
		const optionElements = shippingPayerElement.querySelectorAll('option');
		for (const optionElement of optionElements) {
			optionElement.selected = false;
			optionElement.removeAttribute('aria-selected');
		}

		Array.from(optionElements).find(optionElement => optionElement.value === SELL_SHIPPING_PAYER).selected = true;
	}

	/* 発送元の地域 */
	const shippingFromAreaElement = document.querySelector('select[name="shippingFromArea"]');
	if (shippingFromAreaElement !== null) {
		const optionElements = shippingFromAreaElement.querySelectorAll('option');
		for (const optionElement of optionElements) {
			optionElement.selected = false;
			optionElement.removeAttribute('aria-selected');
		}

		Array.from(optionElements).find(optionElement => optionElement.value === SELL_SHIPPING_FROMAREA).selected = true;
	}

	/* 発送までの日数 */
	const shippingDurationElement = document.querySelector('select[name="shippingDuration"]');
	if (shippingDurationElement !== null) {
		const optionElements = shippingDurationElement.querySelectorAll('option');
		for (const optionElement of optionElements) {
			optionElement.selected = false;
			optionElement.removeAttribute('aria-selected');
		}

		Array.from(optionElements).find(optionElement => optionElement.value === SELL_SHIPPING_DURATION).selected = true;
	}

	/* 販売価格（ type="number" が使いにくいので type="text" にする） */
	const priceElement = document.querySelector('input[name="price"]');
	if (priceElement !== null) {
		priceElement.type = '';
		priceElement.pattern = '[0-9]{3,7}';
		priceElement.placeholder = '';
	}
})();
