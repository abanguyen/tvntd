/**
 * Vy Nguyen (2016)
 */
'use strict';

export function Enum() {
    let args = arguments;
    let kv = {
        keys: args
    };
    for (let i = args.length; i--; ) {
        kv[args[i]] = i;
    }
    return kv;
};

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(str) {
    let returnText = "" + str;

    //-- remove BR tags and replace them with line break
    //returnText = returnText.replace(/<br>/gi, "\n");
    //returnText = returnText.replace(/<br\s\/>/gi, "\n");
    //returnText = returnText.replace(/<br\/>/gi, "\n");

    //-- remove P and A tags but preserve what's inside of them
    //returnText = returnText.replace(/<p.*?>/gi, "\n");
    //returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");

    //-- remove all else
    //returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    //returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of html-encoded characters:
    //returnText = returnText.replace(/&nbsp;/gi," ");
    //returnText = returnText.replace(/&amp;/gi,"&");
    //returnText = returnText.replace(/&quot;/gi,'"');
    //returnText = returnText.replace(/&lt;/gi,'<');
    //returnText = returnText.replace(/&gt;/gi,'>');

    return returnText;
}

/**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
 * return the index to insert into the sorted array.
 */
function _locationOf(elm, array, compareFn) {
    let cmp = 0;
    let minIdx = 0;
    let curIdx = 0;
    let maxIdx = array.length - 1;

    while (minIdx <= maxIdx) {
        curIdx = (minIdx + maxIdx) / 2 | 0;
        let pivot = array[curIdx];

        if (compareFn) {
            cmp = compareFn(pivot, elm);
        } else {
            if (pivot == elm) {
                cmp = 0;
            } else if (pivot < elm) {
                cmp = -1;
            } else {
                cmp = 1;
            }
        }
        if (cmp <= -1) {
            minIdx = curIdx + 1;
        } else if (cmp >= 1) {
            maxIdx = curIdx - 1;
        } else {
            return curIdx;
        }
    }
    if (cmp >= 1) {
        return (curIdx > 1 ? curIdx - 1 : 0);
    }
    return curIdx + 1;
}

function insertSorted(elm, array, compareFn) {
    if (array.length === 0) {
        return array.splice(0, 0, elm);
    }
    return array.splice(_locationOf(elm, array, compareFn), 0, elm);
}

function toDateString(milli) {
    if (milli) {
        let d = new Date(milli);
        return d.toString();
    }
    return 'No date';
}

function preend(elm, array) {
    let newArr = array.slice(0);
    newArr.unshift(elm);
    return newArr;
}

export { Enum, safeStringify, insertSorted, toDateString, preend, getRandomInt }
