/*Common Methods-Begins*/
function checkConnection() {
    //Method to check Internet availablity

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == 'No network connection') {
        return false;
    } else {
        return true;
    }
}

function showAlert(alertMsg) {
    //Method to show native Alerts

    navigator.notification.alert(alertMsg, function() {
        console.log("Ok Clicked");
    }, "KCW");
}

function openBrowser(url) {
    var corBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no');
    return corBrowser;
}

/* $(window).scroll(function(){
    console.warn("scrolled");
    if($("body").hasClass('active-nav')){
        console.log("panel shown");
        $(".side_nav").toggle();
        $(".side_nav .nav-toggle-btn").show();
        //$('.nav-toggle-btn').css({"left":'178px'});
        //$("body").toggleClass('active-nav')
    }
 });*/
