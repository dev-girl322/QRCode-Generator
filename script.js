let generatebtn = document.querySelector(".generate");
let downloadbtn = document.querySelector(".dwnld");
let input = document.getElementById("valueinput");
let colorinput = document.getElementById("colorinput");
let bgcolorinput = document.getElementById("bgcolorinput");
let sizeinput = document.getElementById("sizeinput");
let formatinput = document.getElementById("formatselectinput");
let qrcodecontainer = document.querySelector(".qrcode-container");
let loadingcontainer = document.querySelector(".loadingcontainer");
let settingsbtn = document.querySelector(".settingsbtn");
let settingsmenu = document.querySelector(".settingsmenu");
downloadbtn.innerText = "Download";

(() => {
    let { color, bgcolor, size, format } = JSON.parse(localStorage.getItem("settings")) || {
        color: "#000000",
        bgcolor: "#ffffff",
        size: 300,
        format: "png"
    };
    colorinput.value = color;
    bgcolorinput.value = bgcolor;
    sizeinput.value = size;
    formatinput.value = format;
})();

settingsbtn.addEventListener("click", () => {
    settingsmenu.classList.toggle("visible");
});

[colorinput, bgcolorinput, sizeinput, formatinput].forEach(inp => {
    inp.addEventListener("change", _ => {
        localStorage.setItem("settings", JSON.stringify({
            color: colorinput.value,
            bgcolor: bgcolorinput.value,
            size: sizeinput.value,
            format: formatinput.value
        }))
    })
})

// https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example&color=00ff00

input.addEventListener("keydown", (e) => {
    if (input.value == "" || input.value.trim() == "") return;
    if (e.key === "Enter") {
        generatebtn.click();
    }
});

generatebtn.addEventListener("click", async () => {
    if (input.value == "" || input.value.trim() == "") return;
    qrcodecontainer.classList.add("animate");
    qrcodecontainer.innerHTML = `<h1>Loading...</h1>`;


    szevalue = sizeinput.value.replace("#", '');
    clrvalue = colorinput.value.replace("#", '');
    bgclrvalue = bgcolorinput.value.replace("#", '');
    frmtvalue = formatinput.value.replace("#", '');

    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${szevalue}x${szevalue}&data=${input.value}&color=${clrvalue}&bgcolor=${bgclrvalue}&format=${frmtvalue}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        qrcodecontainer.innerHTML = `<img id='qrcodeimg' src=${response.url} alt="Loading...">`;
    } catch (error) {
        qrcodecontainer.innerHTML = `<h1>Error</h1>`;
        console.error(error.message);
    }
});

downloadbtn.addEventListener("click", async () => {
    let img = document.getElementById("qrcodeimg");
    downloadbtn.innerText = "Downloading...";
    try {
        let response = await fetch(img.src);
        let output = await response.blob();
        let blobURL = URL.createObjectURL(output);

        let anchorelement = document.createElement("a");
        anchorelement.href = blobURL;
        document.body.appendChild(anchorelement);
        anchorelement.download = `qrcode.${formatinput.value}`;
        anchorelement.click();
        downloadbtn.innerText = "Download";
        document.body.removeChild(anchorelement);
        URL.revokeObjectURL(output);
    } catch (error) {
        console.error(error.message);
    }
})