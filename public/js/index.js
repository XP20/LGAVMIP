const PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4anlkc3R3cXJ3Y2xkb3hlcnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1ODc3MzIsImV4cCI6MjA0MjE2MzczMn0.sZuQvNh_RLOPSeCVGpG0B6fvdVxI4WKR2gM2fH3bzJ0';
const _supabase = supabase.createClient('https://txjydstwqrwcldoxervr.supabase.co', PUBLIC_KEY);

function openLeaderboard() {
    document.getElementById('leaderboard').classList.remove('hidden');
}

function closeLeaderboard() {
    document.getElementById('leaderboard').classList.add('hidden');
}

async function getLeaderboard(limit, reversed=false) {
    const { data, error } = await _supabase.from('leaderboard')
        .select().order('score', { ascending: reversed }).limit(limit);
    
    if (error) {
        console.error(error);
        return;
    }

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    for (row of data) {
        const { user, score } = row;
        const leaderboardEntry = document.createElement("span");
        leaderboardEntry.classList.add('text-overflow')
        leaderboardEntry.appendChild(document.createTextNode(`${user} ${score}`));
        
        leaderboardList.appendChild(leaderboardEntry);
    }
}
getLeaderboard(10);