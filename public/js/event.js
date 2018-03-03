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
        //event_id = url_path.split("/")[2];
        //console.log("Event_ID = " + this.event_id);
        var h = window.location.href.split("#")[1];
        if(h === "test") {
            event_id = "test";
        } else if (h==="lane") {
            event_id = "lane";
        } else {
            event_id = "ia";
        }
        //event_id = "test";
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
        this.doc.onSnapshot(function(doc) {
                thisEvent.onChange(doc);
        });
        this.notifications = new Notifications(messaging);       
    },
    
    on_event_first_loaded: function(doc) {
        console.log("on_event_first_loaded function");
        console.log(doc);
        if (doc.exists) {
            console.log("Document data:", doc.data());
            //event.event_collection.doc(this.event_id)
            //        .onSnapshot(this.on_event_change);
            
            thisEvent.eventData = doc.data();
            
            //document.getElementById("event_name").innerHTML = thisEvent.eventData.name;
            
            var divCollection = thisEvent.doc.collection("divisions");
            
            divCollection.get().then(function(divSnapshot) {
               divSnapshot.forEach(thisEvent.create_division); 
            });
            
            if(thisEvent.eventData.hasOwnProperty("phase")) {
                ui.setPhase(thisEvent.eventData.phase);
            }
            
            if(thisEvent.eventData.hasOwnProperty("awards")) {
                thisEvent.awards = new Awards(thisEvent.eventData.awards);
            }
            
            
            if(thisEvent.eventData.hasOwnProperty("twitter")) {
                var twitter = document.getElementById("twitter-container");
                //twitter.setAttribute("data-widget-id", thisEvent.eventData.twitter);
                twitterInit(document,"script","twitter-wjs");
                ui.showTwitter();
            }
            
            if(thisEvent.eventData.hasOwnProperty("schedule")) {
                if(Array.isArray(thisEvent.eventData.date)) {
                    var num = thisEvent.eventData.date.length;
                    var i;
                    var article = document.getElementById("event-schedule");
                    for(i=0;i<num;i++) {
                        var caldom = document.createElement("div");
                        caldom.setAttribute("id", "calendar-"+i);
                        article.appendChild(caldom);
                        
                        var calendar = {
                            header: {
                                left: '',
                                center: '',
                                right: ''
                            },
                            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                            defaultView: 'listDay',
                            //defaultView: 'agendaDay',
                            defaultDate: thisEvent.eventData.date[i],
                            displayEventTime: true, // don't show the time column in list view
                            // THIS KEY WON'T WORK IN PRODUCTION!!!
                            // To make your own Google API key, follow the directions here:
                            // http://fullcalendar.io/docs/google_calendar/
                            googleCalendarApiKey: 'AIzaSyB2C70d4KMWIFnL2v3f8fB41gfIyacZLVk',
                            // US Holidays
                            events: thisEvent.eventData.schedule,
                            eventClick: function(event) {
                                // opens events in a popup window
                                //window.open(event.url, 'gcalevent', 'width=700,height=600');
                                return false;
                            },
                            loading: function(bool) {
                                console.log("loading...");
                            }
                        };
                        $('#calendar-' + i).fullCalendar(calendar);
                    }
                    
                } else {
                    var calendar = {
                        header: {
                            left: '',
                            center: '',
                            right: ''
                        },
                        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                        defaultView: 'listDay',
                        //defaultView: 'agendaDay',
                        defaultDate: thisEvent.eventData.date,
                        displayEventTime: true, // don't show the time column in list view
                        // THIS KEY WON'T WORK IN PRODUCTION!!!
                        // To make your own Google API key, follow the directions here:
                        // http://fullcalendar.io/docs/google_calendar/
                        googleCalendarApiKey: 'AIzaSyB2C70d4KMWIFnL2v3f8fB41gfIyacZLVk',
                        // US Holidays
                        events: thisEvent.eventData.schedule,
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
                }
                
                //var mapcontainer = document.getElementById("map-container");
				//var viewer = ImageV
				
                //$('.pannable-image').ImageViewer({snapView: false});
		
                thisEvent.maps = new Maps();
                
                //viewer = ImageViewer('.', {snapView: false});
                
                //console.log(viewer);
                
                //ui.showSchedule();
            }
            
            if(thisEvent.eventData.hasOwnProperty("info")) {
                var info = document.getElementById("event-info-area");
                //info.innerHTML = thisEvent.eventData.info;
            }
            
            console.log(this.eventData);
            console.log(divCollection);
            
            
        } else {
            console.log("No such document!");
        }
    },
    
    onChange: function(doc) {
        console.log("on_event_change function");
        //console.log(event);
        if(doc) {
            thisEvent.eventData = doc.data();
        }
        
        if(thisEvent.eventData.hasOwnProperty("phase")) {
            ui.setPhase(thisEvent.eventData.phase);
        }
        
        if(thisEvent.hasOwnProperty("divisions")) {
            if(thisEvent.divisions.hasOwnProperty("black")) {
                thisEvent.divisions.black.updateInspections(thisEvent.eventData.inspections);
                thisEvent.divisions.black.updateFinals(thisEvent.eventData.finals);
            }
            if(thisEvent.divisions.hasOwnProperty("gold")) {
                thisEvent.divisions.gold.updateInspections(thisEvent.eventData.inspections);
                thisEvent.divisions.gold.updateFinals(thisEvent.eventData.finals);
            }
        }
        
        if(thisEvent.eventData.hasOwnProperty("awards")) {
            if(thisEvent.hasOwnProperty("awards")) {
                thisEvent.awards.onChange(thisEvent.eventData.awards);
            } else {
                thisEvent.awards = new Awards(thisEvent.eventData.awards);
            }
        }
        
        if(thisEvent.eventData.hasOwnProperty("twitter")) {
            ui.showTwitter();
        }
        console.log("Current data: ", doc && doc.data());
    },



    create_division: function(doc) {
        console.log("create_division function");
        console.log(doc.data().name);
        var div_name = doc.data().name;
        ui.addDivision(div_name);
        thisEvent.divisions[div_name] = new Division(doc.ref, doc);
        thisEvent.onChange(null); // force an event change to update the UI
    },
    
    topButtonClicked: function(button) {
        console.log(button);
    },
    
    getTeamName: function(teamNumber) {
        for (var key in this.divisions) {
            // skip loop if the property is from prototype
            if (!this.divisions.hasOwnProperty(key)) continue;

            var div = this.divisions[key];
            var name = div.teamList.getTeamName(teamNumber);
            if (name.length > 0) {
                return name;
            }
        }
        return "";
    },
    
    searchTeam: function(team) {
//        thisEvent.divisions.forEach(function (d) {
//            d.searchTeam(team);
//        });
        
        
        for (var key in thisEvent.divisions) {
            // skip loop if the property is from prototype
            if (!thisEvent.divisions.hasOwnProperty(key)) continue;

            thisEvent.divisions[key].searchTeam(team);
        }
    }
};























