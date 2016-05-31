 socialstudioserver = "107.170.201.114:3004";

var loginMethods = {
	orderedpicarray : [],
	camcarray : [],
	orderedpicarrayInsta : [],
	orderedpicarrayfinal : [],
     myorder : [],
	fbLogin: function() {
  //  if (checkConnection()) {
	//  $(document).bind("deviceready", function() {
     
	  
        facebookConnectPlugin.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                localStorage.fbuserid = response.authResponse.userID;
                localStorage.fbaccesstoken = response.authResponse.accessToken;
				
                loginMethods.fetchFBDetails();
            } else if (response.status === 'not_authorized') {
                facebookConnectPlugin.login(["public_profile", "email"], function(userData) {
                        loginMethods.fbLoginSuccess(userData)
                    },
                    function(fbLoginError) {
                        showAlert("fbLoginError" + JSON.stringify(fbLoginError));
                    });
            } else {
                facebookConnectPlugin.login(["public_profile", "email"], function(userData) {
                        loginMethods.fbLoginSuccess(userData)
                    },
                    function(fbLoginError) {
                        showAlert("fbLoginError" + JSON.stringify(fbLoginError));
                    });
            }
        }, function(data) {
            console.warn(data);
        });

},
fbLoginSuccess : function(fbUserData) {
   
    console.log(JSON.stringify(fbUserData.authResponse));
    localStorage.setItem('fbuserid', fbUserData.authResponse.userID);
    localStorage.setItem('fbaccesstoken', fbUserData.authResponse.accessToken);
	
    loginMethods.fetchFBDetails();
	


},

