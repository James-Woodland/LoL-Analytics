
/** @type {import('./$types').PageLoad} */
export async function load(){
    let teams = [{"name": "", "wins": "0", "shortName": ""}, {"name": "", "wins": "0", "shortName": ""}]
	var tournamentName = ""
	var leagueName = ""
	var matchDateTime = ""
	let resultInfo = [{"match": 0, "winner": 0, "side": 0}, 
						{"match": 0, "winner": 0, "side": 0}, 
						{"match": 0, "winner": 0, "side": 0}, 
						{"match": 0, "winner": 0, "side": 0}, 
						{"match": 0, "winner": 0, "side": 0}]
    var id = ""
    try {
        const queryString = window.location.search;
        var gameResult = {}
        const urlParams = new URLSearchParams(queryString);
        id = urlParams.get("id")
        let match = "http://localhost:8080/Matches?filter={%22id%22:%22"+urlParams.get("id")+"%22}"
        let matchResponse = await fetch(match, 
            { 
            method: 'get', 
            headers: new Headers({
                'Authorization': 'Basic '+btoa("admin:secret")
            })}).then((x) => x.json());
        for (let i = 0; i < matchResponse[0]["teams"].length; i++) {
            var wins = 0
            teams[i]["name"] = matchResponse[0]["teams"][i]["name"].replace(" ", "_")
            teams[i]["shortName"] = matchResponse[0]["teams"][i]["shortName"]
            for (let j = 0; j < matchResponse[0]["games"].length; j++) {
                if (matchResponse[0]["games"][j]["winnerTeamId"] == matchResponse[0]["teams"][i]["id"]) {
                    wins = wins + 1
                }				
            }
            teams[i]["wins"] = wins
        }
        for (let j = 0; j < matchResponse[0]["games"].length; j++) {			
            if (matchResponse[0]["games"][j]["winnerTeamId"] == matchResponse[0]["teams"][0]["id"]) {
                resultInfo[j]["match"] = j + 1
                resultInfo[j]["winner"] = 0
                resultInfo[j]["side"] = matchResponse[0]["games"][j]["winnerSide"]
            }		
            else{
                resultInfo[j]["match"] = j + 1
                resultInfo[j]["winner"] = 1
                resultInfo[j]["side"] = matchResponse[0]["games"][j]["winnerSide"]
            }
        }
        matchDateTime = new Date(matchResponse[0]["startTime"])
        matchDateTime = matchDateTime.toString()
        let tournamentQuery = "http://localhost:8080/Tournaments?filter={%22id%22:%22"+matchResponse[0]["tournamentId"]+"%22}"
        let tournamentResponse = await fetch(tournamentQuery, 
            { 
            method: 'get', 
            headers: new Headers({
                'Authorization': 'Basic '+btoa("admin:secret")
            })}).then((x) => x.json());
        tournamentName = tournamentResponse[0]["name"]
        let leagueQuery = "http://localhost:8080/Leagues?filter={%22id%22:%22"+tournamentResponse[0]["leagueId"]+"%22}"
        let leagueResponse = await fetch(leagueQuery, 
            { 
            method: 'get', 
            headers: new Headers({
                'Authorization': 'Basic '+btoa("admin:secret")
            })}).then((x) => x.json());
        leagueName = leagueResponse[0]["name"]
        let EMHQuery = "http://localhost:8080/EMH?filter={%22gameId%22:%22"+matchResponse[0]["games"][urlParams.get("game")-1]["id"]+"%22}"
        let EMHResponse = await fetch(EMHQuery, 
            { 
            method: 'get', 
            headers: new Headers({
                'Authorization': 'Basic '+btoa("admin:secret")
            })}).then((x) => x.json());
        console.log(EMHResponse)
    } catch (error) {
        console.log(error)
    }
    return [resultInfo, teams, matchDateTime, tournamentName, leagueName, id]
}