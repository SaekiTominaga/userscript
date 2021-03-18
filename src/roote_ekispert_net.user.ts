// ==UserScript==
// @name        Ekispert for web
// @namespace   https://w0s.jp/
// @grant       GM_getValue
// @description 「駅すぱあと for web」のキーボード操作を改善する
// @author      SaekiTominaga
// @version     1.0.2
// @match       https://roote.ekispert.net/*
// ==/UserScript==

interface CourseSetting {
	sexp: boolean /* 新幹線 */;
	express: boolean /* 有料特急 */;
	local: boolean /* 路線バス */;
	highway: boolean /* 高速バス */;
	plane: boolean /* 飛行機 */;
	connect: boolean /* 連絡バス */;
	liner: boolean /* ライナー */;
	sleep: boolean /* 寝台列車 */;
	ship: boolean /* 海路 */;
}

(() => {
	'use strict';

	/* 交通手段の初期設定（ユーザースクリプトの設定画面からこの定数名と同名のキーを設定することでカスタマイズ可能です） */
	const COURSE_SETTING: CourseSetting = {
		sexp: true /* 新幹線 */,
		express: true /* 有料特急 */,
		local: true /* 路線バス */,
		highway: false /* 高速バス */,
		plane: false /* 飛行機 */,
		connect: true /* 連絡バス */,
		liner: true /* ライナー */,
		sleep: true /* 寝台列車 */,
		ship: false /* 海路 */,
	};

	/* CSS */
	const CSS = `
		:not([tabindex="-1"]):focus {
			outline: 2px solid #4d90fe;
		}

		/* 「検索」ボタン */
		#submit_btn {
			outline-offset: .1em;
		}

		#submit_btn::-moz-focus-inner {
			padding: 0;
			border: none;
		}

		/* 経路検索の入力欄 */
		#search_area #dep,
		#search_area #arr,
		#search_area #via1,
		#search_area #via2 {
			padding: .25em 0;
			position: relative;
			top: .2em;
			font-size: 150%;
		}

		/* 「経由」欄を最初から表示 */
		#search_area #via1_area,
		#search_area #via2_area {
			display: list-item;
		}

		/* 「経由」表示ボタンは不要なので消す */
		#search_area #via {
			display: none;
		}

		/* 日時のプルダウンやカレンダーボタンはユーザースクリプトで別途 <input type="date"> を表示するため不要 */
		#yyyymm,
		#day,
		.ui-datepicker-trigger {
			display: none;
		}

		#datepicker {
			margin-right: .5em;
			padding: .25em 0;
			font-size: 150%;
		}

		#search_area #hour,
		#search_area #minute10,
		#search_area #minute1 {
			font-size: 150%;
		}

		/* 「詳細設定」欄を最初から表示 */
		#option_area {
			display: list-item;
		}

		/* 「詳細設定」開閉ボタンは不要なので消す */
		#search_area #btn_option,
		#search_area #result_btn_option {
			display: none;
		}

		/* 「詳細設定」開閉ボタンを消した代わりに余白を付ける */
		#search_area #option_area {
			margin-top: 1em;
		}

		/* 「詳細設定」開閉ボタン関連のスタイルを消す */
		#search_area #option {
			background-image: none;
		}
	`;

	const supportGMgetValue = window.GM_getValue !== undefined; // GM_getValue() をサポートしているか

	/* 【検索画面】余計な tabindex 属性を除去する */
	for (const tabindexRemoveElement of document.querySelectorAll('#search_area input[tabindex]')) {
		tabindexRemoveElement.removeAttribute('tabindex');
	}

	/* 【検索画面】日付入力欄を <input type="date"> に */
	const yyyymmElement = <HTMLSelectElement | null>document.getElementById('yyyymm');
	const dayElement = <HTMLSelectElement | null>document.getElementById('day');
	const datepickerElement = <HTMLInputElement | null>document.getElementById('datepicker');
	if (yyyymmElement !== null && dayElement !== null && datepickerElement !== null) {
		console.info('【検索画面】日付入力欄を <input type="date"> に');

		const today = new Date();
		const maxDate = new Date();
		maxDate.setMonth(today.getMonth() + 3); // 3か月後

		datepickerElement.type = 'date';
		datepickerElement.required = true;
		datepickerElement.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getDate()}`;
		datepickerElement.max = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${maxDate.getDate()}`;
		datepickerElement.addEventListener('change', () => {
			let value = datepickerElement.value;
			if (value === '') {
				value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getDate()}`; // クリアボタンが押された場合は現在日付にする
				datepickerElement.value = value;
			}
			const valueSplit = value.split('-');
			const yyyymm = valueSplit[0] + valueSplit[1];
			const dd = String(Number(valueSplit[2])); // 先頭 0 除去

			yyyymmElement.value = yyyymm;
			dayElement.value = dd;
		});
	}

	/* 【検索画面】交通手段の初期設定 */
	const optionAreaElement = document.getElementById('option_area');
	if (optionAreaElement !== null) {
		console.info('【検索画面】交通手段の初期設定');

		const courseSetting: CourseSetting = supportGMgetValue ? window.GM_getValue('COURSE_SETTING', COURSE_SETTING) : COURSE_SETTING;
		for (const [courseName, checked] of Object.entries(courseSetting)) {
			const courseCheckboxElement = <HTMLInputElement | null>document.getElementById(courseName);
			if (courseCheckboxElement === null) {
				console.error(`Element: #${courseName} can not found.`);
				continue;
			}

			courseCheckboxElement.checked = <boolean>checked;
		}
	}

	/* 【経路検索画面】初期フォーカスを設定 */
	const courseElement = <HTMLElement | null>document.querySelector('#course_section h1 + #course');
	if (courseElement !== null) {
		console.info('【経路検索画面】初期フォーカスを設定');
		courseElement.tabIndex = -1;
		courseElement.focus();
	}

	/* スタイルを CSS で設定 */
	const styleElement = document.createElement('style');
	styleElement.textContent = CSS;
	document.head.appendChild(styleElement);
})();
