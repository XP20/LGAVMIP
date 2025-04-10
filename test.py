from playwright.sync_api import Page, expect

URL = "http://localhost:3000/"

# Test opening main page and starting the game
def test_game_start(page: Page):
    page.goto(URL)
    # Navigate to game start menu
    page.get_by_test_id("start").click()
    expect(page).to_have_url(URL + 'start')
    page.wait_for_url(URL + 'start')

    # Start game and check for panorama visibility
    page.locator('button').first
    panorama = page.locator('#pano').first
    expect(panorama).to_be_visible()

# Test leaderboard popup showing and hiding
def test_leaderboard_popup(page: Page):
    page.goto(URL)
    # Check that leaderboard is hidden on start
    leaderboard_list = page.locator('#leaderboard').first
    expect(leaderboard_list).to_be_hidden()

    # Check that clicking button leaderboard opens
    page.get_by_test_id("leaderboard").click()
    expect(leaderboard_list).to_be_visible()

    # Check that clicking button leaderboard closes
    page.get_by_test_id("leaderboard-close").click()
    expect(leaderboard_list).to_be_hidden()

# Test settings popup showing and hiding
def test_settings_popup(page: Page):
    page.goto(URL)
    # Check that settings is hidden on start
    settings = page.locator("#settingsMenu").first
    expect(settings).to_be_hidden()

    # Check that clicking button settings opens
    page.get_by_test_id("settings").click()
    expect(settings).to_be_visible()

    # Check that clicking button settings closes
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

# Test leaderboard sorting buttons
def test_leaderboard_sorting(page: Page):
    page.goto(URL)
    leaderboard = page.locator('#leaderboard').first
    expect(leaderboard).to_be_hidden()

    # Open leaderboard
    page.get_by_test_id("leaderboard").click()
    expect(leaderboard).to_be_visible()

    # Get leaderboard initial order
    initial_list = leaderboard.locator('#leaderboard-list span').all_inner_texts()

    # Change sort order
    leaderboard.get_by_test_id('leaderboard-reverse').first.click()
    reordered_list = leaderboard.locator('#leaderboard-list span').all_inner_texts()

    # Check that sorting reorders list
    assert (len(initial_list) < 2) or (initial_list != reordered_list)

# Test main page button accessability
def test_main_page(page: Page):
    page.goto(URL)

    # Test that all buttons are visible and in viewport
    for button in page.get_by_role('button').all():
        expect(button).to_be_visible()
        expect(button).to_be_in_viewport()
