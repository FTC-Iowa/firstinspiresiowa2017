/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TeamList = function(div, teamArray) {
    this.init(div, teamArray);
};

TeamList.prototype = {
    
    init: function(div, teamArray) {
        console.log("Init TeamList");
        
        this.div = div;
        this.data = teamArray;
        this.dom = document.getElementById("teamlist").cloneNode(true);
        
        this.dom.setAttribute("id", div.name + "-teams");
        this.dom.setAttribute("class", "teams hidden");
        this.tbody = this.dom.getElementsByTagName("tbody")[0];
        
        for (var i = 0, len = teamArray.length; i < len; i++) {
            this.updateRow(teamArray[i]);
        }        
        
        document.getElementById("content").appendChild(this.dom);
    },
    
    onUpdate: function(teams) {
        for (var i = 0, len = teams.length; i < len; i++) {
            this.updateRow(teams[i]);
        }     
    },
    
    updateRow: function(team/*, teambefore*/) {
        var number = team.number;
        var row = document.getElementById(this.div.name + "-teamlist-" + number);
        if ( row ) {
            
        } else {
            row = document.createElement("tr");
            row.setAttribute("id", this.div.name + "-teamlist-" + number);
            
            for(var i=0;i<2;i++) {
                var cell = document.createElement("td");
                row.appendChild(cell);
            }
            
            var cell3 = document.createElement("td");
            var cell3_content = document.createElement("input");
            cell3_content.setAttribute("type", "checkbox");
            cell3.className = "team-notifcation-enable";
            if(thisEvent.notifications.areEnabled) {
                var sub = window.localStorage.getItem("notification-" + number);
                
                
            } else {
                cell3.className += " hidden";
            }
            cell3.appendChild(cell3_content);
            row.appendChild(cell3);
            this.tbody.appendChild(row);
        }
        
        cells = row.getElementsByTagName("td");
        
        cells[0].textContent = team.number;
        cells[1].textContent = team.name;
        
    },
    
    getTeamName: function(number) {
        for(var i=0, len=this.data.length; i<len; i++){
            if(this.data[i].number === number) {
                return this.data[i].name;
            }
        }
        return "";
    }
};