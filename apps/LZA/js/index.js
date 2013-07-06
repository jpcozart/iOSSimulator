/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        $(document).ready(function () {
            Tools.Init();
            Data.Init();
            Checklist.Init();
            Map.Init();
            AddAgency.Init();
            RemoveAgency.Init();
            RadioChannels.Init();
            AddChannel.Init();
            About.Init();
            Feedback.Init();
        });
    }
};

//***DATA***//

var Data = {
    db: null,
    Init: function () {
        Data.db = window.openDatabase("LZA", "1.0", "LZA Data", 2 * 1024 * 1024);
        Data.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Locations (lid INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(40), Latitude VARCHAR(20), Longitude VARCHAR(40), ActualLat REAL, ActualLon REAL)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Channels (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR(40), Zone VARCHAR(20), Channel INTEGER, Frequency VARCHAR(40))');
        });
    }
};

//***TOOLS***//

var Tools = {
    Latitude: null,
    Longitude: null,
    ActualLat: null,
    ActualLon: null,
    LatitudeDir: "",
    LongitudeDir: "",
    StrobeOn: false,
    StrobeLoop: null,
    Init: function () {
        $('#usedecimal').off('click').on('click', Tools.ToggleDecimal);
        $('#get-location-button').off('click').on('click', Tools.GetLocation);
        $('#flash-on').off('click').on('click', Tools.ToggleFlashlight);
        $('#strobe-on').off('click').on('click', Tools.ToggleStrobe);
        $('#saved-locations-button').off('click').on('click', function () {SavedLocations.Load();});
        $('#save-location-button').off('click').on('click', Tools.SaveLocation);
    },
    ToggleDecimal: function () {
        if($('#usedecimal').is(":checked")) {
           window.localStorage.setItem("UseDecimals", "1");
           Tools.GetLocationStrings();
        } else {
           window.localStorage.setItem("UseDecimals", "0");
           Tools.GetLocationStrings();
        }
    },
    GetLocation: function () {
        navigator.geolocation.getCurrentPosition(Tools.LocationSuccess, Tools.LocationError);
    },
    LocationSuccess: function (position) {
        //Get Coordinates
        Tools.Latitude = position.coords.latitude;
        Tools.Longitude = position.coords.longitude;
        Tools.ActualLat = position.coords.latitude;
        Tools.ActualLon = position.coords.longitude;
        if(Tools.Latitude > 0){Tools.LatitudeDir = " North";}
        if(Tools.Latitude < 0) {
            Tools.LatitudeDir = " South";
            Tools.Latitude = Tools.Latitude * -1;
        }
        if(Tools.Longitude > 0){Tools.LongitudeDir = " East";}
        if (Tools.Longitude < 0) {
            Tools.Longitude = Tools.Longitude * -1;
            Tools.LongitudeDir = " West";
        }
        Tools.GetLocationStrings();
    },
    GetLocationStrings: function () {
        //Get Userpreference
        var value = window.localStorage.getItem("UseDecimals");
        if(value === "1") {
            //Use decimals
            $('#latitude').html((Math.floor(1000 * Tools.Latitude) / 1000) + Tools.LatitudeDir);
            $('#longitude').html((Math.floor(1000 * Tools.Longitude) / 1000) + Tools.LongitudeDir);
        }
        else
        {
           //Do not use decimals
           var dlat = Math.floor(Tools.Latitude);
           var mlat = Math.floor((Tools.Latitude - dlat) * 60);
           var slat = Math.floor((((Tools.Latitude - dlat) * 60) - mlat) * 60);
           
           var dlon = Math.floor(Tools.Longitude);
           var mlon = Math.floor((Tools.Longitude - dlon) * 60);
           var slon = Math.floor((((Tools.Longitude - dlon) * 60) - mlon) * 60);

           $('#latitude').html(dlat + "&deg; " + mlat + "&#39; " + slat + "&quot;" + Tools.LatitudeDir);
           $('#longitude').html(dlon + "&deg; " + mlon + "&#39; " + slon + "&quot;" + Tools.LongitudeDir);
        }
    },
    LocationError: function (error) {
        navigator.notification.alert("code: "  + error.code + "\n" + "message: " + error.message + "\n", function () {}, "Location Error", "OK");
    },
    ToggleFlashlight: function () {
        if($('#flash-on').is(':checked')) {
            Cordova.exec("Torch.turnOn");
        } else {
            Cordova.exec("Torch.turnOff");
        }
    },
    ToggleStrobe: function () {
        if($('#strobe-on').is(':checked')) {
            Tools.StrobeLoop = setInterval(function () {
                if(Tools.StrobeOn) {
                    Cordova.exec("Torch.turnOff");
                    Tools.StrobeOn = false;
                } else {
                    Cordova.exec("Torch.turnOn");
                    Tools.StrobeOn = true;
                }
            }, 100);
        } else {
            clearInterval(Tools.StrobeLoop);
            Cordova.exec("Torch.turnOff");
        }
    },
    SaveLocation: function () {
        navigator.notification.prompt("Set a name for your location: ", function(results) {
            if(results.buttonIndex === 1) {
                Data.db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO Locations (Name, Latitude, Longitude, ActualLat, ActualLon) VALUES (?,?,?,?,?)', [results.input1, $('#latitude').html(), $('#longitude').html(), Tools.ActualLat, Tools.ActualLon]);
                });
            }
        }, "New Location", ["Save", "Cancel"]);
    }
};

