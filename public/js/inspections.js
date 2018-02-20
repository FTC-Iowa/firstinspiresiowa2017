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


var HttpClient = function(url, callback) {
    this.init(url, callback);
};


HttpClient.prototype = {
    init: function( url, callback ) {
        this.url = url;
        this.callback = callback;
    },
    
    post: function(data) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() { 
            if (xhr.readyState === 4 && xhr.status === 200)
                server.callback(xhr.responseText);
        };

        xhr.open( "POST", this.url, true );            
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send( JSON.stringify(data) );
    }
};

var server = new HttpClient("https://us-central1-firstinspiresiowa.cloudfunctions.net/inspectionUpdate", onPostCallback);

mode = "init";
inspections = {};
inspection = null;
scanner = {};
firstLoad = true;
inspectType = "hw";
teamNumber = 0;
event_id = "test";
state = 0;

function onInspectTypeChange() {
    inspectType = document.querySelector('input[name="inspection-type"]:checked').value;
    console.log("inspection type: ", inspectType);
    if ( teamNumber ) {
        loadTeam(teamNumber);
    }
}

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
        
    } else {

    }   
});

function initScanner() {
    scanner = new Instascan.Scanner({
        video: document.getElementById("preview"),
        mirror: false,
        continuous: true
    });
    scanner.addListener('scan', onScan);
    Instascan.Camera.getCameras().then(selectCamera).catch(function(e) {
        console.error(e);
    });
}

function onChange(doc) {
    var data = doc.data();
    inspections = data.inspections;
    if(firstLoad) {
        firstLoad = false;
        initScanner();
    }
    if ( teamNumber ) {
        loadTeam(teamNumber);
    }
}

function onScan(content) {
    document.getElementById("cameraPreview").className = "hidden";
    console.log("found scan: ", content);
    scanner.stop();
    loadTeam(content);
}

function updateServer() {
    console.log("updateServer()");
    var data = {eventId: event_id, number: teamNumber, division: division, type: inspectType, state: state, password: "pass"};
    console.log("data", data);
    server.post(data);
}

function loadTeam(number) {
    inspection = null;
    teamNumber = number;
    if(inspections.black.hasOwnProperty("_" + number)) {
        inspection = inspections.black["_" + number];
        division = "black";
    } else if (inspections.gold.hasOwnProperty("_" + number)) {
        inspection = inspections.gold["_" + number];
        division = "gold";
    }
    
    if(inspection) {
        teamNumber = number;
        console.log(inspection);
        document.getElementById("teamNumber").textContent = "Team # " + number;
        state = inspection[inspectType].state;
        document.stateForm.state.value = state;
        if (state === 0) {
            state = 1;
            updateServer();
        }
        document.getElementById("team").className = "";
        document.getElementById("saveButton").className ="";
    } else {
        window.alert("Invalid Team #");
        enableSelectTeams();
    }
}

function selectTeamCamera() {
    document.getElementById("selectTeamsCamera").className = "hidden";
    document.getElementById("cameraPreview").className = "";
    scanner.start(camera);
}

function selectTeamNoCamera() {
    var team = document.getElementById("teamNumberInput").value;
    document.getElementById("selectTeamsNoCamera").className = "hidden";
    loadTeam(team);
}

function onPostCallback(response) {
    console.log("Server Response:", response);
}

function onStateChange() {
    console.log("onStateChange()");
    var newState = document.querySelector('input[name="state"]:checked').value;
    if (newState !== state) {
        state = newState;
        updateServer();
    }
}


var cameraList;

function selectCamera(cameras) {
    cameraList = cameras;
    if(cameras.length === 0) {
        console.error('No cameras found');
        camera = null;
        enableSelectTeams();
    } else {
        //todo add an option to select camera
        mode = "select-camera";
        document.getElementById("cameraSelect").className = "";
        var div = document.getElementById("camera");
        var input;
        var label
        for (var i=0; i<cameras.length; i++) {
            input = document.createElement("input");
            label = document.createElement("label");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "camera");
            input.setAttribute("value", i );
            input.setAttribute("id", "camera" + i);
            input.setAttribute("onchange", "onCameraChange("+i+");");
            label.setAttribute("for", "camera" + i);
            label.textContent = cameras[i].name;
            div.insertBefore(label, div.firstChild);
            div.insertBefore(input, div.firstChild);
        }
        input.setAttribute("checked","");
        onCameraChange(i-1);
        document.getElementById("saveButton").className = "";
        document.getElementById("cameraSelect").className = "";
    }
}


function onCameraChange(i) {
    document.getElementById("cameraPreview").className = "";
    scanner.stop();
    camera = null;
    if(i!==99) {
        camera = cameraList[i];
        scanner.start(camera);
    }
}

function onSaveClick() {
    switch(mode) {
        case "select-camera":
            document.getElementById("cameraSelect").className = "hidden";
            document.getElementById("cameraPreview").className = "hidden";
            document.getElementById("saveButton").className = "hidden";
            enableSelectTeams();
            break;
        case "select":
            document.getElementById("team").className = "hidden";
            document.getElementById("saveButton").className = "hidden";
            enableSelectTeams();
            break;
    }
}


function enableSelectTeams() {
    mode = "select";
    if ( camera !== null ) {
        document.getElementById("selectTeamsCamera").className = "";
    } else {
        document.getElementById("teamNumberInput").value = "";
        document.getElementById("selectTeamsNoCamera").className = "";
    }
}