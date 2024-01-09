import { default_menu_interface, DataApp, SubmitForm } from "./modules/menu.js";

/**
 * @param {MenuInterface[]} res 
 */
const set_datalist_element = (res = [default_menu_interface]) => {
    const dom = document.querySelector("#datalistOptions");
    res.forEach( (item) => {
        let option = document.createElement("option");
        option.value = item.name;
        dom.appendChild(option);
    });
};

const submit = (ev = SubmitEvent) => {
    ev.preventDefault();
    const ajax = SubmitForm(ev.target, "https://yesno.wtf/api");
    ajax.then( (d) => {
        show_toast(d);
    }).catch( (d) => {
        show_toast(d);
    });
};

const show_toast = (res) => {
    // console.log(res);
    const reminder = document.querySelector('*[data-reminder="main"]');
    const title = document.querySelector('*[data-reminder="title"]');
    const content = document.querySelector('*[data-reminder="content"]');
    // Render text
    title.textContent = res.success ? "已成功送出" : "傳送失敗";
    content.textContent = res.success ? "我們將盡快回應您" : "請稍候嘗試";
    // Bootstrap
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(reminder);
    toastBootstrap.show();
};

const main = async () => {
    try {
        const datalist = new DataApp();
        const res = await fetch("/api/menus.json").then(r=>r.json());
        datalist.set_list(res);
        set_datalist_element(datalist.list);
        document.querySelector("#order-form").addEventListener( "submit", submit );
    } catch (error) {
        console.error(error);
    }
};

main();