fetchFBDetails :function() {
    //Method to Extract Data from Facebook after Login
    /**added name parameter ,reuired for signin/login api included picture**/
    facebookConnectPlugin.api("/me?fields=email,name,picture", ['public_profile' ,"user_photos"],
        function(fbPermissions) {
			localStorage.fbsignupdata= JSON.stringify(fbPermissions)
			 console.log(JSON.parse(localStorage.fbsignupdata))
		
       // showAlert("fbPermissions: " + JSON.stringify(fbPermissions));
	
		loginMethods.getLonglivedToken()
	
		 //window.location="social-album_View.html"
           
        },
        function(fetchFBDetailsError) {
            alert("fetchFBDetailsError: " + JSON.stringify(fetchFBDetailsError));
        }


    );
},
getLonglivedToken :function()
{
	
	$.ajax({
	    type : 'GET',
	    url: 'https://graph.facebook.com/oauth/access_token'  ,
		beforeSend: function() {
							console.log('ajaxstart');
							$("body").addClass("loading");
						},
						complete: function() {
							//alert('ajaxstopp')
							$("body").removeClass("loading");
							
						},
		data : {
		"client_id" :"585577864930206",
		"grant_type":'fb_exchange_token',
		"client_secret" : '289f24ae4982844f25bbc31bc3ac787a',
		"fb_exchange_token" : localStorage.fbaccesstoken 
		
},
	   success : function(data)
			    { 
			localStorage.shortlived=localStorage.fbaccesstoken 	
	console.log(data)
	var at= data.split('=')
	
	localStorage.fbaccesstoken=''
	
	localStorage.fbaccesstoken=at[1]
	
	//loginMethods.addUserInfo();
	loginMethods.getUserInfo();

	 
				
	
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);
	var key="fbaccesstoken"
	localStorage.removeItem(key);
	loginMethods.fbLogin()
	}						 
		
		
		});//end of ajax call 
},
getUserInfo : function()
{
	 $.ajax({
	    type : 'GET',
	    url: 'http://'+socialstudioserver+'/user/getuserdetails' ,
		
		data : {
		"userID":  localStorage.getItem('fbuserid')
		//"userID":  fbid
},
	   success : function(data)
			    { 
				console.log(data)
				//alert(JSON.stringify(data))
				if(data.results.length)
				{
					console.log(data)
					var vdata =JSON.parse(data.results)
					console.log(vdata)
				localStorage.userid=vdata[0].userId
				console.log(vdata.userId)
				localStorage.present=true
			  window.location="social-album_View.html"
				}
				else{
					
					loginMethods.addUserInfo()
				}
	 
				
	console.log(data)
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);
	alert(error)}						 
		
		
		});//end of ajax call 
},
displayfbalbum : function()
{  

$("body").addClass("loading");
	  if (localStorage.getItem('instagramtoken') != undefined || localStorage.getItem('instagramtoken') !="")
	  {
		localStorage.onalbum=false 
      	
	  }
	  else
	  {
		  
	localStorage.onalbum=true
	  }
	var userid = localStorage.getItem('fbuserid');
    var albums;
	 $(document).bind("deviceready", function() { 
                //loading deviceready
		 
     facebookConnectPlugin.api('/'+userid+'/albums?fields=picture,name,id,count', ["user_photos"], function(response){
      if (!response || response.error) {
        albums = response.error;
      } else {
        albums = response;
		console.log(' album');
		console.log(response);
		    //alert("response: " + JSON.stringify(response));
		       var newdata = JSON.stringify(response);
			   
				localStorage.setItem('newdata' ,newdata);
				var parsedata =JSON.parse(localStorage.getItem('newdata'));
	
		 if(parsedata.data.length%2==0)
		{ for(i=0;i < parsedata.data.length; i += 2)
		 {
		   
		
				$('.inner-page-bg').append('	<div class="row" style="padding:5px 0">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
                            	<div class="album-img-container">\
							    	<img class="card-img-top album" src="'+parsedata.data[i].picture.data.url+'" id="'+parsedata.data[i].id+'" >\
							    </div>\
								\
								<div class="row album-info-bg">\
								    <div class="col-xs-9 no-padding">\
                                        <h4 class="card-title album-name">'+parsedata.data[i].name+'</h4>\
									</div>\
									<div class="col-xs-3 no-padding">\
                                        <span class="album-count">'+parsedata.data[i].count+'</span>\
									</div>\
					            </div>\
                            </div>\
                        </div>\
						\
						<div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
                            	<div class="album-img-container">\
							    	<img class="card-img-top album" src="'+parsedata.data[i+1].picture.data.url+'" id="'+parsedata.data[i+1].id+'" >\
							    </div>\
								\
								<div class="row album-info-bg">\
								    <div class="col-xs-9 no-padding">\
                                        <h4 class="card-title album-name">'+parsedata.data[i+1].name+'</h4>\
									</div>\
									<div class="col-xs-3 no-padding">\
                                        <span class="album-count">'+parsedata.data[i+1].count+'</span>\
									</div>\
					            </div>\
                            </div>\
                        </div>\
                    </div>');
		 
		 
		 } }
		 
		 else
		 {
		 
		 for(i=0;i < parsedata.data.length-1; i += 2)
		 {
		  
		
				$('.inner-page-bg').append('	<div class="row" style="padding:5px 0">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block ">\
                            	<div class="album-img-container ">\
							    	<img class="card-img-top album" src="'+parsedata.data[i].picture.data.url+'" id="'+parsedata.data[i].id+'" >\
							    </div>\
								\
								<div class="row album-info-bg">\
								    <div class="col-xs-9 no-padding">\
                                        <h4 class="card-title album-name">'+parsedata.data[i].name+'</h4>\
									</div>\
									<div class="col-xs-3 no-padding">\
                                        <span class="album-count">'+parsedata.data[i].count+'</span>\
									</div>\
					            </div>\
                            </div>\
                        </div>\
						\
						<div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
                            	<div class="album-img-container">\
							    	<img class="card-img-top album" src="'+parsedata.data[i+1].picture.data.url+'" id="'+parsedata.data[i+1].id+'" >\
							    </div>\
								\
								<div class="row album-info-bg">\
								    <div class="col-xs-9 no-padding">\
                                        <h4 class="card-title album-name">'+parsedata.data[i+1].name+'</h4>\
									</div>\
									<div class="col-xs-3 no-padding">\
                                        <span class="album-count">'+parsedata.data[i+1].count+'</span>\
									</div>\
					            </div>\
                            </div>\
                        </div>\
                    </div>');
		 
		 
		 }
		  $('.inner-page-bg').append('<div class="row" style="padding:5px 0">\
				   <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+parsedata.data[i+1].picture.data.url+'" id="'+parsedata.data[i+1].id+'">\
								\
								<div class="row album-info-bg">\
								    <div class="col-xs-9 no-padding">\
                                        <h4 class="card-title album-name">'+parsedata.data[i+1].name+'</h4>\
									</div>\
									<div class="col-xs-3 no-padding">\
                                        <span class="album-count">'+parsedata.data[i+1].count+'</span>\
									</div>\
					            </div>\
                            </div>\
                        </div>\
                    </div>');
		 
		 }
    }
	
	
})

});
$("body").removeClass("loading");
},
displyfbpic : function()
{
	$("body").addClass("loading");
	 $('#addbtn').hide()
	var album_id = localStorage.getItem('albumid');
	//alert(album_id)
	$('.albumpic').html('')
	$(document).bind("deviceready", function() {
                //document.addEventListener("backbutton", function() {
                //console.log("Disabled Back button");

                facebookConnectPlugin.api('/' + album_id + '/photos?fields=images&limit=100', ["user_photos"], function(response) {
                    if (!response || response.error) {
                        albums = response.error;
                    } else {
                        console.log(response);
                        console.log("response: " + JSON.stringify(response));

                        var albumdata = JSON.stringify(response);
                        localStorage.setItem('albumdata', ' ');
                        localStorage.setItem('albumdata', albumdata);
                        var parsealbumdata = JSON.parse(localStorage.getItem('albumdata'));

                        for (j = 0; j < parsealbumdata.data.length; j += 2) {
                            console.log(j)
                            var source1 = './assets/img/no_img.jpg'
                            var source2 = './assets/img/no_img.jpg'

                            // console.log(parsealbumdata.data[j].images[j].source);
                            // console.log(parsealbumdata.data[j+1].images[j+1].source);

                            if (parsealbumdata.data[j].images[0])
                                source1 = parsealbumdata.data[j].images[0].source
                            if (parsealbumdata.data[j + 1].images[0])
                                source2 = parsealbumdata.data[j + 1].images[0].source

                 
				$('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
                            	<div class="album-img-container">\
							    	<img class="card-img-top picalbum" src="' + source1 + '">\
							    </div>\
								<h4 class="card-title tag-names" data-url="'+source1+'" onclick="loginMethods.selectfbpic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
                            	<div class="album-img-container">\
							    	<img class="card-img-top picalbum" src="' + source2 + '">\
							    </div>\
								<h4 class="card-title tag-names" data-url="'+source2+'" onclick="loginMethods.selectfbpic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div>\
                    </div>')

                        }

                    }
                });
            });
	
	$("body").removeClass("loading");
},
displylastfbpic : function()
{$("body").addClass("loading");
	$('#addbtn').hide()
	var album_id = localStorage.getItem('albumid');
	
	if(localStorage.getItem('albumid')!="" &&localStorage.getItem('albumid')!= undefined )
	{
		
	}
	else
	{
		
		//loginMethods.displayfbalbum()
		window.location="social-album_View.html"
		return;
	}
	
	//alert(album_id)
	$('.albumpic').html('')
	//$(document).bind("deviceready", function() {
                //document.addEventListener("backbutton", function() {
                //console.log("Disabled Back button");

                facebookConnectPlugin.api('/' + album_id + '/photos?fields=images&limit=100', ["user_photos"], function(response) {
                    if (!response || response.error) {
                        albums = response.error;
                    } else {
                        console.log(response);
                        console.log("response: " + JSON.stringify(response));

                        var albumdata = JSON.stringify(response);
                        localStorage.setItem('albumdata', ' ');
                        localStorage.setItem('albumdata', albumdata);
                        var parsealbumdata = JSON.parse(localStorage.getItem('albumdata'));

                        for (j = 0; j < parsealbumdata.data.length; j += 2) {
                            console.log(j)
                            var source1 = './assets/img/no_img.jpg'
                            var source2 = './assets/img/no_img.jpg'

                            // console.log(parsealbumdata.data[j].images[j].source);
                            // console.log(parsealbumdata.data[j+1].images[j+1].source);

                            if (parsealbumdata.data[j].images[0])
                                source1 = parsealbumdata.data[j].images[0].source
                            if (parsealbumdata.data[j + 1].images[0])
                                source2 = parsealbumdata.data[j + 1].images[0].source

                 
				$('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="' + source1 + '">\
								<h4 class="card-title tag-names" data-url="'+source1+'" onclick="loginMethods.selectfbpic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="' + source2 + '">\
								<h4 class="card-title tag-names" data-url="'+source2+'" onclick="loginMethods.selectfbpic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div>\
                    </div>')

                        }

                    }
                });
           // });
	
	$("body").removeClass("loading");
},
linkInstagram : function() {
  localStorage.onalbum=false
    var instagramClientId = "2449c6ccef5e4d75ad8e5a0118797058";
    var redirect_uri = "http://localhost/callback/";
    if (checkConnection()) {
        if (localStorage.getItem('instagramtoken') == null)
		{ var instaWindow = openBrowser("https://api.instagram.com/oauth/authorize/?client_id=" + instagramClientId + "&redirect_uri=" + redirect_uri + "&response_type=token"); 
	    
		}
        else 
			{
		     loginMethods.getinstaalbum()
			console.log("You have already Linked Instagram");
			}
    } else showAlert("Please Connect to Internet to Login");
    instaWindow.addEventListener('loadstart', function(event) {
        if ((event.url).indexOf(redirect_uri) === 0) {
            var instagramAccessToken = (event.url).split('#access_token=')[1] || '';
            if (instagramAccessToken !== null)
			{
                localStorage.setItem('instagramtoken', instagramAccessToken);
				loginMethods.getinstaalbum()
			}
            else
                showAlert("Couldn't Authenticate your Instagram account");
            instaWindow.close();
        }

    });
},
goBack :function()
{
	history.back()
	
},

getinstaalbum : function()
{
	
		  $.ajax({
	    type : 'GET',
	    url: 'https://api.instagram.com/v1/users/self/media/recent?access_token='+localStorage.instagramtoken ,
		beforeSend: function() {
							console.log('ajaxstart');
							$("body").addClass("loading");
						},
						complete: function() {
							//alert('ajaxstopp')
							$("body").removeClass("loading");
							
						},
		data : {
		
},
	   success : function(data)
			    { 
				
	  localStorage.instaAlbum= JSON.stringify(data)
	 // localStorage.frominstagram=true
	  //window.location="album_gallery_View.html"
	  if(localStorage.onalbum='true')
	  {
		window.location="album_gallery_View.html"  
	  }
	  else
		  
	loginMethods.displyinstapic()
				
	
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);}						 
		
		
		});//end of ajax call 
	
},
showHide :function()
{
	$('.app-name-header').hide()
	$('.search').show()
	
}
,getMyorder : function()
{
		  $.ajax({
	    type : 'GET',
	    url: 'http://'+socialstudioserver+'/user/getMyOrders' ,
			beforeSend: function() {
							console.log('ajaxstart');
							$("body").addClass("loading");
						},
						complete: function() {
							//alert('ajaxstopp')
							$("body").removeClass("loading");
							
						},
		data : {
			//userID: 6 
			userID: localStorage.userid 
		},
	   success : function(data)
			    { 
					var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
						
				console.log(data)
				if(typeof data.results == "undefined") {
					return;
				}
				var count=0
				for( var  i=0 ; i<data.results.length ;i++)
				{
					for( var  k=0 ; k<data.results[i].photos.length ;k++)
				{      count=count + data.results[i].photos[k].noOfCopies }
					console.log(i)
					console.log(data.results[i].orderDateTime)
					
					var dm = new Date(data.results[i].orderDateTime)
					 var day_date = dm.getDate();
					  var year = dm.getFullYear();
					  var month =dm.getMonth();
					  
					$('.orderList').append('<div class="media order-report" onclick="loginMethods.getdetails(this)" data-no="'+count+'" data-orderid="'+data.results[i].orderId+'">\
                                    <div class="media-left">\
                                        <a href="#">\
                                            <img class="media-object" src="'+data.results[i].photos[0].picURL+'" height="64" width="64">\
                                        </a>\
                                    </div>\
                                    <div class="media-body order-processing">\
                                        <h5 class="media-heading order-date">'+day_date+' '+monthNames[month]+' '+year+' <span>&#8377 '+data.results[i].orderCost+'</span></h5>\
								            '+data.results[i].photos.length+' Photos <br /> '+data.results[i].status+'...\
                                    </div>\
                                </div>');
				} 
				
				
				
	
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);}						 
		
		
		});//end of ajax call 
	
},
getdetails :function(id) {
	
	var orderID =$(id).data('orderid')
	var copies =$(id).data('no')
	localStorage.orderid=orderID
	localStorage.copies=copies
	window.location="my_order_Details.html"
}
,
showdetails : function()
{
	  $.ajax({
	    type : 'GET',
	    url: 'http://'+socialstudioserver+'/user/getMyOrders' ,
	
		data : {
		//userID: 6 
		userID: localStorage.userid
},
	   success : function(data)
			    { 
				console.log(data)
				var count=0;
				var index = 0
				
				$('.carousel-inner').html('')
				for( var  i=0 ; i<data.results.length ;i++)
				{
					
					if(localStorage.orderid==data.results[i].orderId)
					{  
				    index=i 
				
					break;
					}
					
					
					
					
				} 
				
				 
						for( var  k=0 ; k<data.results[index].photos.length ;k++)
				{   
					if(k==0)
					{
						
				$('.carousel-inner').append('<div class="item active">\
                                        <img src="'+data.results[i].photos[k].picURL+'">\
                                    </div>')
					}
                     else
					 {
						 
							$('.carousel-inner').append('<div class="item ">\
                                        <img src="'+data.results[i].photos[k].picURL+'">\
                                    </div>') 
					 }						 
				}
				 console.log(count)
						
						//$('#total').html( "Total Print file" +count+ "</span>&#8377 100</span>")
				
				console.log(data.results[index].orderDateTime)
					
					var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
							 "July", "Aug", "Sept", "Oct", "Nov", "Dec"
							 ];
					var dm = new Date(data.results[index].orderDateTime)
					 var day_date = dm.getDate();
					  var year = dm.getFullYear();
					  var month =dm.getMonth();
					  
					  $('.my-order-text').html('')
					  $('.my-order-text').text('My Order on'+day_date+' '+monthNames[month]+' '+year)
					  $('#orderdate').text(day_date+' '+monthNames[month]+' '+year)
					  $('#cstatus').text(data.results[index].status + '...')
					  $('#totalamt').html('')
					  $('#totalamt').html('Total Amount<span>&#8377 ' +data.results[i].orderCost+ ' </span>')
					  
							
	
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);}						 
		
		
		});//end of ajax call 
				
				
				
	
},
addUserInfo : function()
{     

       var userdata = JSON.parse(localStorage.fbsignupdata)
        localStorage.profilePic=userdata.picture.data.url
		  $.ajax({
	    type : 'POST',
	    url: 'http://'+socialstudioserver+'/user/adduser'
 , 	data : {
		"username" : userdata.name,
		"fbID" : localStorage.fbuserid, 
		"userEmail": userdata.email,
		"userMobileNo" : parseInt('1234567891'), 
		"userProfilePicUrl" :userdata.picture.data.url ,
		"userToken" :localStorage.fbaccesstoken ,
},
	   success : function(data)
			    { 
				
				console.log(data)
				localStorage.userid=data.userInfo.insertId
				localStorage.present=true
			
				window.location="social-album_View.html"
 
			   //window.location="social-album_View.html" 
	} ,
	
	error   : function (xhr, status, error)
	{console.log(xhr);}						 
		
		
		});//end of ajax call /
	
} ,
displyinstapic : function()
{$("body").addClass("loading");
	      $('#addbtn').hide()
	        var data = JSON.parse(localStorage.instaAlbum)
            console.log(data)
            console.log(data.data.length)
			$('.albumpic').html('')

            if (data.data.length % 2 == 0) {
                for (var j = 0; j < data.data.length; j += 2) {
                    $('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top picalbum" src="' + data.data[j].images.low_resolution.url + '">\
								<h4 class="card-title tag-names" data-url="'+data.data[j].images.low_resolution.url +'" onclick="loginMethods.selectinstapic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top picalbum" src="' + data.data[j + 1].images.low_resolution.url + '">\
								<h4 class="card-title tag-names" data-url="'+data.data[j + 1].images.low_resolution.url +'" onclick="loginMethods.selectinstapic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div>\
                    </div>')
				

                }


            } else {
                for (var j = 0; j < data.data.length - 1; j += 2) {


                     $('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top picalbum" src="' + data.data[j].images.low_resolution.url + '">\
								<h4 class="card-title tag-names" data-url="'+data.data[j].images.low_resolution.url +'" onclick="loginMethods.selectinstapic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top picalbum" src="' + data.data[j + 1].images.low_resolution.url + '">\
								<h4 class="card-title tag-names" data-url="'+data.data[j + 1].images.low_resolution.url +'" onclick="loginMethods.selectinstapic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div>\
                    </div>')

                }
				
				  $('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="' + data.data[data.data.length - 1].images.low_resolution.url + '">\
								<h4 class="card-title tag-names" data-url=" '+ data.data[data.data.length - 1].images.low_resolution.url +'" onclick="loginMethods.selectinstapic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            \
                        </div>\
                    </div>')



                /******/

            }//endelse

$("body").removeClass("loading");
},
selectfbpic : function(id)
{
	if($(id).hasClass('tag-names'))
	{
	var url = $(id).data('url')
		var b = {"picUrl" : url ,
	         "accountType": 'fb' ,
			 "picSize":"30x30",
			 //"noOfItems" : 0
			 "noOfItems" : 1
			 }
	loginMethods.orderedpicarray.push(url)
	loginMethods.orderedpicarrayfinal.push(b)
	$(id).removeClass('tag-names')
	$(id).addClass('tag-names-active')
	console.log(loginMethods.orderedpicarray)
	
	}
	else{
	var url = $(id).data('url')
	$(id).removeClass('tag-names-active')	
	$(id).addClass('tag-names')
	for(var k =0;k<loginMethods.orderedpicarray.length ; k++)
	{
		if(loginMethods.orderedpicarray[k]===url)
			 loginMethods.orderedpicarray.splice(k, 1);
		
	}
	for(var k =0;k<loginMethods.orderedpicarrayfinal.length ; k++)
	{
		if(loginMethods.orderedpicarrayfinal[k].picUrl===url)
			 loginMethods.orderedpicarrayfinal.splice(k, 1);
		
	}
	//console.log(loginMethods.orderedpicarray)	
	console.log(loginMethods.orderedpicarrayfinal)	
	localStorage['selectedpicsfb'] = JSON.stringify(loginMethods.orderedpicarray);
	console.log(JSON.parse(localStorage['selectedpicsfb']))
	}
	localStorage['selectedpicsfb'] = JSON.stringify(loginMethods.orderedpicarray);
	
	//console.log(JSON.parse(localStorage['selectedpicsfb']))
},
selectcampic : function(id)
{
	if($(id).hasClass('tag-names'))
	{
	var url = $(id).data('url')
		var b = {"picUrl" : url ,
	         "accountType": 'cameraRoll' ,
			 "picSize":"30x30",
			 //"noOfItems" : 0
			 "noOfItems" : 1
			 }
	loginMethods.camcarray.push(url)
	loginMethods.orderedpicarrayfinal.push(b)
	$(id).removeClass('tag-names')
	$(id).addClass('tag-names-active')
	console.log(loginMethods.orderedpicarrayfinal)
	
	}
	else{
	var url = $(id).data('url')
	$(id).removeClass('tag-names-active')	
	$(id).addClass('tag-names')
	
	for(var k =0;k<loginMethods.camcarray.length ; k++)
	{
		if(loginMethods.camcarray[k]===url)
			 loginMethods.camcarray.splice(k, 1);
		
	}for(var k =0;k<loginMethods.orderedpicarrayfinal.length ; k++)
	{
		if(loginMethods.orderedpicarrayfinal[k].picUrl===url)
			 loginMethods.orderedpicarrayfinal.splice(k, 1);
		
	}
	//console.log(loginMethods.orderedpicarray)	
	
	}
	
	localStorage['camcarrayy']=JSON.stringify(loginMethods.camcarray)
	
	console.log(loginMethods.orderedpicarrayfinal)	},
