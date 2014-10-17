/* ======================
 SEARCH BAR JS
========================= */

function search(keyword,event){

	//console.log(event.keyCode);

	// If the user presses 'ENTER' to
	// query his search term :
	if(event.keyCode=='13'){

		// the user pressed enter, navigate to currently selected page
		var href = $("#search_select").val()
		window.location = "/"+href;

	}

	if(keyword!="" && keyword.length>2) {

		$.ajax({
			type: "POST",
			url: "/search",
			data: { keyword: keyword}
		}).done(function( response ) {

			var r = JSON.parse(response);

			// We hide the menu if it is visible
			if($("#menu").is(':visible')) $("#menu").slideUp(200);

			// Make sure the menu is there
			if(!$("#search").is(':visible')) $("#search").slideDown(200);

			// Quit if error occured
			if(r.err || !r.message || r.message.length<1) {
				$("#search_results").html("<a href=\"/new\" class=\"dropdown_option color_lightblue\">No results</a>");
				return;
			}

			var dropdown = "";
			var name = "unknown";
			var href = "/";
			var results = r.message;
			var color = ["lightblue","red","yellow","purple","lightgreen","darkblue","orange","green","darkpurple","pink"];

			for(var i=0; i < results.length && i < 10 ; i++) {
				console.log(results[i]);
				// Distinguish cases
				if(results[i].username) {
					// Result is a user
					name = results[i].username + " ("+results[i].kudos+")";
					href = "u/"+results[i].username;
				} else {
					// It's an event
					name = results[i].name + " ("+results[i].location+")";
					href = results[i]._id;
				}

				// get a color for the dropdown thing
				dropdown += "<a href=\"/"+href+"\" class=\"dropdown_option color_"+color[i]+"\">"+ name +"</a>" 
			}

			$("#search_results").html(dropdown);
			return;

		});
	}

}


function toggleMenu() {
	if($("#menu").is(':visible')) { 
		$("#menu").slideUp(200);
		$("#header_transparent").val("Hello again");
	} else { 
		$("#menu").slideDown(200);
		$("#header_transparent").val("Type to search for events, assosiations and friends");
	}
}


$(document).ready(function(){

	// Add menu handler
	$("#header_transparent").click(function(){toggleMenu()});
	$("#close").click(function(){toggleMenu()});
	$("#header_transparent").keyup(function(){search($("#header_transparent").val(),event)})
	$("#close_search").click(function(){$("#search").slideUp(200);});

});

