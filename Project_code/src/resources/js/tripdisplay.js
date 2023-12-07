let EVENT_MODAL;
function toggle_visibility(id,trip_id,name,driver_id,destination,original_location,time){
    EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));
    displayID = id;
    document.getElementById("TripName").innerHTML = name;
    document.getElementById("TripDriver").innerHTML = driver_id;
    document.getElementById("LocationTo").innerHTML = destination;
    document.getElementById("LocationFrom").innerHTML = original_location;
    document.getElementById("DepartTime").innerHTML = time;
    getPassengers(trip_id).then(attendents => {
        if(attendents == ""){
            document.getElementById("Attendees").innerHTML = "No friends yet. Some will join soon!";
        }else{
            document.getElementById("Attendees").innerHTML = attendents;
        }
    });
    let mapDiv = document.getElementById("mapDiv")
    let mapElement = document.getElementById("map")
    if (mapElement === null){
        let map = document.createElement('iframe')
        map.id = "map";
        map.setAttribute('width',600);
        map.setAttribute('height',450);
        map.setAttribute('style','border:0');
        map.setAttribute('loading','lazy');
        map.setAttribute('src',`https://www.google.com/maps/embed/v1/directions?origin=${original_location}&destination=${destination}&key=AIzaSyDuLumpTfaYuJcGgeprW9_cL9xRL7Ghz20`);
        mapDiv.appendChild(map);
    } else if (map != null){
        mapElement.setAttribute('src',`https://www.google.com/maps/embed/v1/directions?origin=${original_location}&destination=${destination}&key=AIzaSyDuLumpTfaYuJcGgeprW9_cL9xRL7Ghz20`);
    }
    EVENT_MODAL.show();
}

async function getPassengers(trip_id){
    let response;
    let people = "";
    let status; 
    response = await fetch(`/trip/${trip_id}/passengers`)
    .then((res) => { 
        status = res.status; 
        return res.json() 
    })
    .then((jsonResponse) => {
        return jsonResponse;
    })
    .catch((err) => {
        // handle error
        console.error(err);
    });
    for (let i = 0; i < response.data.length; i++) {
        people += response.data[i].passenger+",";
    }
    console.log(people)
    return people;
}

function closeModal(){
    EVENT_MODAL.hide();
}