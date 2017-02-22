function Modal() {

    this.modals = [];

    this.init = function (data) {
        this.elem = this.getElement(data);
        this.set();
        this.getModalChild();
        this.closeBtn();
        return this;
    };

    this.set = function (data) {
        this.defaultParams = {
            afterOpen: function () {},
            close: true
        };
        this.finalParams = this.defaultParams;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] !== undefined) {
                    this.finalParams[key] = data[key];
                }
            }
        }
        this.options = this.finalParams;
        return this;
    };

    this.getElement = function (el) {
        var thisElement;

        if (typeof el === 'object') {
            return el;
        }

        var id = this.makeId(8);
        if (el[0] === '#') {
            thisElement = document.getElementById(el.slice(1));
        }
        else {
            thisElement = document.getElementsByClassName(el.slice(1))[0];
        }
        thisElement.setAttribute('data-mid', id);
        return thisElement;
    };

    this.show = function () {
        this.elem.style.display = 'block';
        this.options.afterOpen();
        return this;
    };

    this.hide = function () {
        this.elem.style.display = 'none';
        return this;
    };

    this.toggle = function () {
        var curStyle = getComputedStyle(this.elem);
        if (curStyle.display === 'block') {
            this.hide();
        }
        else {
            this.show();
        }
        return this;
    };

    this.closeBtn = function () {
        if (this.options.close) {
            this.title.innerHTML = 123;
        }
    };

    this.getModalChild = function () {
        var elems = this.elem.childNodes;
        elems.forEach(function (elem) { // нет такого метода!
            if (elem.nodeType === 1) {
                if (elem.classList.contains('modal-title')) {
                    this.title = elem;
                }
                if (elem.classList.contains('modal-body')) {
                    this.body = elem;
                }
                if (elem.classList.contains('modal-footer')) {
                    this.footer = elem;
                }
            }
        }.bind(this));
    };

    this.initLink = function (link) {
        if (link.hasAttribute('data-action')) {
            var action = link.getAttribute('data-action');
            if (action === 'hide') {
                link.onclick = this.hide.bind(this);
            }
            if (action === 'show') {
                link.onclick = this.show.bind(this);
            }
        }
        else {
            link.onclick = this.toggle.bind(this);
        }
    };

    this.makeId = function (length) {
        length = length || 8;
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}

var $m = function (data) {
    var obj = new Modal();
    return obj.init(data);
}

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].hasAttribute('data-m')) {
            $m('#' + links[i].getAttribute('data-target')).initLink(links[i]);
        }
    }
}