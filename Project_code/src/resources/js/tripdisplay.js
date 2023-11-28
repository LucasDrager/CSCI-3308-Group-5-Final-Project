function toggle_visibility(id,trip_id,driver_id,destination,original_location){
    let EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));
    displayID = id;
    document.getElementById("TripName").innerHTML = trip_id;
    document.getElementById("TripDriver").innerHTML = driver_id;
    document.getElementById("LocationTo").innerHTML = destination;
    document.getElementById("LocationFrom").innerHTML = original_location;
    document.getElementById("Attendees").innerHTML = getPassengers(trip_id);
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
    return await fetch(`/getPassengers/${trip_id}`, {method: "GET"})
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let passengers = data;
        console.log(passengers);
        length = passengers.length;
        var temp="";
        for(i=0;i<length-1;i++)
        {
            temp += passengers[i] + ", ";
        }
        temp += passengers[length];
        return temp;
    })
    .catch((err) => {
    console.log(err);
    });
}