function toggle_visibility(id,trip_id,driver_id,destination,original_location){
    let EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));
    displayID = id;
    document.getElementById("TripName").innerHTML = trip_id;
    document.getElementById("TripDriver").innerHTML = driver_id;
    document.getElementById("LocationTo").innerHTML = destination;
    document.getElementById("LocationFrom").innerHTML = original_location;
    EVENT_MODAL.show();
}

// function initializeContent(){
//     buttons = document.querySelectorAll("#tripButton")
//     buttons.array.forEach(element => {
//         var newButton = document.createElement('button');
//         newButton.onclick = toggle_visibility('<%=i%>','<%-Data[i].trip_id%>','<%-Data[i].driverid%>','<%-Data[i].destination%>','<%-Data[i].original_location%>');
//         //<button type="button" class="btn btn-primary" onclick="toggle_visibility('<%=i%>','<%-Data[i].trip_id%>','<%-Data[i].driverid%>','<%-Data[i].destination%>','<%-Data[i].original_location%>');">Click me!</button>
//     });
// }