var thisEvent;

function onButtonClick(p) {
    var str = 'header nav .' + p.target.className;
    $(str).removeClass('selected');
    p.target.className += " selected";
}

var Event = function(event_doc, messaging) {
    this.init(event_doc, messaging);
};

document.addEventListener('DOMContentLoaded', function() {
//    $('header nav a').each(function(i, element){
//        element.onclick = onButtonClick;
//    });
    
    try {
        let app = firebase.app();
        let features = ['auth', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
        //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        console.log("Firebase SDK loaded with " + features.join(', '));
        db = firebase.firestore();
        var messaging = firebase.messaging();
        var url_path = window.location.pathname;
        event_id = url_path.split("/")[2];
        //console.log("Event_ID = " + this.event_id);

        //this.event_collection = this.db.collection("events");

    } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
    
    
    if(event_id) {
        var event_doc = db.collection("events").doc(event_id);
        var e = new Event(event_doc, messaging);
    } else {

    }   
    
    ui.setPhase("qual");
});


Event.prototype = {
    
    init: function(event_doc, messaging) {
        this.doc = event_doc;
        console.log("init function");
        thisEvent = this;
        this.divisions = new Object();
        this.doc.get().then(this.on_event_first_loaded);
        
        this.notifications = new Notifications(messaging);
        
/*
            if(this.event_id) {
                this.doc = this.event_collection.doc(this.event_id);
                this.doc.get()
                    .then(this.on_event_first_loaded)
                    .catch(function(error) {
                    console.log("Error getting document:", error);
                });
                
                this.event_collection.doc(this.event_id)
                    .onSnapshot(this.on_event_change);
                
            } else {
                var table = document.getElementById("events_table");
                this.db.collection("events").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(`${doc.id} => ${doc.data().name}`);
                        var row = table.insertRow();
                        row.insertCell().innerHTML = doc.data().name;
                    });
                });
            }*/
        
    },
    
    on_event_first_loaded: function(doc) {
        console.log("on_event_first_loaded function");
        console.log(doc);
        if (doc.exists) {
            console.log("Document data:", doc.data());
            //event.event_collection.doc(this.event_id)
            //        .onSnapshot(this.on_event_change);
            var data = doc.data();
            
            document.getElementById("event_name").innerHTML = data.name;
            
            var divCollection = thisEvent.doc.collection("divisions");
            
            divCollection.get().then(function(divSnapshot) {
               divSnapshot.forEach(thisEvent.create_division); 
            });
            
            if(data.hasOwnProperty("schedule")) {
                var calendar = {
                    header: {
                        left: '',
                        center: '',
                        right: ''
                    },
                    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                    defaultView: 'listDay',
                    //defaultView: 'agendaDay',
                    defaultDate: data.date,
                    displayEventTime: true, // don't show the time column in list view
                    // THIS KEY WON'T WORK IN PRODUCTION!!!
                    // To make your own Google API key, follow the directions here:
                    // http://fullcalendar.io/docs/google_calendar/
                    googleCalendarApiKey: 'AIzaSyB2C70d4KMWIFnL2v3f8fB41gfIyacZLVk',
                    // US Holidays
                    events: data.schedule,
                    eventClick: function(event) {
                        // opens events in a popup window
                        //window.open(event.url, 'gcalevent', 'width=700,height=600');
                        return false;
                    },
                    loading: function(bool) {
                        console.log("loading...");
                    }
                };
                $('#calendar').fullCalendar(calendar);
                
                //ui.showSchedule();
            }
            
            if(data.hasOwnProperty("info")) {
                var info = document.getElementById("event-info-area");
                info.innerHTML = data.info;
            }
            
            console.log(data);
            console.log(divCollection);
            
            
            
            
            
            
            
            /*if(data.multi_division) {
                console.log("div0");
                data.divisions[0].get().then(function(doc) {
                    if(doc.exists) {
                        console.log("Document data: ", doc.data());
                        console.log("div0");
                        document.getElementById("division-1").innerHTML = doc.data().name;
                    } else {
                        console.log("No such document!");
                    }
                });
                
                console.log("div1");
                data.divisions[1].get().then(function(doc) {
                    if(doc.exists) {
                        console.log("Document data: ", doc.data());
                        console.log("div1");
                        document.getElementById("division-2").innerHTML = doc.data().name;
                    } else {
                        console.log("No such document!");
                    }
                });
                //document.getElementById("divisions").style.visibility = "visible";
            } else {
                
            }*/
            
        } else {
            console.log("No such document!");
        }
    },
    
    on_event_change: function(doc) {
        console.log("on_event_change function");
        //console.log(event);
        console.log("Current data: ", doc && doc.data());
    },



    create_division: function(doc) {
        console.log("create_division function");
        console.log(doc.data().name);
        var div_name = doc.data().name;
        ui.addDivision(div_name);
        thisEvent.divisions[div_name] = new Division(doc.ref, doc);
    },
    
    topButtonClicked: function(button) {
        console.log(button);
    }
};























