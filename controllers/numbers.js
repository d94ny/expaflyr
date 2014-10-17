// Make Numbers more beautiful

// Make a leading zero
exports.toDate = function(num) {

	var n = num.toString();
	return (n.length == 2) ? n : "0" + n;

}

// Put spaces every 3
exports.toSpace = function(num) {

	// determine the number of spaces
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

}