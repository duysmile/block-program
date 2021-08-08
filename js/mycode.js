(function(global) {
    function log(block) {
        const text = Block.value(block);
        console.log(text);
    }

    Menu.item('Log', log, 'Default');
})(window);