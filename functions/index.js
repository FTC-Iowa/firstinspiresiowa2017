const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Firestore = require('@google-cloud/firestore');

admin.initializeApp (functions.config().firebase);
const firestore = new Firestore(functions.config().firebase);

/*
exports.matches = functions.https.onRequest((req, res) => {
	var matches = req.body.matches;
	if(Array.isArray(matches)){
		matches.forEach( function (m) {	
			var docname = "Events/" + m.event + "/Matches/" + m.name;
			console.log(docname);
			var doc = firestore.collection("Events").doc(m.event).collection("Matches").doc(m.name);
			console.log(`Path of document is ${doc.path}`)
			doc.set( {
				number: m.number,
				red: m.red,
				blue: m.blue
			}).then(() => {
				console.log("done!");
			}).catch((err) => {
				console.log(`Failed to create document: ${err}`);
			});
		});
	}
	res.status(200).send("done!");
});*/

function updateTeam(team) {
    var eventId = this.eventId;
    console.log("team update");
    var eventDocName = "events/" + this.eventId;
    var divisionDocName = eventDocName + "/divisions/" + this.divisionId;
    var doc = firestore.collection(divisionDocName);
    
}

function updateMatches(match) {
    console.log("match update");
}

function updateRankings(ranking) {
    
}
 
function parseUpdate(update) {
    var eventId = this.eventId;
    var divisionId = this.divisionId;
    console.log("update");
    if (update == null) {
        console.log("update == null");
        return;
    }
    if( update.teams ) {
        update.teams.forEach ( updateTeam );
    }
    if( update.matches ) {
        update.matches.forEach ( updateMatches );
    }
    if( update.rankings ) {
        update.rankings.forEach ( updateRankings );
    }
}

exports.update = functions.https.onRequest((req, res) => {
	//var ret = "Teams: "
	var data = req.body;
        //var updates = data.updates;  // updates is an array of json objects
        
        console.log("got data");
        //updates.forEach( parseUpdate, data ); // parse each update in the updates array
        
        if (data.passphrase !== "x") {
            res.status(401).sent("Incorrect Passphrase");
        }
        
        if ( data.data && data.eventId && data.divisionId ) {
        
            var event = data.eventId;
            var division = data.divisionId;

            var doc = firestore.collection("events").doc(event).collection("divisions").doc(division);
            doc.set(data.data);
            res.status(200).send("done!");
        }
        
        res.status(400).send("Invalid request");
        
        
        
        
	/*if(Array.isArray(data.teams)) {
		data.teams.forEach( function (i) {
	//		ret += i.number + ", ";
			var docname = 'Teams/' + i.number;
			var doc = firestore.doc(docname);
			doc.set({
				Name: i.teamname,
				School: i.school,
				City: i.city,
				State: i.state,
				Country: i.country,
			}).then(() => {
				console.log("Create " + docname);
			});
			
		})
	}*/
});


