import { createApp, ref, onMounted, computed } from "./vue/vue.esm-browser.js";

createApp({
    setup() {
        const list = ref([]);
        const flip_status = ref([]);
        const gamelist_index = ref([]);
        const gamelist_path = computed( () => gamelist_index.value.map( u => list.value[u] ) );
        // Game ending
        /**
         * GAME OVER
         * @see <https://www.youtube.com/watch?v=lnB1UnYoASo>
         */
        const game_end = () => {
            document.body.classList.add("win");
            Swal.fire({
                title: "恭喜破關！",
                text: "再玩一次嗎？",
                confirmButtonText: "來吧！"
                // icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch_game_images();
                }
            });
        };
        // Card flipping
        const selected_cards = ref([]);
        /**
         * Index for selected card
         * @param {Number} index Given index
         * @returns 
         */
        const selected_index = (index = -1) => selected_cards.value[index];
        /**
         * We reset flip_status if different cards flipped.
         */
        const cancel_incorrect_cards = () => {
            const new_array = [...flip_status.value];
            new_array[selected_index(0)] = 0;
            new_array[selected_index(1)] = 0;
            window.setTimeout( () => {
                flip_status.value = [...new_array];
            }, 1200 );
        };
        /**
         * 1. If "more_cards_selected" we ends here
         * 2. If "all_flipped" the game ends
         * 3. If "different_cards_flipped" then call "cancel_incorrect_cards"
         * 4. Finally we reset selected cards
         */
        const check_card = () => {
            const more_cards_selected = selected_cards.value.length !== 2;
            if( more_cards_selected ) {
                // Clear selected cards if we got more than 2 (e.g 3 or 4) to prevent bugs
                if( selected_cards.value.length > 2 ) {
                    selected_cards.value = [];
                }
                return;
            }
            const all_flipped = flip_status.value.every( status => status === 1 );
            if( all_flipped ) {
                game_end();
                return;
            }
            const different_cards_flipped = gamelist_index.value[selected_index(0)] !== gamelist_index.value[selected_index(1)];
            if( different_cards_flipped ) {
                cancel_incorrect_cards();
            }
            // Finally we reset selected cards
            selected_cards.value = [];
        };
        /**
         * Flip a card then check it
         * @param {Number} index 
         */
        const flip_card = (index = 0) => {
            flip_status.value[index] = 1;
            selected_cards.value = [...selected_cards.value, index];
            check_card();
        };
        // Card init
        /**
         * We give time for players to memorise cards
         */
        const preview_and_close_cards = () => {
            flip_status.value = gamelist_index.value.map( () => 2 );
            window.setTimeout( () => {
                flip_status.value = gamelist_index.value.map( () => 0 );
            }, 3000 );
        };
        /**
         * Let's generate random pictures! We generate cards before we got enough.
         * We generate a pair of cards in generating.
         * @param {Number} length 
         * @param {Array} image_list 
         * @returns 
         */
        const gemerate_random_pictures = (length = 1, image_list = []) => {
            let result = [];
            while (result.length < length) {
                let random_index = Math.floor(Math.random() * image_list.length);
                let still_not_a_pair = result.filter( i => i === random_index ).length < 2;
                if (still_not_a_pair) {
                    result.push(random_index);
                }
            }
            return result;
        };
        /**
         * "gemerate_random_pictures" and "preview_and_close_cards"
         * @param {Array} res 
         */
        const init_the_game = (res) => {
            list.value = res;
            gamelist_index.value = gemerate_random_pictures(list.value.length * 2, list.value);
            preview_and_close_cards();
        };
        /**
         * Reset llist, AJAX "/api/game.json", then init the game.
         */
        const fetch_game_images = () => {
            list.value = [];
            gamelist_index.value = [];
            document.body.classList.remove("win");
            const ajax = fetch("/api/game.json").then(r => r.json());
            ajax.then( init_the_game ).catch( e => {
                console.error(e)
            });
        };
        // Actions
        const active_the_game = () => {
            const app = document.querySelector("#app");
            app.attributes.removeNamedItem("hidden");
            app.attributes.removeNamedItem("aria-hidden");
        };
        fetch_game_images();
        onMounted( active_the_game );
        return {
            list,
            gamelist_path,
            flip_status,
            flip_card,
            fetch_game_images,
            check_cleared: game_end,
        };
    },
}).mount("#app");
