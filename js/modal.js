function Modal() {

    this.modals = [];

    this.init = function (data) {
        this.elem = this.getElement(data);
        this.getModalChild();
        if(this.new){
            this.create = false;
            this.set();
            mPool.push({id:this.id,elem:this.elem,options:this.options});
        }
        return this;
    };

    this.set = function (data) {
        this.defaultParams = {
            afterOpen: function () {
            },
            beforeOpen: function () {
            },
            effect: 'standard',//fade,standard
            title: false,
            close: true,
            closeBtnTpl: '<a href="#">Закрыть</a>'
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
        this.create = false;
        mPool.push({id:this.id,elem:this.elem,options:this.options});
        return this;
    };

    this.createModal = function () {
        this.genCloseBtn();
        this.setTitle();
        this.create = true;
        return this;
    };

    this.getElement = function (el) {
        var thisElement;
        this.new = false;

        if (typeof el === 'object') {
            return el;
        }

        this.id = this.makeId(8);
        if (el[0] === '#') {
            thisElement = document.getElementById(el.slice(1));
        }
        else {
            thisElement = document.getElementsByClassName(el.slice(1))[0];
        }
        if (thisElement.hasAttribute('data-mid')) {
            for (var i = 0; i < mPool.length; i++) {
                if(mPool[i].id === thisElement.getAttribute('data-mid')){
                    thisElement = mPool[i].elem;
                    this.options = mPool[i].options;
                    this.id = mPool[i].id;
                }
            }
        }
        else {
            thisElement.setAttribute('data-mid', this.id);
            this.new = true;
        }

        return thisElement;
    };

    this.show = function () {
        this.beforeOpen();
        if(this.options.effect === 'standard'){
            this.elem.style.display = 'block';
        }
        if(this.options.effect === 'fade'){
            this.fadeIn();
        }
        this.options.afterOpen();
        return this;
    };

    this.hide = function () {
        console.log(this.options);
        if(this.options.effect === 'standard'){
            this.elem.style.display = 'none';
        }
        if(this.options.effect === 'fade'){
            this.fadeOut();
        }
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

    this.genCloseBtn = function () {
        if (this.options.close) {
            var closeBtn = document.createElement('div');
            closeBtn.classList.add('mClose');
            closeBtn.innerHTML = this.options.closeBtnTpl;
            this.closeBtn = closeBtn;
            this.closeBtn.onclick = this.hide.bind(this);
            this.title.appendChild(this.closeBtn);
        }
    };

    this.setTitle = function (title) {
        title = title || false;
        if(title){
            this.title.innerHTML = title;
            this.genCloseBtn();
        }
        else if(this.options.title){
            this.title.innerHTML = this.options.title;
            this.genCloseBtn();
        }
        return this;
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

    this.beforeOpen = function(){
        if(this.create === false){
            this.createModal();
        }
        this.options.beforeOpen();
    }

    function animate(options) {
        options.success = options.success || function () {};
        var start = performance.now();
        requestAnimationFrame(function animate(time) {
            var timeFraction = (time - start) / options.duration;
            if (timeFraction > 1) timeFraction = 1;
            var progress = options.timing(timeFraction)
            options.draw(progress);
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
            else {
                options.success();
            }
        });
    }

    this.fadeIn = function (duration, callback) {
        duration = duration || 1000;
        callback = callback || function () {};
        this.elem.style.opacity = 0;
        this.elem.style.display = 'block';
        animate({
            duration: duration,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: function(progress) {
                this.elem.style.opacity = progress;
            }.bind(this),
            success: function () {
                callback();
            }
        });
    };

    this.fadeOut = function (duration, callback) {
        duration = duration || 1000;
        callback = callback || function () {};
        animate({
            duration: duration,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: function(progress) {
                this.elem.style.opacity = 1 - progress;
            }.bind(this),
            success: function () {
                this.elem.style.display = 'none';
                this.elem.style.opacity = 1;
                callback();
            }.bind(this)
        });
    }

}

var mPool = [];

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