//***Saved Locations***//

var SavedLocations = {
    Load: function () {
        $('#locations-list').empty();
        Data.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Locations', [], function (tx, results) {
                var i;
                for(i=0; i<results.rows.length; i++) {
                    $('#locations-list').append(
                        $('<li/>').append(
                            $('<a/>').attr('href', "#location-page").attr('data-rel', "dialog").attr('data-id', results.rows.item(i).lid).append(
                                $('<strong/>').html(results.rows.item(i).Name),
                                $('<p/>').html("Latitude: " + results.rows.item(i).Latitude),
                                $('<p/>').html("Longitude: " + results.rows.item(i).Longitude)
                            ).off('click').on('click', function () {
                                Location.Load($(this).attr('data-id'));
                            })
                        )
                    );
                }
                $('#locations-list').listview('refresh');
            }, function (error) {navigator.notification.alert(error.code + " " + error.message, function () {}, "Error", "OK");});
        });
    }
};

//***Location***//

var Location = {
    Load: function (id) {
        Data.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Locations WHERE lid=?', [id], function (tx, results) {
                $('#location-info').empty().append(
                    $('<strong/>').html(results.rows.item(0).Name),
                    $('<p/>').html(results.rows.item(0).Latitude),
                    $('<p/>').html(results.rows.item(0).Longitude)
                );
                $('#location-rename').attr('data-id', results.rows.item(0).lid).data('name', results.rows.item(0).Name).off('click').on('click', function () {
                    Location.Rename($(this).attr('data-id'), $(this).data('name'));
                });
                $('#location-map').data('lat', results.rows.item(0).ActualLat).data('lon', results.rows.item(0).ActualLon).off('click').on('click', function () {
                    Location.ShowOnMap($(this).data('lat'), $(this).data('lon'));
                });
                $('#location-delete').attr('data-id', results.rows.item(0).lid).data('name', results.rows.item(0).Name).off('click').on('click', function () {
                    Location.Delete($(this).attr('data-id'), $(this).data('name'));
                });
            });
        });
    },
    Rename: function (id, name) {
        navigator.notification.prompt("Set a name for you location:", function (results) {
            if(results.buttonIndex === 1) {
                Data.db.transaction(function (tx) {
                    tx.executeSql('UPDATE Locations SET Name=? WHERE lid=?',[results.input1, id]);
                });
            }
            $('#location-page').dialog('close');
            SavedLocations.Load();
        }, name, ["Rename", "Cancel"]);
    },
    ShowOnMap: function (lat, lon) {
        Cordova.exec(function () {}, function () {}, "MapKitView", "showMap", []);
        Cordova.exec(function () {}, function () {}, "MapKitView", "setMapData", ["Map.ButtonCallback", 480.0, 0.0, lat, lon, 50.0]);
    },
    Delete: function (id, name) {
        navigator.notification.confirm("Are you sure you want to delete this location?", function(buttonIndex) {
            if(buttonIndex === 1) {
                Data.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM Locations WHERE lid=?',[id]);
                });
            }
            $('#location-page').dialog('close');
            SavedLocations.Load();
        }, name, ["Yes", "No"]);
    }
};

