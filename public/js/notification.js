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

notifications = null;

var Notifications = function(messaging) {
    this.init(messaging);
};

Notifications.prototype = {
    
    init: function(messaging) {
        this.areEnabled = false;
        notifications = this;
        this.messaging = messaging;
        this.token = null;
        this.getToken();
        if(this.token) {
        }
        if(this.token) {
            this.setOnTokenRefresh();
        }
        
        //this.subscribe(100);
    },
    
    subscribe: function(team) {
        var token = this.token;
        var data = {
            token: token,
            topic: team
        };
        console.log("sending:",JSON.stringify(data));
        $.post("/subscribe", data, function(result) {
            console.log("subscribe:", result);
        });
    },
    
    enable: function() {
        this.messaging.requestPermission()
            .then(function() {
                console.log('Notification permission granted.');
                notifications.getToken();
            }).catch(function(err) {
                console.log('Unable to get permission to notify.', err);
            });
        
    },
    
    getToken: function() {
        this.messaging.getToken()
            .then(function(currentToken) {
                if(currentToken) {
                    //sendTokenToServer(currentToken);
                    console.log("Found token: ", currentToken);
                    notifications.token = currentToken;
                    //update UI
                    notifications.areEnabled = true;
                    ui.setNotificationsEnabled();
                    // make sure notifications get refreshed
                    notifications.setOnTokenRefresh();
                } else {
                    // show permission request
                    console.log('No Instance ID token available. Request permission to generate one.');
                    notifications.token = null;
                }
        }).catch(function(err) {
            console.log("An error occured while retrieving token. ", err);
            notifications.token = null;
        });
    },
    
    setOnTokenRefresh: function (){
        // Callback fired if Instance ID token is updated.
        this.messaging.onTokenRefresh(function() {
            this.messaging.getToken()
                .then(function(refreshedToken) {
                    console.log('Token refreshed.');
                    // Indicate that the new Instance ID token has not yet been sent to the
                    // app server.
                    // setTokenSentToServer(false);
                    // Send Instance ID token to app server.
                    // sendTokenToServer(refreshedToken);
                    // ...
                    notifications.token = refreshedToken;
                }).catch(function(err) {
                    console.log('Unable to retrieve refreshed token ', err);
                    showToken('Unable to retrieve refreshed token ', err);
                    notifications.token = null;
                });
        });
    }

    
};

