from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

song_database = [
    {
        "id": 1,
        "title": "Broom sounds",
        "artist": "Abdulaziz",
        "song": "/static/audio_files/sweeping_straw_broom-mike-koenig.mp3",
        "genre": "instrumental",
        "length": 473
    },
    {
        "id": 2,
        "title": "Unless",
        "artist": "Hawktail",
        "song": "/static/audio_files/MP5_SMG-GunGuru-703432894.mp3",
        "genre": "instrumental",
        "length": 325
    },
    {
        "id": 3,
        "title": "0952",
        "artist": "Hawktail",
        "song": "/static/audio_files/Olafur_Arnalds-0952.mp3",
        "genre": "instrumental",
        "length": 203
    }
]

playlists = []
selected_results = []
current_id = len(playlists)
playlist_id = 0
# playlist_length = 0

@app.route('/')
def home():
    return render_template("home.html", song_database=song_database, playlists=playlists, selected_results=selected_results, current_id=current_id, playlist_id=playlist_id)

@app.route('/make_tomato')
def make_tomato():
    return render_template("make.html", song_database=song_database, playlists=playlists, selected_results=selected_results, current_id=current_id, playlist_id=playlist_id)

@app.route('/show_tomatoes')
def show_tomatoes():
    return render_template("playlists.html", song_database=song_database, playlists=playlists,selected_results=selected_results, current_id=current_id, playlist_id=playlist_id)

@app.route('/play/<playlist_id>', methods=['GET'])
def play(playlist_id):
    global playlists
    playlist_id = playlist_id
    return render_template('play.html', playlist_id = playlist_id, playlists = playlists, song_database=song_database, selected_results=selected_results, current_id=current_id) 

@app.route('/search', methods=['GET', 'POST'])
def search():

    global song_database
    
    search = []

    if request.method == 'POST':

        input_string = request.data.decode("utf-8")
        # print(input_string)
        if input_string == '1':
            for object in song_database:
                for key, value in object.items():
                    if key == 'genre' and value == 'instrumental':
                        search.append(object)
        if input_string == '2':
            for object in song_database:
                for key, value in object.items():
                    if key == 'genre' and value == 'lo-fi':
                        search.append(object)
        if input_string == '3':
            for object in song_database:
                for key, value in object.items():
                    if key == 'genre' and value == 'jazz':
                        search.append(object)                             
        return jsonify(search = search)
    else:
        return render_template('make.html', song_database = song_database) 
    
@app.route('/search_selected', methods=['GET', 'POST'])
def search_selected():

    global song_database
    global selected_results

    if request.method == 'POST':

        input_string = request.data.decode("utf-8")
        # print(input_string)
        # print(type(input_string))
        input_int = int(input_string)
        # print(input_int)
        # print(type(input_int))

        for object in song_database:
            for key, value in object.items():
                if key == "id" and input_int == value:
                    selected_results.append(object)
                else:
                    continue
        # print(selected_results)
        return jsonify(selected_results = selected_results)
    else:
        return render_template('make.html', song_database = song_database)

@app.route('/save', methods=['GET', 'POST'])
def save():

    global playlists
    global selected_results
    global current_id

    input_name = request.data.decode("utf-8")
    print(input_name)

    if request.method == 'POST':
        current_id += 1
        print("These are the selected songs from the previous state: ")
        print(selected_results)
        
        new_entry = {
            'id': current_id,
            'name': input_name,
            'songs': selected_results
        }
        print("This is the new entry: ")
        print(new_entry)
        playlists.append(new_entry)
        # print(playlists)
        print("These are the playlists: ")
        print(playlists)
        return jsonify(playlists = playlists)
    else:
        return render_template('playlists.html', song_database = song_database, playlists=playlists, current_id=current_id)

@app.route('/remove_selected', methods=['GET', 'POST'])
def remove_selected():

    global selected_results

    if request.method == 'POST':

        input_string = request.data.decode("utf-8")
        input_id = int(input_string)

        for object in selected_results:
            for key, value in object.items():
                if key == id and value == input_id:
                    selected_results.pop(object)

        return jsonify(selected_results = selected_results)


if __name__ == '__main__':
   app.run(debug = True)