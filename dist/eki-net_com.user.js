// ==UserScript==
// @name        Ekinet
// @namespace   https://w0s.jp/
// @grant       GM_getValue
// @description 「えきねっと」のフォームUIを改善する
// @author      SaekiTominaga
// @version     1.0.1
// @match       https://www.eki-net.com/*
// ==/UserScript==
(() => {
    'use strict';
    /* 人数欄の初期設定（ユーザースクリプトの設定画面からこの定数名と同名のキーを設定することでカスタマイズ可能です） */
    const PEOPLE_NUMBER_SETTING = {
        adult: 1 /* おとな（こどもと合わせて最大14人） */,
        child: 0 /* こども（おとなと合わせて最大14人） */,
    };
    /* CSS */
    const CSS = `
		/* 月日のプルダウンやカレンダーボタンはユーザースクリプトで別途 <input type="date"> を表示するため不要 */
		#calendar1,
		#PlGetOnMonth,
		label[for="PlGetOnMonth"],
		#PlGetOnDay,
		label[for="PlGetOnDay"] {
			display: none;
		}
	`;
    const supportGMgetValue = window.GM_getValue !== undefined; // GM_getValue() をサポートしているか
    /* 【条件指定フォーム】日付入力欄を <input type="date"> に */
    const monthElement = document.getElementById('PlGetOnMonth');
    const dayElement = document.getElementById('PlGetOnDay');
    if (monthElement !== null && dayElement !== null) {
        console.info('【条件指定フォーム】日付入力欄を <input type="date"> に');
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(today.getMonth() + 1); // 1か月後
        const datepickerElement = document.createElement('input');
        datepickerElement.type = 'date';
        datepickerElement.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        datepickerElement.required = true;
        datepickerElement.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        datepickerElement.max = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        datepickerElement.className = 'txt24b';
        datepickerElement.addEventListener('change', () => {
            let value = datepickerElement.value;
            if (value === '') {
                value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getDate()}`; // クリアボタンが押された場合は現在日付にする
                datepickerElement.value = value;
            }
            const valueSplit = value.split('-');
            const mm = String(Number(valueSplit[1])); // 先頭 0 除去
            const dd = String(Number(valueSplit[2])); // 先頭 0 除去
            monthElement.value = mm;
            dayElement.value = dd;
        });
        monthElement.insertAdjacentElement('beforebegin', datepickerElement);
    }
    /* 【条件指定フォーム】時刻プルダウンを編集 */
    const timeElement = document.getElementById('PlGetOnTime');
    const hourElement = document.getElementById('PlGetOnHour');
    if (timeElement !== null || hourElement !== null) {
        console.info('【条件指定フォーム】時刻プルダウンを編集');
        const targetElement = (timeElement !== null ? timeElement : hourElement);
        /* 空のプルダウンと深夜帯を削除 */
        for (const optionElement of targetElement.querySelectorAll('option')) {
            if (optionElement.value === '') {
                optionElement.remove();
            }
            const value = Number(optionElement.value);
            if (value >= 0 && value <= 4) {
                optionElement.remove();
            }
        }
        /* 0時（24時）は末尾に移動する */
        const optionElement = document.createElement('option');
        optionElement.value = '00';
        optionElement.textContent = '24';
        targetElement.insertAdjacentElement('beforeend', optionElement);
    }
    /* 【人数入力フォーム】人数欄の初期設定 */
    const adultNumberElement = document.getElementById('TxtAdultNumber');
    const childNumberElement = document.getElementById('TxtChildNumber');
    if (adultNumberElement !== null && childNumberElement !== null) {
        console.info('【条件指定画面】人数欄の初期設定');
        const peopleNumberSetting = supportGMgetValue ? window.GM_getValue('PEOPLE_NUMBER_SETTING', PEOPLE_NUMBER_SETTING) : PEOPLE_NUMBER_SETTING;
        adultNumberElement.removeAttribute('maxlength');
        adultNumberElement.type = 'number';
        adultNumberElement.min = '0';
        adultNumberElement.max = '14';
        adultNumberElement.value = peopleNumberSetting.adult;
        childNumberElement.removeAttribute('maxlength');
        childNumberElement.type = 'number';
        childNumberElement.min = '0';
        childNumberElement.max = '14';
        childNumberElement.value = peopleNumberSetting.child;
    }
    /* スタイルを CSS で設定 */
    const styleElement = document.createElement('style');
    styleElement.textContent = CSS;
    document.head.appendChild(styleElement);
})();
