import { createApp, ref, onMounted, computed } from "./vue/vue.esm-browser.prod.js";
import { SubmitForm } from "./modules/menu.js";

const get_toast_message = (successed = false) => {
    if( successed ) {
        return {
            title: "已成功送出。",
            body: "感謝您！您今日的意見，將會培育明日的我們，成為一間更好的店家。",
            colours: ["toast", "text-bg-success"]
        };
    }
    return {
        title: "意見沒有送出。",
        body: "也許再先等一下，把心情醞釀好後，再傳上去吧？",
        colours: ["toast", "text-bg-danger"]
    };
};

createApp({
    setup() {
        // AJAX modules
        const ajax_success = ref(false);
        const submit = (ev = SubmitEvent) => {
            const ajax = SubmitForm(ev.target, "https://yesno.wtf/api");
            ajax.then( () => {
                ajax_success.value = true;
                show_toast();
            }).catch( () => {
                ajax_success.value = false;
                show_toast();
            });
        };
        const comments = ref([]);
        const init_comments = () => {
            fetch("/api/comments.json").then( r => r.json() ).then( (res) => {
                comments.value = res;
            });
        };
        // Render modules
        const render_date = (input = "2023-01-01T00:00:00Z") => {
            const date = new Date(input);
            return date.toLocaleDateString();
        };
        // Toast modules
        const toast_message = computed( () => {
            return { ...get_toast_message(ajax_success.value) };
        });
        const show_toast = () => {
            const dom = document.querySelector("#success-toast");
            const toast_dom = bootstrap.Toast.getOrCreateInstance( dom );
            toast_dom.show();
        };
        // Actions
        init_comments();
        onMounted( () => {
            const app = document.querySelector("#app #vueapp");
            app.attributes.removeNamedItem("hidden");
            app.attributes.removeNamedItem("aria-hidden");
        } );
        return {
            comments,
            toast_message,
            submit,
            render_date,
            show_toast,
        };
    },
}).mount("#app");

document.querySelector("footer .h3").addEventListener( "click", (ev) => {
    const a = document.createElement("a");
    a.href = "./game.html";
    a.target = "_blank";
    a.click();
});
