function openLeaderboard() {
    document.getElementById('leaderboard').classList.remove('hidden');
}

function closeLeaderboard() {
    document.getElementById('leaderboard').classList.add('hidden');
}

async function getLeaderboard(from = 0, count = 10, reversed = false) {
    const response = await fetch('/api/leaderboard/test', {
        method: 'POST',
        body: JSON.stringify({
            from: from,
            count: count,
            reversed: reversed,
        }),
    });
    const result = await response.json();

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    for (const entry of result) {
        const [key, value] = entry;
        const leaderboardEntry = document.createElement("span");
        leaderboardEntry.appendChild(document.createTextNode(`${key} - ${value}`));

        leaderboardList.appendChild(leaderboardEntry);
    }
}
getLeaderboard();