selectinstapic : function(id)
{ 
    
	if($(id).hasClass('tag-names'))
	{
	var url = $(id).data('url')
	var b = {"picUrl" : url ,
	         "accountType": 'instagram' ,
			 "picSize":"30x30",
			 "noOfItems" : 1}
	loginMethods.orderedpicarrayfinal.push(b)
	loginMethods.orderedpicarrayInsta.push(url)
	$(id).removeClass('tag-names')
	$(id).addClass('tag-names-active')
	//console.log(loginMethods.orderedpicarrayInsta)
	console.log(loginMethods.orderedpicarrayfinal)
	
	}
	else{
	var url = $(id).data('url')
	$(id).removeClass('tag-names-active')	
	$(id).addClass('tag-names')
	for(var k =0;k<loginMethods.orderedpicarrayInsta.length ; k++)
	{
		if(loginMethods.orderedpicarrayInsta[k]===url)
			 loginMethods.orderedpicarrayInsta.splice(k, 1);
		
	}
	for(var k =0;k<loginMethods.orderedpicarrayfinal.length ; k++)
	{
		if(loginMethods.orderedpicarrayfinal[k].picUrl===url)
			 loginMethods.orderedpicarrayfinal.splice(k, 1);
		
	}
	//console.log(loginMethods.orderedpicarrayInsta)	
	console.log(loginMethods.orderedpicarrayfinal)	
	
	}
	localStorage['orderedpicarrayInsta'] = JSON.stringify(loginMethods.orderedpicarrayInsta);
	
},	
placeorder : function()
{

localStorage['orderedpicarrayfinal']= JSON.stringify(loginMethods.orderedpicarrayfinal);

console.log(JSON.parse(localStorage['orderedpicarrayfinal']))

if(loginMethods.orderedpicarrayfinal.length)
{window.location="order_Page.html"}
else
{
	showAlert('choose pic');
}

	
},
orderedlist : function()
{
	var ordered = new Array()
	ordered = JSON.parse(localStorage['orderedpicarrayfinal'])
	console.log(ordered)
	console.log(ordered.length)
	v = ordered.length * 20

	//setHTML
	var textm = ordered.length + ' '+ 'Photos Selected'
	$('.photos-selected-text').html(textm)
	
	$('#tcost').html('')
	$('#tcost').text('' + v +'/-')
	
	
	
	
 if (ordered.length % 2 == 0) {
                for (var j = 0; j < ordered.length; j += 2) {
                    var v = j+1 ;
				$('.orderpic').append('<div class="row" style="padding-top:10px; padding-bottom:11px">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+ordered[j].picUrl+'">\
								<h4 class="card-title tag-names-active"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
							 </div>\
							\
							<div class="order-btn-bg">\
							  <div class="text-center">\
								<div class="btn-group order-btns" role="group" aria-label="...">\
                                    <button type="button" class="btn btn-default dec" data-index="'+j+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-down"></i></button>\
                                    <button type="button" class="btn btn-default order-count" id="'+j+'count">1</button>\
                                    <button type="button" class="btn btn-defaultinc" data-index="'+j+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-up"></i></button>\
                                </div>\
							  </div>\
							</div>\
                        </div>\
						<div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+ordered[j+1].picUrl+'">\
								<h4 class="card-title tag-names-active"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
							\
							<div class="order-btn-bg">\
							  <div class="text-center">\
								<div class="btn-group order-btns" role="group" aria-label="...">\
                                    <button type="button" class="btn btn-default dec" data-index="'+v+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-down"></i></button>\
                                    <button type="button" class="btn btn-default order-count"id="'+v+'count">1</button>\
                                    <button type="button" class="btn btn-default inc" data-index="'+v+'" onclick="loginMethods.countitems(this)" ><i class="fa fa-angle-up"></i></button>\
                                </div></div></div> </div> </div>')
						
                  

                }


            } else {
				//alert('else')
                for (var j = 0; j < ordered.length - 1; j += 2) {
     var v = j+1
$('.orderpic').append('<div class="row" style="padding-top:10px; padding-bottom:11px">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+ordered[j].picUrl+'">\
								<h4 class="card-title tag-names-active"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
							 </div>\
							\
							<div class="order-btn-bg">\
							  <div class="text-center">\
								<div class="btn-group order-btns" role="group" aria-label="...">\
                                    <button type="button" class="btn btn-default dec" data-index="'+j+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-down"></i></button>\
                                    <button type="button" class="btn btn-default order-count"id="'+j+'count">1</button>\
                                    <button type="button" class="btn btn-default inc" data-index="'+j+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-up"></i></button>\
                                </div>\
							  </div>\
							</div>\
                        </div>\
						<div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+ordered[j+1].picUrl+'">\
								<h4 class="card-title tag-names-active"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
							\
							<div class="order-btn-bg">\
							  <div class="text-center">\
								<div class="btn-group order-btns" role="group" aria-label="...">\
                                    <button type="button" class="btn btn-default dec" data-index="'+v+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-down"></i></button>\
                                    <button type="button" class="btn btn-default order-count"id="'+v+'count">1</button>\
                                    <button type="button" class="btn btn-default inc" data-index="'+v+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-up"></i></button>\
						 </div></div></div> </div> </div>')

                }
				var m = ordered.length-1
				//alert(ordered[ordered.length-1].picUrl)
				$('.orderpic').append('<div class="row" style="padding-top:10px; padding-bottom:11px">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="'+ordered[m].picUrl+'">\
								<h4 class="card-title tag-names-active "><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
							 </div>\
							\
							<div class="order-btn-bg">\
							  <div class="text-center">\
								<div class="btn-group order-btns" role="group" aria-label="...">\
                                    <button type="button" class="btn btn-default dec" data-index="'+m+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-down"></i></button>\
                                    <button type="button" class="btn btn-default order-count" id="'+m+'count">1</button>\
                                    <button type="button" class="btn btn-default inc" data-index="'+m+'" onclick="loginMethods.countitems(this)"><i class="fa fa-angle-up"></i></button>\
                                </div>\
							  </div>\
							</div>\
                        </div>\
						<div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                         </div> </div>')



                /******/

            }//endelse

	
	
	
},
countitems : function(id) {
	var ordered = new Array()
	ordered = JSON.parse(localStorage['orderedpicarrayfinal'])
	
	var index = $(id).data('index')
	var idx = index + 'count'
	var noOfitems = $('#'+idx).html()

	console.log(idx)
	 if($(id).hasClass('dec'))
	 {
		 if(noOfitems >=1)
		 { noOfitems-- 
	 		var k1 =	parseInt($('#tcost').html())
		
			var v = k1-20
       	$('#tcost').html('')
	     $('#tcost').text('' + v +'/-')
	     }
		 $('#'+idx).html(noOfitems)
		 $('#'+idx).html(noOfitems)
		 	
	
		 ordered[index].noOfItems =  noOfitems
	 }
	 else
	 {
		 	 noOfitems++
		 $('#'+idx).html(noOfitems)
		 ordered[index].noOfItems =  noOfitems
	var k1 =	parseInt($('#tcost').html())
	var v = k1+20
	$('#tcost').html('')
	$('#tcost').text('' + v +'/-')
	 }
	 
	 console.log(ordered)
	 localStorage['orderedpicarrayfinal'].length=0
	 localStorage['orderedpicarrayfinal'] = JSON.stringify(ordered)
	
},
getcustomerdetails : function(){
	window.location="order_Details.html"
	
},
buyNow : function()
{
	
	var ordered = new Array()
	ordered = JSON.parse(localStorage['orderedpicarrayfinal'])
	console.log(JSON.stringify(ordered))
	var cost = ordered.length * 20
	if($('#formGroupExampleInput2').val().length > 0 
		&&  $('#formGroupExampleInput3').val().length > 0  
		&&  $('#formGroupExampleInput4').val().length > 0 
		&&  $('#formGroupExampleInput5').val().length > 0
		&&  $('#formGroupExampleInput6').val().length > 0)
	{
 		var add = $('#formGroupExampleInput2').val()
		var city = $('#formGroupExampleInput3').val()
		var state = $('#formGroupExampleInput4').val()
		var pin = $('#formGroupExampleInput5').val()
		var mobno = $('#formGroupExampleInput6').val()

		var postData = {
				
				//"userID":1,
				"userID":localStorage.userid,
				"orderCost":cost,
				"shippingAddress":add,
				"shippingCity":city,
				"shippingState":state,
				"shippingPincode":pin,
				"userMobileNo":mobno,
				"picDetails": ordered,
			//username needed
			}

		var strData = JSON.stringify(postData);
	console.log(strData)
		$.ajax({
		    type : 'POST',
		    url: 'http://'+socialstudioserver+'/user/addorder',
			dataType: "json",
			contentType: 'application/json',
			processData: 'false',
			data : strData,
	   		success : function(data)
			{
				console.log(data)
				showAlert('order successful')
			   window.location="social-album_View.html"
			},
			error   : function (xhr, status, error)
			{console.log(xhr);}						 
		});//end of ajax call 
	}
	else 
	{
		
		showAlert('all fields are required')
	}
},
showAddbtn :function()
{  
	
//	$('.albumpic').html('')
		$('#addbtn').show();
			loginMethods.bindCloudinary()
			//localStorage.localclicked=false ;
			$('.albumpic').html('')
			console.log(localStorage['camcarrayy'])
	//window.location="album_gallery_View.html"
localStorage.onalbum=false
	
}
,
	 bindCloudinary: function() {
		
        console.log("cloudinary method");
        /*$('document').append($.cloudinary.unsigned_upload_tag("bvnmnicy", {
            cloud_name: 'manage-my-shaadi'
			$('.uploader').unsigned_cloudinary_upload("sg0qws40", {
            cloud_name: 'socialstudio'
        }));*/
          $('.uploader').unsigned_cloudinary_upload("bvnmnicy", {
            cloud_name: 'manage-my-shaadi'
        }, {
            multiple: true
        }).bind('cloudinarydone', function(e, data) {
                $("body").addClass("loading");
               var url = data.result.secure_url // save the image url in parse
                // $('.thumbnails').append('<img src="' + data.result.secure_url + '" style="height:30px;width:30px;">');
                console.log("cloudinarydone");
					
					//localStorage['camcarrayy'].length=0
					//localStorage['camcarrayy']=JSON.stringify(loginMethods.camcarray)
				  $('.albumpic').append('<div class="row" style="padding-top:5px;">\
                        <div class="col-xs-6 col-sm-6" style="padding-right:7px;">\
                            <div class="card card-block">\
							    <img class="card-img-top album" src="' + url+ '">\
								<h4 class="card-title tag-names" data-url="'+url+'" onclick="loginMethods.selectcampic(this)"><i class="fa fa-check-square"></i> Tag1, Tag2, Tag3, Tag4</h4>\
									\
                            </div>\
                        </div><div class="col-xs-6 col-sm-6" style="padding-left:7px;">\
                          \
                        </div>\
                    </div>')
            
                $("body").removeClass("loading");
            }

        ).bind('cloudinaryprogress', function(e, data) {
            var progVal = Math.round((data.loaded * 100.0) / data.total);
            $("body").addClass("ui-loading");
            if (progVal == "100") {
                // cm.showAlert("Uploaded Successfully");
                $("body").removeClass("ui-loading");
            }

        });
    },
	rateUs :function() {
		
		
    var customLocale = {};
    customLocale.title = "Rate SocialStudio";
    customLocale.message = "If you enjoy using SS, would you mind taking a moment to rate it? It will not take more than a minute. Thanks for your support!";
    customLocale.cancelButtonLabel = "No,Thanks";
    customLocale.laterButtonLabel = "Later";
    customLocale.rateButtonLabel = "Rate";
    AppRate.preferences.customLocale = customLocale;
    //$window.alert('moni');
    //AppRate.preferences.storeAppURL.android = 'market://details?id=1494980997481060';
    //AppRate.preferences.storeAppURL.ios = '<my_app_id>';
    //AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';

    AppRate.promptForRating(true)
	}
	
};



$(document).on('click','.album' ,function(e){ 

    
	var album_id = e.target.id ;
	localStorage.setItem('albumid',' ');
	localStorage.setItem('albumid',album_id);
	
	window.location='album_gallery_View.html';
	

  
});

$(document).on("keyup", "#enterartist",function() {
    var g = $(this).val().toLowerCase();
    $(".card-block .album-name").each(function(index) {
		  console.log(index)
		 var s = $(this).clone().children().remove().end().text().toLowerCase();
		console.log(s)
        $(this).closest('.card-block')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
    });
});


	$(document).on('click' , '#hidebtn', function () {
          $('#enterartist').val(' ');
           	$('.app-name-header').show()
	        $('.search').hide()
         
		   
		   $(".card-block").each(function() {
        if($(this).hide())
		     $(this).show();
           
		   //$('.search').slideUp();
        
    });
	
	
	  });
	  
	  	$(document).on('click' , '#clearbtn', function () {
          $('#enterartist').val(' ');
		        $(".card-block").each(function() {
        if($(this).hide())
		     $(this).show();
            $('#enterartist').focus();
		   //$('.search').slideUp();
        
    });
      
	  }); 
