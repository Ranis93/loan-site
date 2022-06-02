const mask = (selector) => {

    let setCursorPosition = (pos, elem) => {
        if (pos >= 18) {
            elem.blur();
        } else {
            elem.focus();
        }

        if(elem.setSelectionRange) {                    // ручной полифил на поддержку браузером метода elem.setSelectionRange(posStart, posEnd)
            elem.setSelectionRange(pos, pos);           // метод выделяет текст в инпуте, но если начальное и конечное значение равны то просто ставит курсор в инпуте
        } else if (elem.createTextRange) {
            let range = elem.createTextRange();

            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    function createMask (event) {
        let matrix = '+7 (___) ___ __ __',
        i = 0,
        def = matrix.replace(/\D/g, ''),
        val = this.value.replace(/\D/g, '');

        if (def.length >= val.length) {   // +7 в matrix - цифры. Данное устовие не дает их удалить с input .
            val = def;
        }

        this.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        });

        if (event.type === 'blur') {
            if (this.value.length == 2) {
                this.value = '';
            } else {
                setCursorPosition(this.value.length, this);
            }
        }
    }

    let inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {
        input.addEventListener('input', createMask);
        input.addEventListener('focus', createMask);
        input.addEventListener('blur', createMask);
    });

};

export {mask};