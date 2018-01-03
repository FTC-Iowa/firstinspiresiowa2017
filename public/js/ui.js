/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Ui = function() {
    this.init();
}; 


Ui.prototype = {
    init: function() {
        console.log("ui init");
        this.activeDiv = 0;
        this.divisions = [];
        this.divisions[0] = "event";
        this.activeFirstRow = "event";
        this.activeSecondRow = "information";
        this.activeThirdRow = "teams";
        this.callbacks = {};
    },
    
    onBtnClick: function(name) {
        console.log("button " + name + " clicked");
        var btn = document.getElementById('btn-'+name);
        if(false && btn.className.includes("selected")) {
            // button was already selected.  probably nothing to do
        } else {
            var str = 'header nav .' + btn.className;
            $(str).removeClass('selected');
            btn.className += " selected";
            var nav_scores = document.getElementById("nav-scores");
            var nav_event = document.getElementById("nav-event");
            if(name === "event") {
                console.log('event path');
                nav_scores.className += " hidden";
                nav_event.className = "";
                this.activeFirstRow = "event";
                this.onBtnClick(this.activeSecondRow);
            } else if(btn.className.includes("first-row")) {
                console.log("second path");
                nav_event.className += " hidden";
                nav_scores.className = "";
                this.activeFirstRow = name;
                this.onBtnClick(this.activeThirdRow);
            } else {
                if (btn.className.includes("second-row")) {
                    this.activeSecondRow = name;
                } else if (btn.className.includes("third-row")) {
                    this.activeThirdRow = name;
                }
                this.hideAll();
                this.setVisible(name);
                
            }
            
            
            
        }
        
        
        
    },
    
    hideAll: function() {
        var articles = document.getElementById("content").getElementsByTagName("article");
        for (var i=0, len=articles.length; i<len; i++ ){
            articles[i].className += ' hidden';
        }
    },
    
    setVisible: function(name) {
        var divName = this.activeFirstRow;
        var id = divName + "-" + name;
        console.log("id=", id);
        var article = document.getElementById(id);
        article.className = article.className.replace(/ hidden/g, '');
    },
    
    addDivision: function(name) {
        var row = document.getElementById("first-row");
        var cell = row.insertCell();
        var divNumber = this.divisions.length;
        this.divisions[divNumber] = name;
        cell.innerHTML = '<a href="#" id="btn-'+ name +'" class="first-row" onclick=ui.onBtnClick("' + name + '")>' + name + '</a>';
    },
    
    setPhase: function(phase) {
        var inspection = document.getElementById("td-inspections");
        var judging = document.getElementById("td-judging");
        var matches = document.getElementById("td-matches");
        var results = document.getElementById("td-results");
        var rankings = document.getElementById("td-rankings");
        if(phase === "morning") {
            inspection.className = "";
            judging.className = "";
            matches.className = "hidden";
            results.className = "hidden";
            rankings.className = "hidden";
        } else if (phase === "qual") {
            inspection.className = "hidden";
            judging.className = "hidden";
            matches.className = "";
            results.className = "";
            rankings.className = "";
        }
    },
    
    setAwardsVisible: function(state) {
        var awards = document.getElementById("td-awards");
        if(state) {
            awards.className = "";
        } else {
            awards.className = "hidden";
        }
    },
    
    registerCallback: function(obj, id) {
        this.callbacks[id] = obj;
    },
    
    onCallback: function(id, param) {
        console.log("callback called");
        var obj = this.callbacks[id];
        if (obj) {
            console.log("calling callback");
            obj.onCallback(param);
        } else {
            console.log("unkown callback function");
        }
    }
};

ui = new Ui();
