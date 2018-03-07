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



var Maps = function() {
    this.init();
};

Maps.prototype = {
    init: function() {
        this.viewPit1 = new ImageViewer('#map-pits1-img', {snapView: false});
        this.viewPit2 = new ImageViewer('#map-pits2-img', {snapView: false});
    },
    
    refresh: function() {
        console.log("Refresh maps");
        thisEvent.maps.viewPit1.refresh();
        thisEvent.maps.viewPit2.refresh();
        //thisEvent.maps.viewVenue.refresh();
    }
    
};

