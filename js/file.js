(function(global) {
    'use strict';

    var scriptElem = document.querySelector('.script');

    function saveLocal() {
        const script = scriptToJson();
        if (script) {
            localStorage._blockCode = script;
        } else {
            delete localStorage._blockCode;
        }
    }

    function scriptToJson() {
        const blocks = [].slice.call(document.querySelectorAll('.script > .block'));
        return blocks.length ? JSON.stringify(blocks.map(Block.script)) : null;
    }

    function jsonToScript(json) {
        clearScript();
        JSON.parse(json).forEach(function(block) {
            scriptElem.appendChild(Block.create.apply(null, block));
        });

        Menu.runSoon();
    }

    function restoreLocal() {
        jsonToScript(localStorage._blockCode || null);
    }

    function clearScript() {
        [].slice.call(document.querySelectorAll('.script > .block')).forEach(function(block) {
            block.parentElement.removeChild(block);
        });
        Menu.runSoon();
    }

    global.file = {
        saveLocal,
        restoreLocal,
        examples: {},
    };
})(window);