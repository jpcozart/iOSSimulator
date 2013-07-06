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
var App = {
    // Application Constructor
    Initialize: function () {
        $(document).ready(function () {
            $('#feedback-form').ajaxForm({success: function () {
                navigator.notification.alert("Thank you for your feedback.", function () {},"Feedback", "OK");
                $('#feedback-textarea').val("");
                $('#feedback-email').val("");
            }, error: function () {
                navigator.notification.alert("Server timeout, please try again", function () {},"Feedback", "OK");
            }});
        });
    }
};

var FreeFlow = {
    StartTime: 0,
    Hour: 0,
    Minute: 0,
    Second: 0,
    Interval: null,
    Calculate: function () {
        var DTank = 0.19;
        var JDTank = 0.29;
        var ETank = 0.31;
        var MTank = 1.57;
        var HTank = 3.22;
        var psi = $("#FFPSI").val();
        var lpm = $("#FFLPM").val();
        if(psi<=0 || psi>=3001 || psi=="") {
            navigator.notification.alert("PSI must be between 1 and 3000", function () {}, "PSI Error!", "OK");
            $("#FFPSI").val("");
        } else {
            if(lpm<=0 || lpm>=101 || lpm=="") {
                navigator.notification.alert("LPM must be between 1 and 100", function () {}, "LPM Error!", "OK");
                $("#FFLPM").val("");
            } else {
                //D Tank
                var DResult = (psi * DTank) / lpm;
                var DHours = Math.floor(DResult / 60);
                var DMin = Math.floor(((DResult / 60) - DHours) * 60);
                var DResultString = DHours+"h "+DMin+"m";
                $("#FFD").html("D: " + DResultString);
                //JD Tank
                var JDResult = (psi * JDTank) / lpm;
                var JDHours = Math.floor(JDResult / 60);
                var JDMin = Math.floor(((JDResult / 60) - JDHours) * 60);
                var JDResultString = JDHours+"h "+JDMin+"m";
                $("#FFJD").html("JD: " + JDResultString);
                //E Tank
                var EResult = (psi * ETank) / lpm;
                var EHours = Math.floor(EResult / 60);
                var EMin = Math.floor(((EResult / 60) - EHours) * 60);
                var EResultString = EHours+"h "+EMin+"m";
                $("#FFE").html("E: " + EResultString);
                //M Tank
                var MResult = (psi * MTank) / lpm;
                var MHours = Math.floor(MResult / 60);
                var MMin = Math.floor(((MResult / 60) - MHours) * 60);
                var MResultString = MHours+"h "+MMin+"m";
                $("#FFM").html("M: " + MResultString);
                //H Tank
                var HResult = (psi * HTank) / lpm;
                var HHours = Math.floor(HResult / 60);
                var HMin = Math.floor(((HResult / 60) - HHours) * 60);
                var HResultString = HHours+"h "+HMin+"m";
                $("#FFH").html("H: " + HResultString);
                
                //Set Details pages
                $('.back-button').attr('href', "#free-flow");
                $('.psi').html($("#FFPSI").val());
                $('.lpm').html($("#FFLPM").val());
                $('.FF-Calc').css('display', "block");
                $('.V-Calc').css('display', "none");
                //D
                $("#d-duration").html(DHours + " Hours and " + DMin + " Minutes remaining in the D-Cylinder");
                $('.d-equation-minutes').html(Math.floor(DResult));
                //JD
                $("#jd-duration").html(JDHours + " Hours and " + JDMin + " Minutes remaining in the JD-Cylinder");
                $('.jd-equation-minutes').html(Math.floor(JDResult));
                //E
                $("#e-duration").html(EHours + " Hours and " + EMin + " Minutes remaining in the E-Cylinder");
                $('.e-equation-minutes').html(Math.floor(EResult));
                //M
                $("#m-duration").html(MHours + " Hours and " + MMin + " Minutes remaining in the M-Cylinder");
                $('.m-equation-minutes').html(Math.floor(MResult));
                //H
                $("#h-duration").html(HHours + " Hours and " + HMin + " Minutes remaining in the H-Cylinder");
                $('.h-equation-minutes').html(Math.floor(HResult));
            }
        }
    },
    Reset: function () {
        $("#FFPSI").val("");
        $("#FFLPM").val("");
    },
    Timer: function () {
        if($("#FFTimerMessage").html() === "Stop Timer") {
            FreeFlow.Stop();
        } else {
            FreeFlow.Start();
        }
    },
    Start: function () {
        $("#FFTimerMessage").html("Stop Timer");
        FreeFlow.StartTime = new Date().getTime();
        FreeFlow.Interval = window.setInterval( function () {
            var time = new Date().getTime() - FreeFlow.StartTime;
            FreeFlow.Seconds = Math.floor(time / 1000);
            FreeFlow.Minutes = Math.floor(FreeFlow.Seconds / 60);
            FreeFlow.Hours = Math.floor(FreeFlow.Minutes / 60);
            while(FreeFlow.Seconds >= 60) {
                FreeFlow.Seconds -= 60;
            }
            while(FreeFlow.Minutes >= 60) {
                FreeFlow.Minutes -= 60;
            }
            var seconds = "";
            var min = "";
            var hr = "";
            if(FreeFlow.Seconds < 10){
                seconds = "0" + FreeFlow.Seconds;
            } else {
                seconds = FreeFlow.Seconds;
            }
            if(FreeFlow.Minutes < 10){
                min = "0" + FreeFlow.Minutes;
            } else {
                min = FreeFlow.Minutes;
            }
            if(FreeFlow.Hours < 10){
                hr = "0" + FreeFlow.Hours;
            } else {
                hr = FreeFlow.Hours;
            }
            $("#FFTimer").html(hr + ":" + min + ":" + seconds);
        }, 1000);
    },
    Stop: function () {
        $("#FFTimerMessage").html("Restart Timer");
        clearInterval(FreeFlow.Interval);
    }
};

