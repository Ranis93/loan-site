export default class Difference {
    constructor(oldOfficer, newOfficer, items) {
        this.oldOfficer = document.querySelector(oldOfficer);
        this.newOfficer = document.querySelector(newOfficer);
        try {
            this.oldItems = this.oldOfficer.querySelectorAll(items);
            this.newItems = this.newOfficer.querySelectorAll(items);
        } catch(e) {}
        this.items = items;
        this.oldCounter = 0;
        this.newCounter = 0;
    }

    bindTriggers(column, columnItems, counter) {
        column.querySelector('.plus').addEventListener('click', () => {
            if (counter !== columnItems.length - 2) {
                columnItems[counter].style.display = 'flex';            // добавляем новые элементы .
                counter++;
            } else {
                columnItems[counter].style.display = 'flex';
                columnItems[columnItems.length -1].remove();            // удаляем элемент с плюсом .
            }
        });
    }

    hideItems(items) {
        items.forEach((item, i, arr) => {
            if (i !== arr.length - 1) {      // скрываем все элементы кроме последнего .
                item.style.display = 'none';
            }
        });
    }

    init() {
        try {
            this.hideItems(this.oldItems);
            this.hideItems(this.newItems);
            this.bindTriggers(this.oldOfficer, this.oldItems, this.oldCounter);  // for oldOfficer .
            this.bindTriggers(this.newOfficer, this.newItems, this.newCounter);  // for newOfficer .
        } catch (e) {}
    }
}