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
	        	var id = value['id']

	        	var row = $("<div class = 'result' id='" + id + "'>")
	        	var song = $("<div class='song'>")
			    var title_info = $("<p class='title'>"+ title + "</p>")
			    var artist_info = $("<p class='artist'>"+ artist + "</p>")
			    $(song).append(id, title_info, artist_info)
			    $(song).append("</div>")
			    $(row).append(song)
			    $('#playlist').append(row)
			    $('#playlist').append('</div>')
			})
        }
    }
}

$(document).ready(function(){ 
	console.log(playlist_id)
	display_selected_playlist(playlists, playlist_id)
})