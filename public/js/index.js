function openLeaderboard() {
    document.getElementById('leaderboard').classList.remove('hidden');
}

function closeLeaderboard() {
    document.getElementById('leaderboard').classList.add('hidden');
}

async function getMOTD() {
    res = await fetch('/api/motd',{method:'GET'});
    document.getElementById('motd').innerText = await res.text();
}

async function getLeaderboard(limit, reversed=false) {
    fetch('/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify({
            from: 0,
            limit: limit,
            reversed: reversed
        })
    }).then(res => {
        if (!res.ok) return Promise.reject();
        else return res.json();
    }).then(data => {
        console.log(data);
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
    
        for (row of data) {
            const { username, score } = row;
            const leaderboardEntry = document.createElement("span");
            leaderboardEntry.classList.add('text-overflow')
            leaderboardEntry.appendChild(document.createTextNode(`${username} ${score}`));
            leaderboardList.appendChild(leaderboardEntry);
        }
    }).catch(err => {
        console.error(err);
    });
}
getMOTD();
getLeaderboard(10);