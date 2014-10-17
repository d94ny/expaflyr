
function handleFriend(friend){

	if(!friend) return;

	// Already tell him everything is O
	$("#header_transparent").val("Loading ...");

	// Make a timer here to come back to normal

	$.ajax({
		type: "POST",
		url: "/friends",
		data: { friend: friend }
	}).done(function(success) {

		// success is json to tell wether we added or removed him
		var data = JSON.parse(success);

		if(!data.err) {
			$(".main_header").css({"background-color":"#6fba01"});
			$("#header_transparent").val(data.message);
			$("span.line_text").html("Made a mistake ?");
			$("a.button").html(data.button);
		} else {
			$(".main_header").css({"background-color":"#ae0010"});
			$("#header_transparent").val(data.message);
		}

	});

}

function handleFollow(assos){

	if(!assos) return;

	// Already tell him everything is O
	$("#header_transparent").val("Loading ...");

	// Make a timer here to come back to normal

	$.ajax({
		type: "POST",
		url: "/follow",
		data: { assos: assos }
	}).done(function(success) {

		// success is json to tell wether we added or removed him
		var data = JSON.parse(success);

		if(!data.err) {
			$(".main_header").css({"background-color":"#6fba01"});
			$("#header_transparent").val(data.message);
			$("span.line_text").html("Made a mistake ?");
			$("a.button").html(data.button);
		} else {
			$(".main_header").css({"background-color":"#ae0010"});
			$("#header_transparent").val(data.message);
		}

	});

}

function handleEvent(event){

	if(!event) return;

	// Already tell him everything is O
	$("#header_transparent").val("Loading ...");

	// Make a timer here to come back to normal

	$.ajax({
		type: "POST",
		url: "/attend",
		data: { eventid: event }
	}).done(function(success) {

		// success is json to tell wether we added or removed him
		var data = JSON.parse(success);

		if(!data.err) {
			$(".main_header").css({"background-color":"#6fba01"});
			$("#header_transparent").val(data.message);
			$("span.line_text").html("Made a mistake ?");
			$("a.button").html(data.button);
		} else {
			$(".main_header").css({"background-color":"#ae0010"});
			$("#header_transparent").val(data.message);
		}

	});

}