var Vent = {
    StartTime: 0,
    Hour: 0,
    Minute: 0,
    Second: 0,
    Interval: null,
    Calculate: function () {
        var DTank = 0.19;
        var JDTank = 0.29;
        var ETank = 0.31;
        var MTank = 1.57;
        var HTank = 3.22;
        var psi = $("#VPSI").val();
        var rate = $("#VRate").val();
        var volume = $("#VVol").val();
        var percent = $("#VFiO2").val();
        if(psi<=0 || psi>=3001 || psi=="") {
            navigator.notification.alert("PSI must be between 1 and 3000", function () {}, "PSI Error!", "OK");
            $("#VPSI").val("");
        } else {
            if(rate<=0 || rate>=101 || rate=="") {
                navigator.notification.alert("Rate must be between 1 and 100", function () {}, "Rate Error!", "OK");
                $("#VRate").val("");
            } else {
                if(volume<=0 || volume>=1001 || volume=="") {
                    navigator.notification.alert("Volume must be between 1 and 1000", function () {}, "Volume Error!", "OK");
                    $("#VVol").val("");
                } else {
                    if(percent<=0 || percent >=101 || percent=="") {
                        navigator.notification.alert("FiO2 must be between 1 and 100", function () {}, "FiO2 Error!", "OK");
                        $("#VFiO2").val("");
                    } else {
                        //D Tank
                        var DResult = ((psi * DTank) / ((rate * volume) / 1000) / (percent / 100));
                        var DHours = Math.floor(DResult / 60);
                        var DMin = Math.floor(((DResult / 60) - DHours) * 60);
                        var DResultString = DHours+"h "+DMin+"m";
                        $("#VD").html("D: " + DResultString);
                        //JD Tank
                        var JDResult = ((psi * JDTank) / ((rate * volume) / 1000) / (percent / 100));
                        var JDHours = Math.floor(JDResult / 60);
                        var JDMin = Math.floor(((JDResult / 60) - JDHours) * 60);
                        var JDResultString = JDHours+"h "+JDMin+"m";
                        $("#VJD").html("JD: " + JDResultString);
                        //E Tank
                        var EResult = ((psi * ETank) / ((rate * volume) / 1000) / (percent / 100));
                        var EHours = Math.floor(EResult / 60);
                        var EMin = Math.floor(((EResult / 60) - EHours) * 60);
                        var EResultString = EHours+"h "+EMin+"m";
                        $("#VE").html("E: " + EResultString);
                        //M Tank
                        var MResult = ((psi * MTank) / ((rate * volume) / 1000) / (percent / 100));
                        var MHours = Math.floor(MResult / 60);
                        var MMin = Math.floor(((MResult / 60) - MHours) * 60);
                        var MResultString = MHours+"h "+MMin+"m";
                        $("#VM").html("M: " + MResultString);
                        //H Tank
                        var HResult = ((psi * HTank) / ((rate * volume) / 1000) / (percent / 100));
                        var HHours = Math.floor(HResult / 60);
                        var HMin = Math.floor(((HResult / 60) - HHours) * 60);
                        var HResultString = HHours+"h "+HMin+"m";
                        $("#VH").html("H: " + HResultString);
                        
                        //Set Details pages
                        $('.back-button').attr('href', "#vent");
                        $('.psi').html($("#VPSI").val());
                        $('.lpm').html((rate * volume) / 1000);
                        $('.rr').html($("#VRate").val());
                        $('.tidal-volume').html($("#VVol").val());
                        $('.fio2').html($("#VFiO2").val());
                        $('.V-Calc').css('display', "block");
                        $('.FF-Calc').css('display', "none");
                        //D
                        $("#d-duration").html(DHours + " Hours and " + DMin + " Minutes remaining in the D-Cylinder");
                        $('.d-equation-minutes').html(Math.floor(DResult));
                        //JD
                        $("#jd-duration").html(JDHours + " Hours and " + JDMin + " Minutes remaining in the JD-Cylinder");
                        $('.jd-equation-minutes').html(Math.floor(JDResult));
                        //E
                        $("#e-duration").html(EHours + " Hours and " + EMin + " Minutes remaining in the E-Cylinder");
                        $('.e-equation-minutes').html(Math.floor(EResult));
                        //M
                        $("#m-duration").html(MHours + " Hours and " + MMin + " Minutes remaining in the M-Cylinder");
                        $('.m-equation-minutes').html(Math.floor(MResult));
                        //H
                        $("#h-duration").html(HHours + " Hours and " + HMin + " Minutes remaining in the H-Cylinder");
                        $('.h-equation-minutes').html(Math.floor(HResult));
                    }
                }
            }
        }
    },
    Reset: function () {
        $("#VPSI").val("");
        $("#VRate").val("");
        $("#VVol").val("");
        $("#VFiO2").val("100");
    },
    Timer: function () {
        if ($("#VTimerMessage").html() === "Stop Timer") {
            Vent.Stop();
        } else {
            Vent.Start();
        }
    },
    Start: function () {
        $("#VTimerMessage").html("Stop Timer");
        Vent.StartTime = new Date().getTime();
        Vent.Interval = window.setInterval(function () {
            var time = new Date().getTime() - Vent.StartTime;
            Vent.Seconds = Math.floor(time / 1000);
            Vent.Minutes = Math.floor(Vent.Seconds / 60);
            Vent.Hours = Math.floor(Vent.Minutes / 60);
            while (Vent.Seconds >= 60) {
                Vent.Seconds -= 60;
            }
            while (Vent.Minutes >= 60) {
                Vent.Minutes -= 60;
            }
            var seconds = "";
            var min = "";
            var hr = "";
            if (Vent.Seconds < 10) {
                seconds = "0" + Vent.Seconds;
            } else {
                seconds = Vent.Seconds;
            }
            if (Vent.Minutes < 10) {
                min = "0" + Vent.Minutes;
            } else {
                min = Vent.Minutes;
            }
            if (Vent.Hours < 10) {
                hr = "0" + Vent.Hours;
            } else {
                hr = Vent.Hours;
            }
            $("#VTimer").html(hr + ":" + min + ":" + seconds);
        }, 1000);
    },
    Stop: function () {
        $("#VTimerMessage").html("Restart Timer");
        clearInterval(Vent.Interval);
    }
};

var Details = {
    ShowTanks: function () {
        window.open("img/O2Tanks.jpg", "_blank", "enableViewportScale=yes");
    },
    ShowFacebook: function () {
        window.open("http://facebook.com/BluelineApps", "_blank");
    },
    ShowTwitter: function () {
        window.open("http://twitter.com/BluelineApps", "_blank");
    }
};