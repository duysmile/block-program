(function (global) {
    const menu = document.querySelector('.menu');
    const script = document.querySelector('.script');
    const scriptRegistry = {};
    let scriptDirty = false;

    function runSoon() {
        scriptDirty = true;
    }

    function run() {
        if (scriptDirty) {
            scriptDirty = false;
            Block.trigger('beforeRun', script);
            const blocks = [].slice.call(
                document.querySelectorAll('.script > .block'),
            );

            Block.run(blocks);
            Block.trigger('afterRun', script);
        } else {
            Block.trigger('everyFrame', script);
        }
        requestAnimationFrame(run);
    }

    requestAnimationFrame(run);

    function runEach(evt) {
        const elem = evt.target;
        if (!matches(elem, '.script .block')) {
            return;
        }

        if (elem.dataset.name === 'Define block') {
            return;
        }

        elem.classList.add('running');
        scriptRegistry[elem.dataset.name](elem);
        elem.classList.remove('running');
    }

    function menuItem(name, fn, value, units) {
        const item = Block.create(name, value, units);
        scriptRegistry[name] = fn;
        menu.appendChild(item);
        return item;
    }

    function repeat(block) {
        const count = Block.value(block);
        const children = Block.contents(block);
        for (let i = 0; i < count; i++) {
            Block.run(children);
        }
    }

    menuItem('Repeat', repeat, 10, []);

    global.Menu = {
        runSoon,
        item: menuItem,
    };

    document.addEventListener('drop', runSoon, false);
	script.addEventListener('run', runEach, false);
	script.addEventListener('change', runSoon, false);
	script.addEventListener('keyup', runSoon, false);

})(window);