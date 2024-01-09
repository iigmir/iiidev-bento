/**
 * The menu interface.
 * @typedef {Object} MenuInterface
 * @property {String} name - Food name
 * @property {String} description - Food description
 * @property {String} image - Food image
 * @property {Number} price - Current price
 */

/**
 * Okay..
 * @type {MenuInterface}
 */
export const default_menu_interface = {
    name: "",
    description: "",
    image: "",
    price: 0
};

export class DataApp {
    /**
     * @type {MenuInterface[]}
     */
    list = []
    /**
     * 
     * @param {MenuInterface} input 
     */
    set_list(input = []) {
        this.list = input;
    }
    current_index = -1;
    set_current_index(input = -1) {
        this.current_index = parseInt(input, 10);
    }
    set_current_index_by_random() {
        const num = parseInt(Math.random() * this.list.length, 10);
        this.set_current_index(num);
    }
    /**
     * @type {MenuInterface}
     */
    get current_item() {
        const res = this.list[this.current_index];
        return res;
    }
}

/**
 * We use "requestAnimationFrame" to count the process
 */
export class GameProcess {
    /**
     * The main stack.
     */
    app_timer = null
    /**
     * Ony start the timer when "process_active" is active.
     */
    process_active = false
    set_process_active(input = false) {
        this.process_active = Boolean(input);
    }
    /**
     * Stop the process immediately when the minesocands surpassed the deadline.
     * The state is for preventing infinitely process calling.
     * 
     * Default value is 100000.
     */
    the_deadline = 100000
    set_the_deadline(input = 100000) {
        this.the_deadline = input;
    }
    stop_process() {
        window.cancelAnimationFrame(this.app_timer);
        this.app_timer = null;
    }
    main_process(executing_callback = () => {}, ending_callback = () => {}) {
        return ( time_stamp ) => {
            if( time_stamp < this.the_deadline ) {
                executing_callback();
                this.app_timer = window.requestAnimationFrame(
                    this.main_process( executing_callback, ending_callback )
                );
            } else {
                ending_callback();
                this.stop_process();
            }
        };
    }
    start_process(executing_callback = () => {}, ending_callback = () => {}) {
        if( this.process_active ) {
            this.app_timer = window.requestAnimationFrame(
                this.main_process( executing_callback, ending_callback )
            );
        }
    }
}

/**
 * AJAX instance
 * @param {Element} dom 
 * @param {String} api 
 * @returns 
 */
export const SubmitForm = (dom = Element, api = "https://yesno.wtf/api") => {
    const form = new FormData(dom);
    return new Promise( (resolve, reject) => {
        fetch(api).then( o => o.json() ).then( (res) => {
            const success = res.answer === "yes";
            if( success ) {
                resolve({ success, data: res, form });
            } else {
                reject({ success, data: res, form });
            }
        }).catch( (e) => {
            reject({ success, data: e, form });
        });
    });
};
