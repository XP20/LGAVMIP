import re
from playwright.sync_api import Page, expect

URL = "http://localhost:3000/"

# Test opening main page and starting the game
def test_game_start(page: Page):
    page.goto(URL)
    page.get_by_test_id("start").click()
    expect(page).to_have_url(URL + 'start')
    page.wait_for_url(URL + 'start')

    page.locator('button').first
    panorama = page.locator('#pano').first
    expect(panorama).to_be_visible()

# Test leaderboard popup showing and hiding
def test_leaderboard_popup(page: Page):
    page.goto(URL)
    leaderboard_list = page.locator('#leaderboard').first
    expect(leaderboard_list).to_be_hidden()

    page.get_by_test_id("leaderboard").click()
    expect(leaderboard_list).to_be_visible()

    page.get_by_test_id("leaderboard-close").click()
    expect(leaderboard_list).to_be_hidden()

# Test settings popup showing and hiding
def test_settings_popup(page: Page):
    page.goto(URL)
    settings = page.locator("#settingsMenu").first
    expect(settings).to_be_hidden()

    page.get_by_test_id("settings").click()
    expect(settings).to_be_visible()

    settings.locator('button').last.click()
    expect(settings).to_be_hidden()

# Test dark mode toggling theme
def test_dark_mode_toggle(page: Page):
    page.goto(URL)
    settings = page.locator("#settingsMenu").first
    page.get_by_test_id("settings").click()

    # Clear theme
    page.evaluate("localStorage.removeItem('theme')")

    # Check toggling to dark mode
    expect(settings).to_be_visible()
    settings.locator('#darkModeButton').first.click()
    theme = page.evaluate("localStorage.getItem('theme')")
    assert theme == "dark"

    # Check persisting dark mode through refresh
    page.reload()
    page.get_by_test_id("settings").click()
    expect(settings).to_be_visible()
    settings = page.locator("#settingsMenu").first
    theme = page.evaluate("localStorage.getItem('theme')")
    assert theme == "dark"

    # Check reverting back to light mode
    settings.locator('#darkModeButton').first.click()
    theme = page.evaluate("localStorage.getItem('theme')")
    assert theme == "light"

# TODO
# TODO