/**
 * @author	Håvard Kindem
 * @version	1.0.0
 */
var AsciiRenderer = function() {
	var defs = {};

	////////////////////////////////
	///	PRIVATE
	////////////////////////////////

	var alphabet = LetterIntensity.getLetterBlackness();


	var sampleWidth;
	var sampleHeight;
	var xSamples;
	var ySamples;

	var canvasObj;
	var canvas;
	var context;


	/**
	 * Resolves the brightness of a character
	 * Please note that the brightness gets inverted as the letters are defined by blackness
	 * @param	{Number}	brightness 	The brightness to resolve
	 * @return 							The resolved letter
	 */
	var resolveBrightness = function(brightness) {
		var blackness = 1 - brightness;
		for(var i = 0; i < alphabet.length; i++) {
			if(blackness < alphabet[i].blackness) {
				return alphabet[i].letter;
			}
		}

		return alphabet[alphabet.length - 1].letter;
	};

	/**
	 * Samples the brightness of an image sample. Treats transparent pixels as blank.
	 * @param	{Array}	imageData 	The image data to sample
	 * @return	{Number}			The brightness of the sample
	 */
	var getSampleBrightness = function(imageData) {
		var pixelCount = imageData.width * imageData.height;
		var brightness = 0;

		for(var i = 0; i < imageData.data.length; i+=4) {
			if(imageData.data[i+3] != 255) {
				brightness += 1;
			} else {
				var r = imageData.data[i] / 255;
				var g = imageData.data[i+1] / 255;
				var b = imageData.data[i+2] / 255;
				brightness += (r + g + b) / 3;
			}
		}

		return brightness / pixelCount;
	};

	/**
	 * Renders the image 
	 * NOTE: This will block the UI during the render
	 * @param 	{Object}	container	The container to render to
	 * @param	{Function}	updateFunc 	The function to be called on progress update
	 */
	var renderBlocking = function(container, updateFunc) {
		for(var y = 0; y < ySamples; y++) {
			if(updateFunc) {
				updateFunc(Math.floor((y / ySamples) * 100));
			}
		
			for(var x = 0; x < xSamples; x++) {
				var sampleData = context.getImageData(x * sampleWidth, y * sampleHeight, sampleWidth, sampleHeight);
				var sampleIntensity = getSampleBrightness(sampleData);
				container.append(resolveBrightness(sampleIntensity));
			}
			container.append('<br />');
		}

		if(updateFunc) {
			updateFunc(100);
		}
	};

	/**
	 * Renders the image, not blocking the UI
	 * @param	{Number} 	line 		The line currently rendering
	 * @param	{Object} 	container 	The container to render to
	 * @param	{Function}	updateFunc 	The function to be called on progress update
	 */
	var renderNonBlocking = function(line, container, updateFunc) {
		for(var x = 0; x < xSamples; x++) {
			var sampleData = context.getImageData(x * sampleWidth, line * sampleHeight, sampleWidth, sampleHeight);
			var sampleIntensity = getSampleBrightness(sampleData);
			container.append(resolveBrightness(sampleIntensity));
		}

		container.append('<br />');
		updateFunc(Math.floor((line / ySamples) * 100));

		if(line < ySamples) {
			setTimeout(function() {
				renderNonBlocking(++line, container, updateFunc);
			}, 1);
		} else {
			updateFunc(100);
		}
	};

	////////////////////////////////
	///	PUBLIC
	////////////////////////////////

	/**
	 * Renders an image as Ascii art
	 * @param	{Object}	container	The container to render to. <pre> recommended
	 * @param	{Image}		image 		The image to render
	 * @param	{Number}	scale		The image scale (as 1:1 tends to get large)
	 */
	defs.render = function(container, image, scale, updateFunc) {
		if(container.prop('tagName') != "PRE") {
			console.warn("Render container should be of type <pre>");
		}
		container.css('font-family', 'monospace');

		sampleWidth = image.width / (image.width * scale);
		sampleHeight = (image.height / (image.height * scale)) * 2.1;
		xSamples = image.width / sampleWidth;
		ySamples = image.height / sampleHeight;

		canvasObj = $('<canvas/>')
			.attr('width', image.width)
			.attr('height', image.height);
		canvas = canvasObj[0];
		context = canvas.getContext("2d");
		context.rect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, 0, 0);

		renderNonBlocking(0, container, updateFunc);
		//renderBlocking(container, updateFunc);
	};

	return defs;

} (AsciiRenderer || {});