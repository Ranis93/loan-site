export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся!',
            failure: 'Что-то пошло не так...',
            spinner: 'assets/img/spinner.gif',
            ok: 'assets/img/ok.png',
            fail: 'assets/img/fail.png'
        };
        this.path = {
            joinEvol: 'https://loan-site-default-rtdb.europe-west1.firebasedatabase.app/joinEvol.json',
            schedule: 'https://loan-site-default-rtdb.europe-west1.firebasedatabase.app/schedule.json'
        };
    }

    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    checkMailInputs(){
        const mailInputs = document.querySelectorAll('[type="email"]');
    
        mailInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    e.preventDefault();
                }
            });
        });
    }

    initMask() {

        let setCursorPosition = (pos, elem) => {        // функция для красивой установки курсора .
            elem.focus();
            
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };

        function createMask(event) {                    // функция маска для телефона .
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');

            if (def.length >= val.length) {
                val = def;
            }

            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });

            if (event.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }

        let inputsPhone = document.querySelectorAll('[name="phone"]');

        inputsPhone.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
    
        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMask();

        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                statusMessage.classList.add('status');
                item.parentNode.appendChild(statusMessage);

                item.classList.add('animated', 'fadeOutUp');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 500);

                let statusImg = document.createElement('img');
                statusImg.setAttribute('src', this.message.spinner);
                statusImg.classList.add('animated', 'fadeInUp');
                statusMessage.appendChild(statusImg);


                let textMessage = document.createElement('div');
                textMessage.textContent = this.message.loading;
                statusMessage.appendChild(textMessage);

                const formData = new FormData(item); 
                
                let object = {};                            // formData => json
                formData.forEach(function(value, key){
                    object[key] = value;
                });
                var jsonFile = JSON.stringify(object);
    
                let api;
                item.closest('.join__evolution') || item.classList.contains('form1') ? api = this.path.joinEvol : api = this.path.schedule;
                console.log(api);

                this.postData(api, jsonFile)
                    .then(res => {
                        console.log(res);
                        statusImg.setAttribute('src', this.message.ok);
                        textMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusImg.setAttribute('src', this.message.fail);
                        textMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();                     // удаление созданного div .
                            item.style.display = 'block';
                            item.classList.remove('fadeOutUp');        // плавное исчезновение div-а вниз .
                            item.classList.add('fadeInUp');             // плавное появление div-а вверх .
                        }, 6000);
                    });
            });
        });
    }
}