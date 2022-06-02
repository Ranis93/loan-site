export default class Slider {
    constructor({container = null, 
                    btns = null, 
                    next = null, 
                    prev = null, 
                    activeClass = '', 
                    animate = false, 
                    autoplay = false} = {}) {    // default  - значения во избежания ошибок, если какой то элемент забыли передать .
        this.container = document.querySelector(container);           // селектор передан методом деструктуризации .
        this.slides = this.container.children;
        this.btns = document.querySelectorAll(btns); 
        this.next = document.querySelector(next);
        this.prev = document.querySelector(prev);
        this.activeClass = activeClass;
        this.animate = animate;
        this.autoplay = autoplay;
        this.slideIndex = 1;   
    }
}