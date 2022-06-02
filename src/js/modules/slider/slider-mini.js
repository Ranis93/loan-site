import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor(container, next, prev, activeClass, animate, autoplay) {
        super(container, next, prev, activeClass, animate, autoplay);
    }

    decorizeSlides() {
        this.slides.forEach((slide, i) => {
            slide.classList.remove(this.activeClass);

            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        });

        if (!this.slides[0].closest('button')) {
            this.slides[0].classList.add(this.activeClass);                //  всегда толко первый слайд будет класса-active .
        }

        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide() {
        if (this.slides[1].tagName == 'BUTTON' && this.slides[2].tagName == 'BUTTON') { //  если на 2 и 3 позиции кнопки .
            this.container.appendChild(this.slides[0]);                 //  первый слайд премещаем в конец списка слайдов .
            this.container.appendChild(this.slides[1]);                 //  первую кнопку премещаем в конец списка слайдов .
            this.container.appendChild(this.slides[2]);                 //  вторую кнопку премещаем в конец списка слайдов .
            this.decorizeSlides();
        } else if (this.slides[1].tagName == 'BUTTON') {
            this.container.appendChild(this.slides[0]);                 //  первый слайд премещаем в конец списка слайдов .
            this.container.appendChild(this.slides[1]);                 //  первую кнопку премещаем в конец списка слайдов .
            this.decorizeSlides();
        } else {
            this.container.appendChild(this.slides[0]);                 //  первый слайд премещаем в конец списка слайдов .
            this.decorizeSlides();
        }
    }
    
    bindTriggers() {
        this.next.addEventListener('click', () => this.nextSlide());
        
        this.prev.addEventListener('click', () => {
            for (let i = this.slides.length - 1; i > 0; i--) {
                if (this.slides[i].tagName !== 'BUTTON') {
                    let active = this.slides[this.slides.length -1];
                    this.container.insertBefore(active, this.slides[0]);        //  последний слайд премещаем на первую позицию .
                    this.decorizeSlides();
                }
            }
        });
    }

    init() {
        this.container.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        align-items: flex-start;        
        `;

        this.bindTriggers();
        this.decorizeSlides();

        if (this.autoplay) {
            this.autoSlide = setInterval(() => this.nextSlide(), 5000);
        }
            // остановка автослайда и запуск при убирании мыши
        this.next.parentNode.addEventListener('mouseenter', () => {
            clearInterval(this.autoSlide);
        });
    
        this.next.parentNode.addEventListener('mouseleave', () => {
            if (this.autoplay) {
                this.autoSlide = setInterval(() => this.nextSlide(), 5000);
            }
        });
    }
}