//***Checklist***//

var Checklist = {
    Init: function () {
        $('#checklist').find('input[type=checkbox]').each(function () {
            $(this).off('click').on('click', function () {
                var gtg = true;
                $('#checklist').find('input[type=checkbox]').each(function () {
                    if(!$(this).is(":checked")) {
                        gtg = false;
                    }
                });
                if(gtg) {
                    $('#color-box').removeClass("Red").addClass("Green").html("Go For Landing");
                } else {
                    $('#color-box').removeClass("Green").addClass("Red").html("Check Conditions");
                }
            });
        });
    }
};

//***Map***//
var Map = {
    Init: function () {
        $('a[href=#map]').off('click').on('click', Map.Load);
    },
    Load: function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            Cordova.exec(function () {}, function () {}, "MapKitView", "showMap", []);
            Cordova.exec(function () {}, function () {}, "MapKitView", "setMapData", ["Map.ButtonCallback", 480.0, 0.0, position.coords.latitude, position.coords.longitude, 50.0]);
        }, function (error) {
            navigator.notification.alert("Cannot show map. Geolocation currently unavailable. Go to your saved locations to view a map of that location.", function () {}, "Location Not Found", "OK");
        });
    }
};

//***Directory***//

var Directory = {
    Load: function () {
        $('#state-list').empty();
        $.getJSON("http://bluelineapps.net/LZA/GetStates.php", function (data) {
            $.each(data, function (index, element) {
                $.each(this, function (index, element) {
                    $('#state-list').append(
                        $('<li/>').append(
                            $('<a/>').attr('href', "#agencies").data('state', element.State).append(
                                $('<h1/>').html("Name"),
                                $('<p/>').html(element.Count + " Agencies")
                            ).off('click').on('click', function () {
                                Agencies.Load($(this).data('state'));
                            })
                        )
                    );
                });
            });
            $('#state-list').listview('refresh');
        });
    }
};

//***Agencies***//

var Agencies = {
    Load: function (state) {
        $('#agencies-list').empty();
        $.getJSON("http://bluelineapps.net/LZA/GetAgencies.php?State=" + state, function (data) {
            $.each(data, function (index, element) {
                $.each(this, function (index, element) {
                    $('#agencies-list').append(
                        $('<li/>').append(
                            $('<a/>').attr('href', "").data('number', element.Phone).append(
                                $('<h1/>').html(element.Name),
                                $('<p/>').html(element.Phone)
                            ).off('click').on('click', function () {
                                //TODO::
                            })
                        )
                    );
                });
            });
        });
    }
};

//***Add Agency***//

var AddAgency = {
    Init: function () {
        $('#add-agency-form').ajaxForm({success: function () {
            navigator.notification.alert("Agency submission successful!", function () {}, "Add Agency", "OK");
            Directory.Load();
            $.mobile.changePage("#directory");
        }, error: function () {
            navigator.notification.alert("There was an error adding the agency, please try again later or email us at bluelineapps@yahoo.com", function () {}, "Add Agency", "OK");
        }});
    }
};

//***Remove Agency***//

var RemoveAgency = {
    Init: function () {
        $('#remove-agency-form').ajaxForm({success: function () {
            navigator.notification.alert("Agency remove request submitted successfully. We will remove or be in contact soon. Thank you.", function () {}, "Remove Agency", "OK");
            Directory.Load();
            $.mobile.changePage("#directory");
        }, error: function () {
            navigator.notification.alert("There was an error requesting removal of your agency, please try again later or email us at bluelineapps@yahoo.com", function () {}, "Remove Agency", "OK");
            
        }});
    }
};

//***Radio Channels***//

