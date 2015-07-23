/**
 * @author	Håvard Kindem
 * @version	1.0.0
 */
var LetterIntensity = function() {
	var defs = {};

	////////////////////////////////
	///	PRIVATE
	////////////////////////////////
	var letters = " abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-;:_*'^~!@#$%+&";

	/**
	 * Rnders a letter to a Canvas
	 * @param	{Character}	letter 	The letter to render
	 * @return	{Object} 			A Canvas object with a the rendered character
	 */
	var drawLetter = function(letter) {
		var canvasObj = $('<canvas/>')
			.attr('width', 100)
			.attr('height', 100)
			.css('background-color', '#ccc');

		canvas = canvasObj[0];
		context = canvas.getContext("2d");
		context.rect(0, 0, canvas.width, canvas.height);

		context.font = "100px monospace";
		context.textAlign = "center";
		context.fillText(letter, 50, 75);

		return canvasObj;
	};

	/**
	 * Resolves the blackness of a letter
	 * @param	{Character}	letter 	The character to resolve blackness for
	 * @return	{Number}			The darkness of the character in regards to it's area
	 */
	var getBlackness = function(letter) {
		var canvasObj = $('<canvas/>')
			.attr('width', 100)
			.attr('height', 100)
			.css('background-color', '#ccc');

		canvas = canvasObj[0];
		context = canvas.getContext("2d");
		context.rect(0, 0, canvas.width, canvas.height);

		context.font = "100px monospace";
		context.textAlign = "center";
		context.fillText(letter, 50, 75);

		var imgData = context.getImageData(0, 0, 100, 100);
		var blackness = 0;
		for (var i = 0; i < imgData.data.length; i += 4)
		{
			if(imgData.data[i+3]) {	// If the pixel has contents the alpha channel should be greater than 0
				blackness++;
			}
		}

		return blackness / 10000;
	};

	/**
	 * Orders an array of our objects using insert sort
	 * @param	{Array}	unorderedData	The unordered array of objects to sort
	 * @return	{Array} 				An ordered array of objects
	 */
	var orderData = function(unorderedData) {
		var orderedData = new Array();
		for(var i = 0; i < letters.length; i++) {
			var minItem = {blackness: 10.0};

			for(var j = 0; j < unorderedData.length; j++) {
				if(unorderedData[j].blackness < minItem.blackness) {
					minItem = unorderedData[j];
				}
			}

			orderedData.push(minItem);
			unorderedData.splice(unorderedData.indexOf(minItem), 1);
		}

		return orderedData;
	};

	/**
	 * Scales the data so that is goes from <0, 1]
	 * @param	{Array}	orderedData	The ordered array to scale
	 */
	var scaleData = function(orderedData) {
		var scalar = 1 / orderedData[orderedData.length - 1].blackness;
		for(var i = 0; i < orderedData.length; i++) {
			orderedData[i].blackness *= scalar;
		}
		// Adjust the first value so that it is not null
		orderedData[0].blackness = orderedData[1].blackness / 2;
	};


	////////////////////////////////
	///	PUBLIC
	////////////////////////////////

	/**
	 * Parses the defined alphabet and returns the letter and its blackness
	 * @return 	{Array}	An array of objects 
	 */
	defs.getLetterBlackness = function() {
		var tempData = new Array();
		for(var i = 0; i < letters.length; i++) {
			tempData.push(
				{
					letter: letters[i], 
					blackness: getBlackness(letters[i])
				});
		}

		var orderedData = orderData(tempData);
		scaleData(orderedData);

		return orderedData;
	};

	/**
	 * Renders all the letters defined in the alphabet
	 * @param	{Object}	container	The object to render to
	 */
	defs.drawLetters = function(container) {
		var tempData = new Array();
		for(var i = 0; i < letters.length; i++) {
			drawLetter(letters[i]).appendTo(container);
		}
	};

	return defs;

} (LetterIntensity || {});