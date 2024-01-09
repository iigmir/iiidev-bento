const show_location = (e) => {
    console.log(e);
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
      
    function success(pos) {
        const crd = pos.coords;
      
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
    }
      
    function error(err) {
        const status = document.querySelector('*[data-locapp="status"]');
        status.textContent = "抱歉，地點似乎無法取得";
        status.dataset.code = err.code;
        status.dataset.message = err.message;
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
};

const set_template = (item = { id: 0, branch: "", contact: { "address": "", "email": "", "tel": "", "tel_readable": "" }, map: "" }) => {
    return `<div class="col-sm-12 col-md-6 mt-3">
        <article class="branch">
            <h3>${item.branch}</h3>
            <address>
                <p>${item.contact.address}</p>
                <p><a href="mailto:${item.contact.email}">${item.contact.email}</a></p>
                <p><a href="tel:${item.contact.tel}">${item.contact.tel_readable}</a></p>
            </address>
            <iframe src="${item.map}" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </article>
    </div>`;
};

const main = async () => {
    const api = "/api/place.json";
    const res_array = await fetch(api).then(r=>r.json());
    const res_html = res_array.map( i => set_template(i) ).join("");
    document.querySelector("#branch-app").innerHTML = res_html;
    // document.querySelector('*[data-locapp="start"]').addEventListener("click", show_location);
};

main();


