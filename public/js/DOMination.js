//simple DOM manipulation things, hopefully doesnt turn into React TempleOS edition
function toggleElementVisibility(elementID){
    if (document.getElementById(elementID)!=undefined) {
        document.getElementById(elementID).classList.contains('hidden') ? document.getElementById(elementID).classList.remove('hidden') : document.getElementById(elementID).classList.add('hidden');
    }
}
function setElementVisible(elementID) {
    if (document.getElementById(elementID)!=undefined) {
        if (document.getElementById(elementID).classList.contains('hidden')) document.getElementById(elementID).classList.remove('hidden');
    }
}
function setElementHidden(elementID) {
    if (document.getElementById(elementID)!=undefined) {
        document.getElementById(elementID).classList.add('hidden');
    }
}
async function loadHTML(url) {
    const res = await fetch(url, {method: "GET"});
    if (res.ok) {
        console.log(res);
    } 
    return res.text();
}
function addScript(src) {
    return new Promise((resolve, reject) => {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
        s.onload = () => resolve(s);
        s.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.getElementsByTagName('head')[0].appendChild(s);
    });
}