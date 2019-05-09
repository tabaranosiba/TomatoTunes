var display_playlists = function(playlists){
    $.each(playlists, function(index, value){
        var title = value['name']
        var id = value['id']
        var playlist_box = $("<a href='play/" + id + "'><div class = 'row playlist'>")
        var playlist_info = $('<h6>'+ title + '</h6></div><a>')

        $(playlist_box).append(playlist_info)
        $('#tomatoes').append(playlist_box)
    })
}

$(document).ready(function(){ 
    display_playlists(playlists)
})