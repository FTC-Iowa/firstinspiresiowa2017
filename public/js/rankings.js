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


var Rankings = function(div, rankings, teamList) {
    this.init(div, rankings, teamList);
};

Rankings.prototype = {
    init: function(div, rankings, teamList) {
        console.log("Init Rankings");
        this.div = div;
        this.teams = teamList;
        this.dom = document.getElementById("rankings").cloneNode(true);
        this.dom.setAttribute("id", div.name + "-rankings");
        this.dom.setAttribute("class", "rankings hidden");
        this.tbody = this.dom.getElementsByTagName("tbody")[0];
        
        for(var i=0, len=rankings.length; i<len; i++) {
            this.updateRow(i, rankings[i]);
        }
        
        document.getElementById("content").appendChild(this.dom);
    },
    
    onUpdate: function(rankings) {
        for(var i=0, len=rankings.length; i<len; i++) {
            this.updateRow(i, rankings[i]);
        }
    },
    
    updateRow: function(i, ranking) {
        var row = document.getElementById(this.div.name + "-ranking-" + i);
        if ( row ) {
        } else {
            row = document.createElement("tr");
            row.setAttribute("id", this.div.name + "-ranking-" + i);
            
            var cells = [];
            for(var i=0;i<7;i++) {
                cells[i] = document.createElement("td");
                row.appendChild(cells[i]);
            }
            this.tbody.appendChild(row);
        }
        
        var cells = row.getElementsByTagName("td");
        cells[0].textContent = ranking.rank;
        cells[1].textContent = ranking.team;
        cells[2].textContent = this.teams.getTeamName(ranking.team);
        cells[3].textContent = ranking.qp;
        cells[4].textContent = ranking.rp;
        cells[5].textContent = ranking.highest;
        cells[6].textContent = ranking.matches;
        
    }
};