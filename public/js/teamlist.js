/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TeamList = function(div, teamArray, inspections) {
    this.init(div, teamArray, inspections);
};

TeamList.prototype = {
    
    init: function(div, teamArray, inspections) {
        console.log("Init TeamList");
        console.log("inspections", inspections);
        this.inspections = inspections;
        
        this.search = 0;
        this.div = div;
        this.data = teamArray;
        this.domList = document.getElementById("teamlist").cloneNode(true);
        
        this.domList.setAttribute("id", div.name + "-teams");
        this.domList.setAttribute("class", "teams hidden");
        this.ListTbody = this.domList.getElementsByTagName("tbody")[0];
        
        this.domInspect = document.getElementById("inspections").cloneNode(true);
        this.domInspect.setAttribute("id", div.name + "-inspections");
        this.domList.setAttribute("class", "inspections hidden");
        this.InspectTbody = this.domInspect.getElementsByTagName("tbody")[0];
        
        for (var i = 0, len = teamArray.length; i < len; i++) {
            this.updateRow(teamArray[i]);
        }        
        
        document.getElementById("content").appendChild(this.domList);
        document.getElementById("content").appendChild(this.domInspect);
    },
    
    onUpdate: function(teams, inspections) {
        this.teams = teams;
        this.inspections = inspections;
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
                var span = document.createElement("span");
                cell.appendChild(span);
                row.appendChild(cell);
            }
            
            var cell3 = document.createElement("td");
            var cell3_content = document.createElement("input");
            cell3_content.setAttribute("type", "checkbox");
            cell3.className = "team-notifcation-enable";
            if(thisEvent.notifications.areEnabled) {
                var sub = window.localStorage.getItem("notification-" + number);
                if(sub) {
                    
                }
                
            } else {
                cell3.className += " hidden";
            }
            cell3.appendChild(cell3_content);
            row.appendChild(cell3);
            this.ListTbody.appendChild(row);
        }
        
        cells = row.getElementsByTagName("span");
        
        cells[0].textContent = team.number;
        cells[1].textContent = team.name;
        
        this.updateInspectionRow(team.number);

        if (team.number === this.search) {
            row.setAttribute("class","highlight");
        } else {
            row.setAttribute("class", "");
        }
    },
    
    updateInspectionRow: function(teamNumber) {
        if(! this.inspections )
            return;
        var row = document.getElementById(this.div.name + "-inspection-" + teamNumber);
        if (row) {
            
        } else {
            row = document.createElement("tr");
            row.setAttribute("id", this.div.name + "-inspection-" + teamNumber);
            for(var i=0; i<5; i++) {
                var cell = document.createElement("td");
                var span = document.createElement("span");
                cell.appendChild(span);
                row.appendChild(cell);
            }
            this.InspectTbody.appendChild(row);
        }
        
        cells = row.getElementsByTagName("td");
        spans = row.getElementsByTagName("span");
        var inspection = this.inspections["_" + teamNumber];
        //console.log("number: "+teamNumber+" == "+ inspection);
        spans[0].textContent = teamNumber;
        spans[1].textContent = inspection.hw.start;
        cells[1].className = "state" + inspection.hw.state;
        spans[2].textContent = inspection.field.start;
        cells[2].className = "state" + inspection.field.state;
        spans[3].textContent = inspection.judge.start;
        cells[3].className = "state" + inspection.judge.state;
        spans[4].textContent = inspection.picture.start;
        cells[4].className = "state" + inspection.picture.state;
        
	if (teamNumber === this.search) {
            row.setAttribute("class","highlight");
        } else {
            row.setAttribute("class", "");
        }

    },
    
    getTeamName: function(number) {
        //console.log("Looking for team #", number);
        for(var i=0, len=this.data.length; i<len; i++){
            if(this.data[i].number === number) {
                return this.data[i].name;
            }
        }
        return "";
    },
    
    searchTeam: function(team) {
        this.search = team;
        this.onUpdate(this.teams, this.inspections);
    }
};
