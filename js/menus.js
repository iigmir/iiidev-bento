import {
    default_menu_interface as default_interface,
    DataApp, GameProcess, SubmitForm
} from "./modules/menu.js";

const assign_form = () => {
    const show_toast = (success = false) => {
        const reminder = document.querySelector('*[data-reminder="main"]');
        const title = document.querySelector('*[data-reminder="title"]');
        const content = document.querySelector('*[data-reminder="content"]');
        // Render text
        title.textContent = success ? "已成功送出" : "傳送失敗";
        content.textContent = success ? "我們將盡快回應您" : "請稍候嘗試";
        // Bootstrap
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(reminder);
        toastBootstrap.show();
    };

    const submit = (ev = SubmitEvent) => {
        ev.preventDefault();
        const ajax = SubmitForm(ev.target, "https://yesno.wtf/api");
        ajax.then( () => {
            show_toast();
        }).catch( () => {
            show_toast();
        });
    };

    // document.querySelector("#order-form").removeEventListener( "submit", submit );

    document.querySelector("#order-form").addEventListener( "submit", submit );
};

const game = (datalist = DataApp) => {
    // States and executors
    const game_process = new GameProcess();
    let form_assigned = false;
    const start_game_executor = (event) => {
        // States
        const mainapp = document.querySelector("#menu-game");
        const game_app_image = mainapp.querySelector("img[data-menu-app='image']");
        // Render methods
        /**
         * @param {MenuInterface} current_item 
         */
        const render_recommendation = (current_item) => {
            mainapp.querySelector("*[data-menu-app='recommend-title']").textContent = current_item.name;
            mainapp.querySelector("*[data-menu-app='recommend-content']").textContent = current_item.description;
            mainapp.querySelector("*[data-menu-app='recommendation']").hidden = false;
        };
        /**
         * @param {MenuInterface} current_item 
         */
        const set_flavour = (current_item) => {
            document.querySelector("#form-flavours").value = current_item.name;
        };
        // Action methods
        const change_image = () => {
            datalist.set_current_index_by_random();
            game_app_image.src = datalist.current_item.image;
        };
        const stop_game_process = () => {
            game_process.stop_process();
            game_app_image.classList.add("done");
        }
        const handle_form = () => {
            if( !form_assigned ) {
                assign_form();
                form_assigned = true;
            }
        };
        const handle_image_click = () => {
            stop_game_process();
            render_recommendation(datalist.current_item);
            set_flavour(datalist.current_item);
            handle_form();
        };
        // Main executors and event listeners
        if( game_process.process_active ) {
            game_process.start_process(change_image);
            game_app_image.classList.remove("done");
            game_app_image.addEventListener("click", handle_image_click);
        } else {
            game_app_image.src = datalist.current_item.image;
            handle_image_click();
        }
    };
    const end_game_executor = (event) => {
        game_process.stop_process();
        const mainapp = document.querySelector("#menu-game");
        mainapp.querySelector("*[data-menu-app='recommendation']").hidden = true;
        mainapp.querySelector("img[data-menu-app='image']").src = "./assets/undecided.svg";
    };
    const active_game_or_choose_food = (e) => {
        const menuGame = e.target.closest("[data-menu-game]").dataset.menuGame;
        game_process.set_process_active(menuGame === "active");
        if (menuGame !== "active") {
            /**
             * The reason why e.target is <img /> instead of <a></a> is unknown, but whateever.
             */
            const img = e.target;
            const index = datalist.list.findIndex(the => the.name === img.alt);
            if (index === -1) {
                debugger;
                console.log(datalist.list, index);
                throw new Error("No such item");
            }
            datalist.set_current_index(index);
        }
    };
    // Bootstrap event listeners
    [...document.querySelectorAll("*[data-menu-game]")].forEach( dom => {
        dom.addEventListener("click", active_game_or_choose_food);
    });
    document.querySelector("#menu-game").addEventListener( "shown.bs.modal", start_game_executor );
    document.querySelector("#menu-game").addEventListener( "hide.bs.modal", end_game_executor );
};

const main = async () => {
    /**
     * @param {MenuInterface[]} res 
     */
    const render_table_when_success = (res = [default_interface]) => {
        /**
         * @param {MenuInterface} item 
         */
        const set_template = (item = default_interface) => `<tr>
                <td rowspan="2">
                    <a href="javascript:;" data-bs-toggle="modal" data-bs-target="#menu-game" data-menu-game="inactive">
                        <img src="${item.image}" width="246" alt="${item.name}" />
                    </a>
                </td>
                <td>${item.name}</td>
            </tr>
            <tr> <td>${item.description}</td>
        </tr>`;
        const table_items = res.map(item => set_template(item)).join("");
        document.querySelector("#foods-app #the-table tbody").innerHTML = table_items;
    };
    /**
     * @param {MenuInterface[]} res 
     */
    const set_datalist_element = (res = [default_interface]) => {
        const dom = document.querySelector("#datalistOptions");
        res.forEach( (item) => {
            let option = document.createElement("option");
            option.value = item.name;
            dom.appendChild(option);
        });
    };
    try {
        const res = await fetch("/api/menus.json").then(r=>r.json());
        const datalist = new DataApp();
        datalist.set_list(res);
        set_datalist_element(datalist.list);
        render_table_when_success(datalist.list);
        game(datalist);
    } catch (error) {
        console.error(error);
        document.querySelector("#foods-app").textContent = JSON.stringify( error.statusText );
    }
};

main();
