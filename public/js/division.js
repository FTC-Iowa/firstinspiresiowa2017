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
        var data = doc_snap.data();
        this.name = data.name;
        this.teamList = new TeamList(this, data.teams);
        this.matchList = new MatchList(this, data.matches);
        this.rankings = new Rankings(this, data.rankings, this.teamList);
        
        divisions[data.name] = this;
        
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
        var data = doc_snap.data();
        this.teamList.onUpdate(data.teams);
        this.matchList.onUpdate(data.matches);
        this.rankings.onUpdate(data.rankings);
    }
};