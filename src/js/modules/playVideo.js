export default class VideoPlayer {
    constructor(triggers, overlay) {
        this.btns = document.querySelectorAll(triggers);        // кнопки открытия плеера
        this.overlay = document.querySelector(overlay);
        this.close = this.overlay.querySelector('.close');      // кнопка закрытия плеера
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    }

    bindTriggers() {
        this.btns.forEach((btn, i) => {
            try {
                const blockedBtn = btn.closest('.module__video-item').nextElementSibling;

                if (i % 2 == 0) {
                    blockedBtn.setAttribute('data-disabled', 'true');
                }
            } catch (e) {}

            btn.addEventListener('click', () => {
                if (!btn.closest('.module__video-item') || btn.closest('.module__video-item').getAttribute('data-disabled') !== 'true') {
                    this.activeBtn = btn;

                    if (document.querySelector('iframe#frame')) {       // условие чтобы каждый раз не создавать экземпляр класса
                        this.overlay.style.display = 'flex';
                        if (this.path !== btn.getAttribute('data-url')) {   // если плеер ранее запускался, и уже имеет ссылку, переписываем на новую ссылку из дата атрибута .
                            this.path = btn.getAttribute('data-url');
                            this.player.loadVideoById({videoId: this.path});  // (из YouTube iframe player API) функция служит для загрузки и воспроизведения указанного видео /
                        }
                    } else {                                            // иначе если ранее плеер не запускался ,
                        this.path = btn.getAttribute('data-url');      // берем url c data-атрибута кнопки открытия плеера
    
                        this.createPlayer(this.path);
                    }
                }

            });
        });
    }

    bindCloseBtn() {
        this.close.addEventListener('click', () => {
            this.overlay.style.display = 'none';
            this.player.stopVideo();
        });
    }

    createPlayer(url) {                         // из YouTube iframe player API
        this.player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: `${url}`,
            events: {
                'onStateChange': this.onPlayerStateChange
              }
        });

        this.overlay.style.display = 'flex';
    }

    onPlayerStateChange(state) {
        try {
            const blockedElem = this.activeBtn.closest('.module__video-item').nextElementSibling;
            const playBtn = this.activeBtn.querySelector('svg').cloneNode(true);            // полностью копируем кнопку .
    
            if (state.data === 0) {         // status=0 значит, если видео досмотрено (из документации YT API)
                if (blockedElem.querySelector('.play__circle').classList.contains('closed')) {            // класс затемняет кнопку.
                    blockedElem.querySelector('.play__circle').classList.remove('closed');
                    blockedElem.querySelector('svg').remove();
                    blockedElem.querySelector('.play__circle').appendChild(playBtn);                    // вставка скопированой иконки с кодом .
                    blockedElem.querySelector('.play__text').textContent = 'play video';
                    blockedElem.querySelector('.play__text').classList.remove('attention');
                    blockedElem.style.opacity = 1;
                    blockedElem.style.filter = 'none';
    
                    blockedElem.setAttribute('data-disabled', 'false');
                }
            }
        } catch (e) {}
    }

    init() {
        if (this.btns.length > 0) {                                               // проверяем передавались ли кнопки открытия плеера
            const tag = document.createElement('script');                         // из YouTube iframe player API
            tag.src = "https://www.youtube.com/iframe_api";                       //  -//-
            const firstScriptTag = document.getElementsByTagName('script')[0];    //  -//-
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);          //  -//-
    
            this.bindTriggers();
            this.bindCloseBtn();
        }
    }
}