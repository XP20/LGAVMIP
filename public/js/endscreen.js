const keyGap = 20;
const [keyWidth, keyHeight] = [80, 10];
const fontSize = 80;
const keyCount = 10;

let writtenName = "";
let canvas;

window.onload = () => {
    canvas = document.getElementById('inputs');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    redraw();
}

function onloadCopy(params) {
    canvas = document.getElementById('inputs');
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    redraw();
}

document.onkeyup = event => {
    const isValidChar = event.key.match(/^[a-zA-Z\!\?\*\-\+\$\%\&\#\@0-9]$/);
    if (isValidChar) {
        // Add key
        if (writtenName.length < keyCount) {
            writtenName += event.key;
            redraw();
        }
    } else if (event.key === "Backspace" || event.key === "Delete") {
        // Delete key
        if (writtenName.length > 0) {
            writtenName = writtenName.slice(0, -1);
            redraw();
        }
    }
    // TODO: Arrow keys and cursor
};

function redraw() {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    let wasInput = false;
    ctx.reset();
    ctx.font = `${fontSize}px "Open Sans"`;
    ctx.fillStyle = "white";
    for (let i = 0; i < keyCount; i++) {
        const char = i < writtenName.length ? writtenName[i] : '';
        const middle = width/2;
        const widthAllKeys = keyGap*(keyCount-1) + keyWidth*keyCount;
        const start = middle - widthAllKeys/2;
        const offset = i*keyWidth + i*keyGap;
        ctx.fillRect(start + offset, fontSize, keyWidth, keyHeight);
        if (char) {
            wasInput = true;
            const charWidth = ctx.measureText(char.toUpperCase()).width;
            const charOffset = keyWidth / 2 - charWidth / 2;
            ctx.fillText(char.toUpperCase(), start + offset + charOffset, fontSize - keyGap, keyWidth);
        }
    }
    const btn = document.getElementById("SubmitToLeaderboard");
    if (btn && document.getElementById("inputs").classList.contains("hidden") == false) {
        if (wasInput) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
}

async function SubmitName() {
    document.getElementById("inputs").classList.add("hidden")
    document.getElementById("SubmitToLeaderboard").classList.add("hidden")
    document.getElementById("buttons").classList.remove("hidden")
    const res = await fetch('/api/leaderboard/insert', {
        method: "POST",
        body: JSON.stringify({username:writtenName, score:roundFinalScore})
      });
}
