/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Division = function(doc_ref, doc_snap) {
    this.init(doc_ref, doc_snap);
};

var divisions = {};

Division.prototype = {
    
    
    init: function(doc_ref, doc_snap) {
        this.firstload = true;
        this.document = doc_ref;
        console.log("div = " + doc_snap.data().name);
        this.data = doc_snap.data();
        this.name = this.data.name;
        this.teamList = new TeamList(this, this.data.teams, thisEvent.eventData.inspections[this.name]);
        this.matchList = new MatchList(this, this.data.matches);
        this.rankings = new Rankings(this, this.data.rankings, this.teamList);
        
        divisions[this.data.name] = this;
        
        doc_ref.onSnapshot(function(doc) {
            divisions[doc.data().name].onChange(doc);
        });
    },
    
    onChange: function(doc_snap) {
        console.log("onChange function");
        if(this.firstload){
            this.firstload = false;
            //return;
        }
        this.data = doc_snap.data();
        this.teamList.onUpdate(this.data.teams, thisEvent.eventData.inspections[this.name]);
        this.matchList.onUpdate(this.data.matches);
        this.rankings.onUpdate(this.data.rankings);
    },
    
    updateInspections: function(inspections) {
        this.teamList.onUpdate(this.data.teams, inspections[this.name]);
    },

   searchTeam: function(team) {
        this.teamList.searchTeam(team);
    //    this.matchList.searchTeam(team);
    //    this.rankings.searchTeam(team);
    }
};
