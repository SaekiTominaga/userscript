// ==UserScript==
// @name        mozaic.fm
// @namespace   https://w0s.jp/
// @description Web podcast を Cookie 無効環境でも聴けるようにする
// @author      SaekiTominaga
// @version     1.0.0
// @match       https://mozaic.fm/*
// ==/UserScript==
(() => {
	if (!navigator.cookieEnabled) {
		const mozaicPlayerAudioElement = document.querySelector('mozaic-player > audio');
		if (mozaicPlayerAudioElement !== null) {
			mozaicPlayerAudioElement.controls = true;
			try {
				mozaicPlayerAudioElement.attributeStyleMap.set('width', CSS.percent(100));
			} catch(e) {
				/* CSS Typed Object Model 未対応環境（Chrome 65-, Firefox, Edge, IE 11） */
				mozaicPlayerAudioElement.style.width = '100%';
			}
		}
	}
})();
