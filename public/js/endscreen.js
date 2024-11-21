let WrittenName = ""

window.onload = () => {
    const inputs = document.getElementById("inputs");
    
    for (const input of inputs.getElementsByTagName("input")) {
        input.addEventListener("input", function (e) {
            const target = e.target;
            const val = target.value;
        
            if (val != "") {
                const next = target.nextElementSibling;
                if (next) next.focus();
                if (val == ' ') {
                    target.value = '';
                }
            }

        });

        input.addEventListener('keydown', function (e) {
            const key = e.key;
            if (key === "Backspace" || key === "Delete") {
                const curr = document.activeElement;
                const prev = curr.previousElementSibling;
                if (curr) curr.value = '';
                if (prev) prev.focus();
                e.preventDefault();
            }
        });
    }
}

function SubmitName() {
    WrittenName = ""
    const inputs = document.getElementById("inputs");

    for (const input of inputs.getElementsByTagName("input")) {
        if (input.value == "") input.value = " ";
        WrittenName = WrittenName + input.value;
    };
    console.log(WrittenName);
    inputs.classList.add("hidden");
    document.getElementById("buttons").classList.remove('hidden');
};