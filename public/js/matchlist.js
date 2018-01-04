/* 
 * Copyright 2017 vens.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var MatchList = function(div, matchArray) {
    this.init(div, matchArray);
};

MatchList.prototype = {
    
    init: function(div, matchArray) {
        console.log("Init MatchList");
        this.div = div;
        this.matchesDom = document.getElementById("matches").cloneNode(true);
        this.resultsDom = document.getElementById("results").cloneNode(true);
        
        this.matchesDom.setAttribute("id", div.name + "-matches");
        this.resultsDom.setAttribute("id", div.name + "-results");
        this.matchesDom.setAttribute("class", "matches hidden");
        this.resultsDom.setAttribute("class", "results hidden");
        
        var divDoms = this.resultsDom.getElementsByTagName("div");
        this.finalDom = divDoms[0];
        this.semifinal1Dom = divDoms[1];
        this.semifinal2Dom = divDoms[2];
        this.qualificationDom = divDoms[3];
        this.practiceDom = divDoms[4];
        this.finalTable = this.finalDom.getElementsByTagName("table")[0];
        this.semifinal1Table = this.semifinal1Dom.getElementsByTagName("table")[0];
        this.semifinal2Table = this.semifinal2Dom.getElementsByTagName("table")[0];
        this.qualificationTable = this.qualificationDom.getElementsByTagName("table")[0];
        this.practiceTable = this.practiceDom.getElementsByTagName("table")[0];
        
        this.matchesTbody = this.matchesDom.getElementsByTagName("tbody")[0];
        this.resultsTable = this.resultsDom.getElementsByTagName("table")[0];
        
        this.onUpdate(matchArray);
        
        ui.registerCallback(this, this.div.name + "-matchlist");
        
        document.getElementById("content").appendChild(this.matchesDom);
        document.getElementById("content").appendChild(this.resultsDom);
        this.setupDetailsBox();
    },
    
    getScore: function(team) {
        return team.auto + team.auto_bonus + team.teleop + team.endg + team.penalties;
    },
    
    getName: function(match) {
        var name = "";
        if(match.type === "Qualification") {
            name = "Q-" + match.number;
        } else if (match.type === "Semifinal") {
            name = "SF-" + Math.floor(match.number/10) + "-" + (match.number % 10) ;
        } else if (match.type === "Final") {
            name = "F-" + match.number;
        }
        return name;
    },
    
    setupDetailsBox: function() {
        this.detailsBox = { 
            dom: document.getElementById("match-details"),
            name: document.getElementById("match-details-name"),
            score: document.getElementById("match-details-score"),
            red: {
                teams: document.getElementById("match-details-red-teams"),
                total: document.getElementById("match-details-red-total"), 
                auto: document.getElementById("match-details-red-auto"),
                autobonus: document.getElementById("match-details-red-autobonus"),
                teleop: document.getElementById("match-details-red-teleop"),
                endg: document.getElementById("match-details-red-endg"),
                penalties: document.getElementById("match-details-red-penalties")
            },
            blue: {
                teams: document.getElementById("match-details-blue-teams"),
                total: document.getElementById("match-details-blue-total"), 
                auto: document.getElementById("match-details-blue-auto"),
                autobonus: document.getElementById("match-details-blue-autobonus"),
                teleop: document.getElementById("match-details-blue-teleop"),
                endg: document.getElementById("match-details-blue-endg"),
                penalties: document.getElementById("match-details-blue-penalties")
            }
            
        };
        
    },
    
    setTeamDetailsBox: function(teamBox, team) {
        var score = this.getScore(team);
        var teamString = "";
        teamString += team.teams[0].number;
        teamString += team.teams[0].surrogate ? "*" : "";
        for (var i=1, len=team.teams.length; i<len; i++) {
            teamString += "<br>";
            teamString += team.teams[i].number;
            teamString += team.teams[i].surrogate ? "*" : "";
        }
        teamBox.teams.innerHTML = teamString;
        teamBox.total.textContent = score;
        teamBox.auto.textContent = team.auto;
        teamBox.autobonus.textContent = team.auto_bonus;
        teamBox.teleop.textContent = team.teleop;
        teamBox.endg.textContent = team.endg;
        teamBox.penalties.textContent = team.penalties;
    },
    
    onCallback: function(number) {
        console.log("callback called: " + number);
        //return;
        var match = this.matches[number];
        var redScore = this.getScore(match.red);
        var blueScore = this.getScore(match.blue);
        var name = this.getName(match);
        var winner = "tie";
        if(redScore > blueScore) {
            winner = "red";
        } else if (redScore < blueScore ){
            winner = "blue";
        }
        
        this.detailsBox.name.textContent = name;
        this.detailsBox.name.setAttribute("class", winner + "-win");
        this.detailsBox.score.textContent = redScore +"-" + blueScore + " " + winner.toUpperCase();
        this.detailsBox.score.setAttribute("class", winner + "-win");
        
        this.setTeamDetailsBox(this.detailsBox.red, match.red);
        this.setTeamDetailsBox(this.detailsBox.blue, match.blue);
            
        ui.showDetails(this.detailsBox.dom);
    },
    
    onUpdate: function(matches) {
        this.matches = matches;
        for (var i=0, len=matches.length; i<len; i++) {
            var match = matches[i];
            if(match.type === "Qualification") {
                this.updateRowMatches(match);
            }
            this.updateRowResults(i, match);
        }
    },
    
    updateRowMatches: function(match) {
        var tbody = this.matchesTbody;
        var row = document.getElementById(this.div.name + "-matches-" + match.number);
        if (row) {
            
        } else {
            row = document.createElement("tr");
            row.setAttribute("id", this.div.name + "-matches-" + match.number);
            
            for(var i=0; i<5; i++) {
                var cell = document.createElement("td");
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
        }
        
        var red1 = match.red.teams[0].number + 
                (match.red.teams[0].surrogate ? "*" : "");
        var red2 = match.red.teams[1].number + 
                (match.red.teams[1].surrogate ? "*" : "");
        var blue1 = match.blue.teams[0].number + 
                (match.blue.teams[0].surrogate ? "*" : "");
        var blue2 = match.blue.teams[1].number + 
                (match.blue.teams[1].surrogate ? "*" : "");
        
        var cells = row.getElementsByTagName("td");
        cells[0].textContent = match.number;
        cells[1].textContent = red1;
        cells[2].textContent = red2;
        cells[3].textContent = blue1;
        cells[4].textContent = blue2;
        
    },
    
    updateRowResults: function(idx, match) {
        if (!match.red.hasOwnProperty('teleop')) {
            // match has not been played yet
            return;
        }
        
        var tbody = document.getElementById(this.div.name + "-results-" + match.type + "-" + match.number);
        if (tbody) {
            
        } else {
            tbody = document.createElement("tbody");
            tbody.setAttribute("id", this.div.name + "-results-" + match.type + "-" + match.number);
            var row1 = document.createElement("tr");
            var row2 = document.createElement("tr");
            var row3 = document.createElement("tr");
            var cells = [];
            for(var i=0;i<8;i++) {
                cells[i] = document.createElement("td");
            }
            
            row1.appendChild(cells[0]);
            row1.appendChild(cells[1]);
            row1.appendChild(cells[2]);
            row1.appendChild(cells[3]);
            row2.appendChild(cells[4]);
            row2.appendChild(cells[5]);
            tbody.appendChild(row1);
            tbody.appendChild(row2);
            
            if(match.red.teams.length === 2) {
                cells[0].setAttribute("rowspan", "2");
                cells[1].setAttribute("rowspan", "2");
            } else if (match.red.teams.length === 3) {
                cells[0].setAttribute("rowspan", "3");
                cells[1].setAttribute("rowspan", "3");      
                row3.appendChild(cells[6]);
                row3.appendChild(cells[7]);
                tbody.appendChild(row3);
            }
            
            
            
            
            switch (match.type) {
                case "Practice":
                    this.practiceTable.insertBefore(tbody, this.practiceTable.firstChild);
                    this.practiceDom.className = "";
                    break;
                case "Qualification":
                    this.qualificationTable.insertBefore(tbody, this.qualificationTable.firstChild);
                    this.qualificationDom.className = "";
                    break;
                case "Semifinal":
                    var num = Math.floor(match.number/10);
                    if (num===1){
                        this.semifinal1Table.insertBefore(tbody, this.semifinal1Table.firstChild);
                        this.semifinal1Dom.className = "";
                        break;
                    } else {
                        this.semifinal2Table.insertBefore(tbody, this.semifinal2Table.firstChild);
                        this.semifinal2Dom.className = "";
                        break;
                    }
                case "Final":
                    this.finalTable.insertBefore(tbody, this.finalTable.firstChild);
                    this.finalDom.className = "";
                    break;                    
            }
            //this.resultsTable.appendChild(tbody);
        }
        
        var cells = tbody.getElementsByTagName("td");
        
        
        var redScore, blueScore;
        redScore = this.getScore(match.red);
        blueScore = this.getScore(match.blue);
        
        var name = this.getName(match);
        
        cells[0].textContent = name;
        var callback = "ui.onCallback('" + this.div.name + "-matchlist', " + idx + ")";
        tbody.setAttribute("onclick", callback);
        
        var winner;
        if(redScore > blueScore) {
            cells[1].setAttribute("class", "red-win");
            winner = "R";
        } else if(redScore < blueScore) {
            cells[1].setAttribute("class", "blue-win");
            winner = "B";
        } else {
            cells[1].setAttribute("class", "tie-win");
            winner = "T";
        }
        
        cells[1].textContent = redScore + "-" + blueScore + " " + winner;
        cells[2].textContent = match.red.teams[0].number + (match.red.teams[0].surrogate ? "*" : "");
        cells[3].textContent = match.blue.teams[0].number + (match.blue.teams[0].surrogate ? "*" : "");
        cells[4].textContent = match.red.teams[1].number + (match.red.teams[1].surrogate ? "*" : "");
        cells[5].textContent = match.blue.teams[1].number + (match.blue.teams[1].surrogate ? "*" : "");
        if (match.red.teams.length ===  3) {
            cells[6].textContent = match.red.teams[2].number + (match.red.teams[2].surrogate ? "*" : "");
            cells[7].textContent = match.blue.teams[2].number + (match.blue.teams[2].surrogate ? "*" : "");
        } 
    }
};