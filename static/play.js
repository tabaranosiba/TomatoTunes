var playlist;
var song;

var display_selected_playlist = function(playlists, playlist_id){
	for(var i=0; i < playlists.length; i++) {
		console.log(playlists[i])
        if(playlists[i]['id'] == playlist_id){
        	playlist = playlists[i]
        	console.log("This is the playlist: " + playlist)
        	//for every song in the playlist['songs'] do the following:
        	console.log(playlist['songs'])
        	$.each(playlist['songs'], function(index, value){
	        	var title = value['title']
	        	var artist = value['artist']
	        	var audio = value['song']
	        	if (index == 0){
	        		var row = $("<li class='current-song'>")
	        	}
	        	else{
	        		var row = $("<li>")
	        	}
	        	var song = $("<a href='"+ audio +"'>"+title+"</a>")
	        	console.log(song)
			    $(row).append(song)
			    $('#playlist').append(row)
			    $('#playlist').append('</li>')
			})
        }
    }
}

function audioPlayer(){
    var currentSong = 0;
    $("#audioPlayer")[0].src = $("#playlist li a")[0];
    $("#audioPlayer")[0].play();
    
    $("#playlist li a").click(function(e){
        e.preventDefault(); 
        $("#audioPlayer")[0].src = this;
        $("#audioPlayer")[0].play();
        $("#playlist li").removeClass("current-song");
        currentSong = $(this).parent().index();
        $(this).parent().addClass("current-song");
    });
            
    $("#audioPlayer")[0].addEventListener("ended", function(){
        currentSong++;
        if(currentSong == $("#playlist li a").length)
        	$("#audioPlayer")[0].pause();
        $("#playlist li").removeClass("current-song");
        $("#playlist li:eq("+currentSong+")").addClass("current-song");
        $("#audioPlayer")[0].src = $("#playlist li a")[currentSong].href;
        $("#audioPlayer")[0].play();
    });
    currentSong = 0
}

$(document).ready(function(){ 
	console.log(playlist_id)
	playlist = display_selected_playlist(playlists, playlist_id)
	console.log("This is the returned playlist that will be played: " + playlist)
	$('#toggle').click(function(){
		audioPlayer();
	})
})