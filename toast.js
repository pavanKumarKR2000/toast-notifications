const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: "top-right",
    canClose: true,
    showProgress:true
}

export default class Toast{

    #toastElem;
    #toastIcon = 'info.svg';
    #autoCloseTimeout;
    #removeBinded;
    #visibleSince= 0
    #autoClose
    #progressInterval
    
    constructor(options) {
        this.#toastElem = document.createElement("div");
        this.#toastElem.classList.add("toast");
        this.#visibleSince = new Date();
        this["type"] = options.type;
        requestAnimationFrame(() => {
            this.#toastElem.classList.add("show");
        })
        this.#removeBinded = this.remove.bind(this);
        this.update({ ...DEFAULT_OPTIONS, ...options });
    }

    set position(value) {

        const currentContainer = this.#toastElem.parentElement;
        const selector=`.toast-container[data-position=${value}]`
        const toastContainer = document.querySelector(selector) || createToastContainer(value);
        toastContainer.appendChild(this.#toastElem);
        document.body.appendChild(toastContainer);

        if (currentContainer === null || currentContainer.hasChildNodes()) {
            return;
        }

        currentContainer.remove();
    }

    set message(value) {

        let toastHTML = `<div class="message-container">
        <img src="./icons/${this.#toastIcon}.svg" height="25px">
        <p class="message">${value}</p>
        </div>`;
        
        this.#toastElem.innerHTML = toastHTML;
        this.#toastElem.dataset.type = this.#toastIcon;
    }

    set type(value) {
        this.#toastIcon =value;
    }

    show() {
        
    }

    update(options) {
        Object.entries(options).forEach(([key, value]) => {

            if (key !== 'type') {
                this[key] = value;
            }
            
        })
    }

    set autoClose(value){
       
        this.#autoClose = value;
        if (value === false) return; 

        if (this.#autoCloseTimeout != null) {
            clearTimeout(this.#autoCloseTimeout);
        }
        
        this.#autoCloseTimeout=setTimeout(()=>this.remove(),value)
    }

    set canClose(value) {

        this.#toastElem.classList.toggle("can-close", value);

        if (value) {
            this.#toastElem.addEventListener('click', this.#removeBinded);
        }
        else {
            this.#toastElem.removeEventListener('click', this.#removeBinded);
        }
        
    }

    set showProgress(value) {
        
        this.#toastElem.classList.toggle("progress", value);
        this.#toastElem.style.setProperty("--progress", 1);
        
        this.#progressInterval=setInterval(() => {
            const timeVisible = new Date() - this.#visibleSince;
            this.#toastElem.style.setProperty("--progress",1 - timeVisible/this.#autoClose );
        }, 10);
    }

    remove() {
        clearTimeout(this.#autoCloseTimeout);
        clearInterval(this.#progressInterval);
        const toastContainer = this.#toastElem.parentElement;
        this.#toastElem.classList.remove("show");
        this.#toastElem.addEventListener("transitionend", () => {
            this.#toastElem.remove();

            if (!toastContainer.hasChildNodes()) {
                toastContainer.remove();
            }
        });
    }
}

function createToastContainer(position) {
    const container = document.createElement("div");
    container.classList.add("toast-container");
    container.dataset.position = position;
    return container;
}

