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


inspections = {};
scanner = null;

document.addEventListener('DOMContentLoaded', function() {    
    try {
        let app = firebase.app();
        let features = ['auth', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
        //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        console.log("Firebase SDK loaded with " + features.join(', '));
        db = firebase.firestore();
        var messaging = firebase.messaging();
        var url_path = window.location.pathname;
        //event_id = url_path.split("/")[2];
        //console.log("Event_ID = " + this.event_id);
        var h = window.location.href.split("#")[1];
        if(h === "test") {
            event_id = "test";
        } else {
            event_id = "ia";
        }
        event_id = "test";
        //this.event_collection = this.db.collection("events");

    } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
    
    
    if(event_id) {
        var event_doc = db.collection("events").doc(event_id);
        
        event_doc.get().then(onChange);
        event_doc.onSnapshot(onChange);
        
        scanner = new Instascan.Scanner({
            video: document.getElementById("preview"),
            continuous: true
        });
        scanner.addListener('scan', onScan);
        Instascan.Camera.getCameras().then(function (cameras) {
            if(cameras.length === 0) {
                console.error('No cameras found');
            } else if (cameras.length === 1 ) {
                camera = cameras[0];
            } else {
                //todo add an option to select camera
                camera = cameras[0];                
            }
        }).catch(function(e) {
            console.error(e);
        });
        
    } else {

    }   
});


function onChange(doc) {
    var data = doc.data();
    inspections = data.inspections;
}

function onScan(content) {
    console.log("found scan: ", content);
    document.getElementById("teamNumber").textContent = "Team # " + content;
    scanner.stop();
}

function loadTeam(number) {
    
}

function selectTeam() {
    document.getElementById("select").className = "";
    scanner.start(camera);
}