// ==UserScript==
// @name        Amazon.co.jp
// @namespace   https://w0s.jp/
// @description 「Amazon.co.jp」のリンク改善
// @author      SaekiTominaga
// @version     1.0.0
// @match       https://www.amazon.co.jp/*
// ==/UserScript==
(() => {
	'use strict';

	/* outline: none を制裁 */
	for (const anchorElement of document.querySelectorAll('.s-no-outline')) {
		anchorElement.classList.remove('s-no-outline');
	}

	/* リンクが別タブで開かれるのを防ぐ */
	for (const anchorElement of document.querySelectorAll('a[target="_blank"]')) {
		anchorElement.removeAttribute('target');
	}
})();
