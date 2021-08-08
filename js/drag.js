(function (global) {
    let dragTarget = null;
    let dragType = null;

    function dragStart(evt) {
        if (!matches(evt.target, '.block')) {
            return;
        }

        if (matches(evt.target, '.menu .block')) {
            dragType = 'menu';
        } else {
            dragType = 'script';
        }

        evt.target.classList.add('dragging');
        dragTarget = evt.target;

        evt.dataTransfer.setData('text/html', evt.target.outerHTML);
        if (matches(evt.target, '.menu .block')) {
            evt.dataTransfer.effectAllowed = 'copy';
        } else {
            evt.dataTransfer.effectAllowed = 'move';
        }
    }

    function dragOver(evt) {
        if (!matches(evt.target, '.menu, .menu *, .script, .script *, .content')) {
            return;
        }

        if (evt.preventDefault) {
            evt.preventDefault();
        }
        if (dragType === 'menu') {
            evt.dataTransfer.dropEffect = 'copy';
        } else {
            evt.dataTransfer.dropEffect = 'move';
        }

        return false;
    }

    function dragEnter(evt) {
        if (matches(evt.target, '.menu, .script, .content')) {
            evt.target.classList.add('over');
            if (evt.preventDefault) { evt.preventDefault(); }// Necessary. Allows us to drop.
        } else {
            if (!matches(evt.target, '.menu *, .script *')) {
                _findAndRemoveClass('over');
                evt.target.classList.remove('over');
            }
        }
        return false;
    }

    function drop(evt) {
        if (!matches(evt.target, '.menu, .menu *, .script, .script *')) {
            return;
        }

        const dropTarget = closest(
            evt.target,
            '.script .container, .script .block, .menu, .script',
        );

        let dropType = 'script';

        if (matches(dropTarget, '.menu')) {
            dropType = 'menu';
        }

        if (evt.stopPropagation) {
            evt.stopPropagation();
        }

        if (dragType === 'script' && dropType === 'menu') {
            trigger('blockRemoved', dragTarget.parentElement, dragTarget);
            dragTarget.parentElement.removeChild(dragTarget);
        } else if (dragType === 'script' && dropType === 'script') {
            if (matches(dropTarget, '.block')) {
                dropTarget.parentElement.insertBefore(
                    dragTarget,
                    dropTarget.nextSibling,
                );
            } else {
                dropTarget.insertBefore(dragTarget, dropTarget.firstChildElement);
            }
        } else if (dragType === 'menu' && dropType === 'script') {
            const newNode = dragTarget.cloneNode(true);
            newNode.classList.remove('dragging');
            if (matches(dropTarget, '.block')) {
                dropTarget.parentElement.insertBefore(
                    newNode,
                    dropTarget.nextSibling,
                );
            } else {
                dropTarget.insertBefore(newNode, dropTarget.firstChildElement);
            }
            trigger('blockAdded', dropTarget, newNode);
        }
    }

    function _findAndRemoveClass(klass) {
        const elem = document.querySelector('.' + klass);
        if (elem) {
            elem.classList.remove(klass);
        }
    }

    function dragEnd(_evt) {
        _findAndRemoveClass('dragging');
        _findAndRemoveClass('over');
        _findAndRemoveClass('next');
    }

    document.addEventListener('dragstart', dragStart, false);
    document.addEventListener('dragenter', dragEnter, false);
    document.addEventListener('dragover', dragOver, false);
    document.addEventListener('drag', function () { }, false);
    document.addEventListener('drop', drop, false);
    document.addEventListener('dragend', dragEnd, false);
})(window);
