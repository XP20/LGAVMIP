let WrittenName = ""

window.onload = () => {
    const inputs = document.getElementById("inputs");
    
    for (const input of inputs.getElementsByTagName("input")) {
        input.addEventListener("input", function (e) {
            const target = e.target;
            const val = target.value;
        
            if (val.trim() != "") {
                const next = target.nextElementSibling;
                if (next) next.focus();
            }
        });
    }
}

function SubmitName() {
    WrittenName = ""
    const inputs = document.getElementById("inputs");

    for (const input of inputs.getElementsByTagName("input")) {
        WrittenName = WrittenName + input.value;
    };
    console.log(WrittenName);
    inputs.classList.add("hidden");
    document.getElementById("buttons").classList.remove('hidden');
};