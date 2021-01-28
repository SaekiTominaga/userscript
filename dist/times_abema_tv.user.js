// ==UserScript==
// @name        ABEMA TIMES
// @namespace   https://w0s.jp/
// @description 「ABEMA TIMES」の記事ページをスクリプト無効環境でも閲覧できるようにする（通常のページは Internet Archive への保存ができないという事情もある）
// @author      SaekiTominaga
// @version     1.1.0
// @match       https://times.abema.tv/news-article/*
// ==/UserScript==
(() => {
    'use strict';
    const urlSearchParams = new URLSearchParams(location.search);
    if (!urlSearchParams.has('mobileapp')) {
        urlSearchParams.append('mobileapp', '1');
        location.replace(`?${urlSearchParams.toString()}`);
    }
})();
