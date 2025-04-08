function openSettings() {
    setElementVisible("settingsMenu");
    document.getElementById("settingsBox").classList.add("scale-100")
    document.getElementById("settingsBox").classList.remove("scale-0")
};
    
function exitSettingsMenu() {
    document.getElementById("settingsBox").classList.add("scale-0")
    document.getElementById("settingsBox").classList.remove("scale-100")
    setElementHidden("settingsMenu");
} 

const isDarkPreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDark = () => (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && isDarkPreference()));
const setTheme = (theme) => localStorage.setItem('theme', theme ? "dark" : "light");

const isCheckmark = () => document.getElementById("darkModeButton").checked;
const updateDarkMode = (toggle=true) => {
    if (toggle) setTheme(!isDark());
    document.getElementById("darkModeButton").checked = isDark();
    document.getElementById("darkModeIcon").src = isDark() ? "/public/assets/moon.svg" : "/public/assets/sun.svg";
    document.documentElement.classList.toggle("dark", isDark());
}
window.onload = () => updateDarkMode(false);
