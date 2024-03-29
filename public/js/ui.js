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
        
        this.detailsBack = document.getElementById("detail-back");
        this.detailsBox = document.getElementById("detail-box");
        this.templates = document.getElementById("templates");
        this.detailsBack.setAttribute("onclick", "ui.hideDetails()");
        
        this.onResize();
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
            this.hide(articles[i]);
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
            judging.className = "hidden";
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
        var maps = document.getElementById("td-map");
        if(state) {
            this.hide(maps);
            this.unhide(awards);
        } else {
            this.hide(awards);
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
    },
    
    showSchedule: function() {
        var e = document.getElementById("td-schedule");
        this.unhide(e);
    },
    
    showTwitter: function() {
        var e = document.getElementById("td-twitter");
        this.unhide(e);
    },
    
    hide: function(element) {
       element.className += ' hidden'; 
    },
    
    unhide: function(element) {
        element.className = element.className.replace(/hidden/g, '');
    },
    
    showDetails: function(content) {
        this.detailsBox.appendChild(content);
        this.unhide(this.detailsBack);
    },
    
    hideDetails: function() {
        this.hide(this.detailsBack);
        var content = this.detailsBox.firstElementChild;
        this.templates.appendChild(content);
    },
    
    onNotificationEnableClick: function() {
        console.log("onNotificationEnableClick");
        thisEvent.notifications.enable();
    },
    
    setNotificationsEnabled: function() {
        console.log("hide notification button");
        var btns = document.getElementsByClassName("notification-enable");
        for (var i=0; i<btns.length; i++ ) {
            this.hide(btns[i]);
        }
        
        var checks = document.getElementsByClassName("team-notifcation-enable");
        for (var i=0; i<checks.length; i++ ) {
            this.unhide(checks[i]);
            console.log("showing check", i);
        }
    },
    
    onResize: function() {
        console.log("Resize Event");
        var header = document.getElementById("header");
        var footer = document.getElementById("footer");
        var content = document.getElementById("content");
        var twitter = document.getElementById("event-twitter");
        var twitterContainer = document.getElementById("twitter-container");
        var twitterWidget = document.getElementById("twitter-widget-0");
        var vp = window.innerHeight;
        var size = header.offsetHeight + footer.offsetHeight;
        var height = vp - size - 20;
        content.setAttribute("style", "min-height:"+height+"px;");
        twitter.setAttribute("style", "height:"+height+"px;");
        if(twitterContainer) {
            twitterContainer.setAttribute("data-height", height);
        }
        if(twitterWidget) {
            var style = twitterWidget.getAttribute("style");
            style += "height:" + height+"px;";
            
            twitterWidget.setAttribute("style", style);
        }
    },
    
    onSearchClick: function() {
        var team = document.getElementById("team-search-input").value;
        console.log("Search clicked with query", team);
        thisEvent.searchTeam(Number(team));
    }
};

ui = new Ui();

window.addEventListener('resize', ui.onResize, true);
