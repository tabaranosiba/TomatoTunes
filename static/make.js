var time_left = 0;
var playlist_length = 0; 
var max_seconds = 1500;
var min_seconds = 1200;

var search = function(input){
    var input_to_search = input
    $.ajax({
        type: "POST",
        url: "search",                
        dataType : "json",
        contentType: "text; charset=utf-8",
        data : input_to_search.toString(),
        success: function(result){
            var search = result["search"]
            console.log("Results from search algorithm:" + search)
            display_results(search)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var display_results = function(matches){
    clear_results()
    $.each(matches, function(index, value){
        var title = value['title']
        var id = value['id']
        var artist = value['artist']
        var audio = value['song']
        
        var row = $("<div class = 'result' id='" + id + "'>")
        var song = $("<div class='song'>")
        var title_info = $("<p class='title'>"+ title + "</p>")
        var artist_info = $("<p class='artist'>"+ artist + "</p>")
        var audio_info = $("<audio controls><source src='" + audio + "' type='audio/ogg' </audio>")
        $(song).append(title_info, artist_info, audio_info)
        $(song).append("</div>")
        $(row).append(song)
        $('#results').append(row)
        $('#results').append('</div>')
        
        $('.result').draggable({
            mouse: "move",
            stack: ".result",
            revert: "invalid",
            helper: "clone"
        });
    })
}

var clear_results = function(){
    $('#results').empty()
}

var search_for_playlist = function(input){
    var input_to_search = input
    $.ajax({
        type: "POST",
        url: "search_selected",                
        dataType : "json",
        contentType: "text; charset=utf-8",
        data : input_to_search.toString(),
        success: function(result){
            var search = result["selected_results"]
            console.log("Current selected playlist: " + search)
            display_playlist(search)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var display_playlist = function(selected){
    $.each(selected, function(index, value){
        var title = value['title']
        var artist = value['artist']
        var audio = value['song']
        var id = value['id']
        
        var row = $("<div class = 'result' id=>")
        var song = $("<div class='song'>")
        var title_info = $("<p class='title'>"+ title + "</p>")
        var artist_info = $("<p class='artist'>"+ artist + "</p>")
        var audio_info = $("<audio controls><source src='" + audio + "' type='audio/ogg' </audio>")
        var delete_button = $("<button type='button' class='delete' id='" + id +"'>Remove</button>")
        $(song).append(title_info, artist_info, audio_info, delete_button)
        $(song).append("</div>")
        $(row).append(song)
        $('#songs').append(row)
        $('#songs').append('</div>')
        
        $('.result').draggable({
            mouse: "move",
            stack: ".result",
            revert: "invalid"
        });
    })
}

var clear_selected = function(){
    $('#songs').empty()
}

var save_playlist = function(playlist_name){
    var name = playlist_name
    $.ajax({
        type: "POST",
        url: "save",                
        dataType : "json",
        contentType: "text; charset=utf-8",
        data: playlist_name.toString(),
        success: function(result){
            console.log("Successfully saved new playlist")
            var new_playlists = result['playlists']
            console.log(new_playlists)
            window.location.href = "show_tomatoes"
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var remove_selected = function(id){
    var identifier = id
    $.ajax({
        type: "POST",
        url: "remove_selected",                
        dataType : "json",
        contentType: "text; charset=utf-8",
        data: identifier.toString(),
        success: function(result){
            var results = result['selected_results']
            display_playlist(results)
            console.log("Successfully deleted")
            console.log(results)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

var display_time_left = function(length_of_playlist){
    var length_of_playlist = length_of_playlist
    time_left = max_seconds - length_of_playlist
    console.log(time_left)
    $('.length_tracker').empty()
    $('.length_tracker').append('<p>Time left to add: ' + Math.floor(time_left/60) + ":" + (time_left % 60 ? time_left % 60 : '00') + '</p>')
    clear_selected()
}

var calculate_time = function(id) {
    var identifier = id
    $.each(song_database, function(key, value){
        if(value['id'] == identifier){
            var song_length = value['length']
            playlist_length += song_length
            display_time_left(playlist_length)
            search_for_playlist(identifier)
        }
    })
    // $.ajax({
    //     type: "POST",
    //     url: "calculate_time",                
    //     dataType : "json",
    //     contentType: "text; charset=utf-8",
    //     data: identifier.toString(),
    //     success: function(result){
    //         var length_of_playlist = result['playlist_length']
    //         console.log("Successfully updated time")
    //         console.log(length_of_playlist)
    //         display_time_left(length_of_playlist, identifier)  
    //     },
    //     error: function(request, status, error){
    //         console.log("Error");
    //         console.log(request)
    //         console.log(status)
    //         console.log(error)
    //     }
    // });
}


$(document).ready(function(){
    $('#submit').click(function(){
        var query = $('#inlineFormCustomSelect').val()
        console.log("Query: " + query)
        if(query=="Choose..."){
            alert("You must select a valid genre from the dropdown menu. Please try again.")
        }
        else{
            search(query)
        }
    })
    $('.tomato').droppable({
        accept: ".result",
        hoverClass: "hover_drop",
        drop: function(event, ui){
            $('#songs').empty()
            var dropped_song = ui.draggable.attr("id")
            dropped_song = Number(dropped_song)
            console.log("Dropped song id: " + dropped_song)
            calculate_time(dropped_song)
            if((playlist_length <= max_seconds) && (playlist_length >= min_seconds)){
                $('#done').prop('disabled', false)
            }
            else{
                $('#done').prop('disabled', true)
            }
        }
    })
    $('#done').click(function(){
        var playlist_name = $('#playlist_name').val()
        console.log(playlist_name)
        save_playlist(playlist_name)
    })

})