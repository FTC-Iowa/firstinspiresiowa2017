/* 
 * Copyright 2018 vens.
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

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

var Awards = function(awards) {
    this.init(awards);
};

Awards.prototype = {
    init: function(awards) {
        console.log("awards", awards);
        
        this.placeholder = document.getElementById("award-placeholder");
        
        if (awards.length > 0) {
            this.parseAwards(awards);
			ui.setAwardsVisible(true);
        }
        
    },
    
    onChange: function(awards) {
        if (awards.length > 0) {
            this.parseAwards(awards);
            ui.setAwardsVisible(true);
        }
    },
    
    parseAwards: function(awards) {
        console.log("Parsing Awards");
        
        for (var i=0; i<awards.length; i++) {
            this.parseAward(awards[i]);
        }
    },
    
    parseAward: function(award) {
        switch(award.name) {
            case "Inspire Award":
                this.insertTeamAward("inspire", award);
                break;
            case "Think Award":
                this.insertTeamAward("think", award);
                break;
            case "Connect Award":
                this.insertTeamAward("connect", award);
                break;
            case "Rockwell Collins Innovate Award":
                this.insertTeamAward("innovate", award);
                break;
            case "Design Award":
                this.insertTeamAward("design", award);
                break;
            case "Motivate Award":
                this.insertTeamAward("motivate", award);
                break;
            case "Control Award":
                this.insertTeamAward("control", award);
                break;
            case "Promote Award":
                this.insertTeamAward("promote", award);
                break;
            case "Compass Award":
                this.insertNonTeamAward("compass", award);
                break;
            case "Dean's List Semi-Finalist Award":
            case "Dean's List Finalist Award":
                break;
            default:
                if(award.name.endsWith("Winning Alliance") || 
                        award.name.endsWith("Finalist Alliance")) {
                    break;
                }
                console.log("Judges Award: ", award.name);
                
                this.createJudgesAward(award);
                
                break;
        }
    },
    
    createJudgesAward: function(award) {
        var name = award.name.hashCode();
        var div = document.getElementById("award-" + name);
        
        if ( !div ) {
            var dom = document.getElementById("award-judges").cloneNode(true);
            dom.getElementsByTagName("h2")[0].textContent = award.name;
            var fields = dom.getElementsByTagName("dd");
            fields[0].setAttribute("id", "award-"+name+"-1");
            fields[1].setAttribute("id", "award-"+name+"-2");
            fields[2].setAttribute("id", "award-"+name+"-3");
            
            dom.setAttribute("id", "award-" + name);
            dom.setAttribute("class", "hidden");
            var list = document.getElementById("award-list");
            list.appendChild(dom);
        }
        
        this.insertTeamAward(name, award);
        
    },
    
    insertTeamAward: function(name, award) {
        var cnt = 0;
        var div = document.getElementById("award-" + name);
        var win1 = document.getElementById("award-" + name + "-1");
        var win2 = document.getElementById("award-" + name + "-2");
        var win3 = document.getElementById("award-" + name + "-3");
        
        if(award.winner[0]) {
            win1.textContent = award.winner[0] + " - " + thisEvent.getTeamName(award.winner[0]);
            cnt++;
        }
        if(award.winner[1]) {
            win2.textContent = award.winner[1] + " - " + thisEvent.getTeamName(award.winner[1]);
            cnt++;
        }
        if(award.winner[2]) {
            win3.textContent = award.winner[2] + " - " + thisEvent.getTeamName(award.winner[2]);
            cnt++;
        }

        if(award.winner[1] === 0 && award.winner[2] === 0) {
            div.getElementsByTagName("dt")[1].setAttribute("class", "hidden");
        }

        // only show the award if it was handed out
        if(cnt > 0) {  
            ui.hide(this.placeholder);
            ui.unhide(div);
        }
    },
    
    insertNonTeamAward: function(name, award) {
        var div = document.getElementById("award-" + name);
        var win = document.getElementById("award-" + name + "-1");
        
        if ( award.winner.length > 2 ) {
            win.textContent = award.winner;
            ui.unhide(div);
        }
    }
    
};
