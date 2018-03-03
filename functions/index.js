const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Firestore = require('@google-cloud/firestore');
var deepEqual = require('deep-equal');


admin.initializeApp (functions.config().firebase);
const firestore = new Firestore(functions.config().firebase);


//function updateTeam(team) {
//    var eventId = this.eventId;
//    console.log("team update");
//    var eventDocName = "events/" + this.eventId;
//    var divisionDocName = eventDocName + "/divisions/" + this.divisionId;
//    var doc = firestore.collection(divisionDocName);
//    
//}
//
//function updateMatches(match) {
//    console.log("match update");
//}
//
//function updateRankings(ranking) {
//    
//}
 
//function parseUpdate(update) {
//    var eventId = this.eventId;
//    var divisionId = this.divisionId;
//    console.log("update");
//    if (update === null) {
//        console.log("update == null");
//        return;
//    }
//    if( update.teams ) {
//        update.teams.forEach ( updateTeam );
//    }
//    if( update.matches ) {
//        update.matches.forEach ( updateMatches );
//    }
//    if( update.rankings ) {
//        update.rankings.forEach ( updateRankings );
//    }
//}

exports.update = functions.https.onRequest((req, res) => {
    var data = req.body;

    if (data.passphrase !== "x") {
        res.status(401).sent("Incorrect Passphrase");
    }

    if ( data.data && data.eventId && data.divisionId ) {

        var event = data.eventId;
        var division = data.divisionId;

        var doc = firestore.collection("events").doc(event).collection("divisions").doc(division);
        doc.set(data.data);

        if ( data.awards ) {
            console.log("Saving Award Data!");
            var eventdoc = firestore.collection("events").doc(event);
            eventdoc.set({awards: data.awards}, {merge: true});
            console.log("award: ", JSON.stringify(data.awards));
        }

        if ( data.finals ) {
            var eventdoc = firestore.collection("events").doc(event);
            eventdoc.set({finals: data.finals}, {merge: true});
        }

        res.status(200).send("done!");
    } else {
        res.status(400).send("Invalid request");
    }
});

exports.eventUpload = functions.https.onRequest((req, res) => {
    var data = req.body;
    
    if ( data && data.passphrase && data.eventId ) {
        var event = data.eventId;
        var doc = firestore.collection("events").doc(event);
        //if ( data.passphrase === doc.data().passphrase ) {
            doc.set(data, {merge: true});
            console.log("Applying patch to event:", JSON.stringify(data));
            res.status(200).send("done!");
        //} else {
        //    res.status(401).sent("Incorrect Passphrase");            
        //}
    }
});


exports.apiAccess = functions.https.onRequest((req, res) => {
    console.log("apiAcces: req.query:", JSON.stringify(req.query));
    var eventId = req.query.event;
    var divId = req.query.division;
   
    var doc = firestore.collection("events").doc(eventId).collection("divisions").doc(divId);
    doc.get().then( function(doc) {
        res.status(200).send(JSON.stringify(doc.data()));
    }).catch( function (e) {
        res.status(400).send("error: " + e);
    });
});



function getMatchName(match) {
    var name = "";
    if(match.type === "Qualification") {
        name = "Q-" + match.number;
    } else if (match.type === "Semifinal") {
        name = "SF-" + Math.floor(match.number/10) + "-" + (match.number % 10) ;
    } else if (match.type === "Final") {
        name = "F-" + match.number;
    }
    return name;
}

function getMatchScore(team) {
    return team.auto + team.auto_bonus + team.teleop + team.endg + team.penalties;
}

exports.onDataChanged = functions.firestore.document('events/{eventid}/divisions/{divid}').onWrite((event) => {
    var newValue = event.data.data();
    var prevValue = event.data.previous.data();
    
    if ( newValue.matches ) {
        var i;
        for(i=0; i<newValue.matches.length; i++) {
            var match = newValue.matches[i];
            if ( prevValue.matches[i] ) { // fi this match existed before 
                var same = deepEqual(match, prevValue.matches[i]);
                if ( same ) {
                    // match didn't change
                    console.log("match didn't change");
                    continue;
                }
                else {
                    console.log("match changed!");
                }
            }
            
            // either this match didn't exist already, or has changed.
            
            // see if this has a valid score
            if ( typeof match.red.teleop !== 'undefined' && typeof match.blue.teleop !== 'undefined' ) {
                // get the score
                var redScore = getMatchScore(match.red);
                var blueScore = getMatchScore(match.blue);
                var name = getMatchName(match);
                var winner = redScore>blueScore ? "R" : blueScore>redScore ? "B" : "T"
                
                // log it
                console.log("Match changed: " + name + " " + redScore + "-" + blueScore + " " + winner);
                
                
                var payload = {
                    notification: {
                      title: "Hello World",
                      body: "Here is some body text"
                    }
                    //data: match
                };
                
                admin.messaging().sendToTopic("100", payload)
                    .then(function(response) {
                        console.log("Successfully sent message:", response);
                }).catch(function(error) {
                        console.log("Error sending message:", error);
                })
                
                
                
                
            } else {
                console.log("no score? red="+match.red.teleop+", blue="+match.blue.teleop+", match="+JSON.stringify(match));
            }
        }
    }
    return;    
});

exports.subscribe = functions.https.onRequest((req, res) => {
    var data = req.body;
    if( data.token && data.topic ){
        admin.messaging().subscribeToTopic(data.token, data.topic)
            .then(function(response) {
                console.log("successfully subscribed to topic:", response);
            }).catch(function(error) {
                console.log("Error subscribing to topic:", error);
        });
        res.status(200).send("done!");
    } else {
        console.log("Invalid request:", JSON.stringify(data));
        res.status(400).send("Invalid request");
    }
});

//{eventId: event_id, number: number, division: division, type: inspectionType, state: state, password: "pass"}
exports.inspectionUpdate = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var data = req.body;
        if (data.hasOwnProperty("eventId") 
                && data.hasOwnProperty("number")
                && data.hasOwnProperty("division")
                && data.hasOwnProperty("type") 
                && data.hasOwnProperty("state")
                && data.hasOwnProperty("password") ) {

            var eventdoc = firestore.collection("events").doc(data.eventId);

            var location = "inspections." + data.division + "._" + data.number + "." + data.type + ".state";
            var updateData = {};
            updateData[location] = data.state;
            console.log(updateData);
            eventdoc.update(updateData).then(function() {
                console.log("Document successfully updated!");
            });
    
            res.status(200).send("Success");
        } else {
            console.log("Invalid inspection request:", JSON.stringify(data));
            res.status(400).send("Invalid request");
        }
    });
});