var RadioChannels = {
    Init: function () {
        $('a[href=#radio-channels]').off('click').on('click', RadioChannels.Load);
    },
    Load: function () {
        $('#channel-list').empty();
        Data.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Channels', [], function (tx, results) {
                var i;
                for(i=0; i<results.rows.length; i++) {
                    $('#channel-list').append(
                        $('<li/>').append(
                            $('<a/>').attr('href', "#channel-details").attr('data-rel', "dialog").attr('data-id', results.rows.item(i).ID).append(
                                $('<strong/>').html(results.rows.item(i).Name),
                                $('<p/>').html("Zone: " + results.rows.item(i).Zone),
                                $('<p/>').html("Channel: " + results.rows.item(i).Channel),
                                $('<p/>').html("Frequency: " + results.rows.item(i).Frequency)
                            ).off('click').on('click', function () {
                                ChannelDetails.Load($(this).data('id'));
                            })
                        )
                    );
                }
                $('#channel-list').listview('refresh');
            }, function (error) {navigator.notification.alert(error.code + " " + error.message, function () {}, "Error", "OK");});
        });
    }
};

//***ChannelDetails***//

var ChannelDetails = {
    Load: function (id) {
        Data.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Channels WHERE ID=?', [id], function (tx, results) {
                $('#channel-info').empty().append(
                    $('<strong/>').html(results.rows.item(0).Name),
                    $('<p/>').html("Zone: " + results.rows.item(0).Zone),
                    $('<p/>').html("Channel: " + results.rows.item(0).Channel),
                    $('<p/>').html("Frequency: " + results.rows.item(0).Frequency)
                );
                $('#channel-rename').data('id', id).data('name', results.rows.item(0).Name).off('click').on('click', function () {
                    ChannelDetails.Rename($(this).data('id'), $(this).data('name'));
                });
                $('#channel-delete').data('id', id).data('name', results.rows.item(0).Name).off('click').on('click', function () {
                    ChannelDetails.Delete($(this).data('id'), $(this).data('name'));
                });
            });
        });
    },
    Rename: function (id, name) {
        navigator.notification.prompt("Set a name for the channel:", function(results) {
            if(results.buttonIndex === 1) {
                Data.db.transaction(function (tx) {
                    tx.executeSql('UPDATE Channels SET Name=? WHERE ID=?',[results.input1,id]);
                });
            }
            $('#channel-details').dialog('close');
            RadioChannels.Load();
        }, name, ["OK", "Cancel"]);
    },
    Delete: function (id, name) {
        navigator.notification.confirm("Are you sure you want to delete this channel?", function (buttonIndex) {
            if(buttonIndex === 1) {
                Data.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM Channels WHERE ID=?',[id]);
                });
            }
            $('#channel-details').dialog('close');
            RadioChannels.Load();
        }, name, ["Yes", "No"]);
    }
};

//***Add Channel***//

var AddChannel = {
    Init: function () {
        $('#add-channel-form').on('submit', function () {
            Data.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO Channels (Name, Zone, Channel, Frequency) VALUES (?,?,?,?)', [$('#add-channel-name').val(), $('#add-channel-zone').val(), $('#add-channel-channel').val(), $('#add-channel-frequency').val()]);
            });
            $.mobile.changePage("#radio-channels");
            RadioChannels.Load();
            return false;
        });
    }
};

//***About***//
var About = {
    Init: function () {
        $('#Facebook').off('click').on('click', function () {
            window.open("http://facebook.com/BluelineApps", "_blank", "location=yes");
        });
        $('#Twitter').off('click').on('click', function () {
            window.open("http://twitter.com/BluelineApps", "_black", "location=yes");
        });
    }
};

//***Feedback***//

var Feedback = {
    Init: function () {
        $('#feedback-form').ajaxForm({success: function () {
            navigator.notification.alert("Thank you for your feedback!!", function () {}, "Feedback Sent", "OK");
        }, error: function () {
            navigator.notification.alert("An error occurred while sending feedback, please try again later or email us at bluelineapps@yahoo.com", function () {}, "Feedback Error", "OK");
        }});
    }
};