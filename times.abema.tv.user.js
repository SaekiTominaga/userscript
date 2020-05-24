// ==UserScript==
// @name        ABEMA TIMES
// @namespace   https://w0s.jp/
// @description 「ABEMA TIMES」の記事ページをスクリプト無効環境でも閲覧できるようにする（通常のページは Internet Archive への保存ができないという事情もある）
// @author      SaekiTominaga
// @version     1.0.0
// @match       https://times.abema.tv/posts/*
// ==/UserScript==
(() => {
	const urlSearchParams = new URLSearchParams(location.search);
	if (urlSearchParams.has('mobileapp')) {
		const rootElement = document.documentElement;

		try {
			rootElement.attributeStyleMap.set('cursor', 'auto');
		} catch(e) {
			/* CSS Typed Object Model 未対応環境（Chrome 65-, Firefox, Edge, IE 11） */
			rootElement.style.cursor = 'auto';
		}
	} else {
		urlSearchParams.append('mobileapp', '1');

		location.replace(`?${urlSearchParams.toString()}`);
	}
})();
