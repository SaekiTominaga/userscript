// ==UserScript==
// @name        mozaic.fm
// @namespace   https://w0s.jp/
// @description Web podcast を Cookie 無効環境でも聴けるようにする
// @author      SaekiTominaga
// @version     1.0.1
// @match       https://mozaic.fm/*
// ==/UserScript==
(() => {
	'use strict';

	if (!navigator.cookieEnabled) {
		const mozaicPlayerAudioElement = <HTMLAudioElement | null>document.querySelector('mozaic-player > audio');
		if (mozaicPlayerAudioElement !== null) {
			mozaicPlayerAudioElement.controls = true;
			try {
				mozaicPlayerAudioElement.attributeStyleMap.set('width', CSS.percent(100));
			} catch (e) {
				/* CSS Typed Object Model 未対応環境（Firefox） */
				mozaicPlayerAudioElement.style.width = '100%';
			}
		}
	}
})();
