export default class VideoPlayer {
    constructor(triggers, overlay) {
        this.btns = document.querySelectorAll(triggers);        // кнопки открытия плеера
        this.overlay = document.querySelector(overlay);
        this.close = this.overlay.querySelector('.close');      // кнопка закрытия плеера
    }

    bindTriggers() {
        this.btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (document.querySelector('iframe#frame')) {       // условие чтобы каждый раз не создавать экземпляр класса
                    this.overlay.style.display = 'flex';
                } else {
                    const path = btn.getAttribute('data-url');      // берем url c data-атрибута кнопки открытия плеера

                    this.createPlayer(path);
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
            videoId: `${url}`
        });

        console.log(this.player);
        this.overlay.style.display = 'flex';
    }

    init() {
        const tag = document.createElement('script');                         // из YouTube iframe player API
        tag.src = "https://www.youtube.com/iframe_api";                       //  -//-
        const firstScriptTag = document.getElementsByTagName('script')[0];    //  -//-
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);          //  -//-

        this.bindTriggers();
        this.bindCloseBtn();
    }
}