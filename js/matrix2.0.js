// Matrix jQuery plugin
// v 1.0 - basic functionality
// v 2.0 - upgraded to new Architecture: https://github.com/dansdom/plugins-template-v2

(function ($) {
	// this ones for you 'uncle' Doug!
	'use strict';
	
	// Plugin namespace definition
	$.Matrix = function (options, element, callback)
	{
		// wrap the element in the jQuery object
		this.el = $(element);
		// this is the namespace for all bound event handlers in the plugin
		this.namespace = "matrix";
		// extend the settings object with the options, make a 'deep' copy of the object using an empty 'holding' object
		this.opts = $.extend(true, {}, $.Matrix.settings, options);
		this.init();
		// run the callback function if it is defined
		if (typeof callback === "function")
		{
			callback.call();
		}
	};
	
	// these are the plugin default settings that will be over-written by user settings
	$.Matrix.settings = {
		matrix : [],						
		colorPalette : [
			'rgb(242, 109, 125)',
			'rgb(255, 209, 118)',
			'rgb(228, 239, 132)',
			'rgb(189, 140, 191)',
			'rgb(139, 198, 72)',
			'rgb(139, 222, 255)',
			'rgb(124,197, 118)'
		],
		animation : "explode",  // "implode" or "explode" 
		animationSpeed : 5000,
		animationInterval : 1000,
		animationDirection : "random", // looking for "N", "NE" "E", "SE", "S", "SW", "W", "NW", "random" 
		animationEffect : false,
		blockSize : 2,
		blockId : "B",
		// have fun with these two variables, they will multiply each other so be careful !! muahahaha!!!
		decay : 1,
		decayMultiplier : 2, // set to false if not wanted. 
		// WARNING if this value is set too high it can crash the browser ;). I recommend no more than 5 unless degredation in set to under 0.2						
		decayThreshold : 40, // sanity returns !!! set the threshold of concurrent timeouts - looks like a modern browser can probably handle about 50 nicely
		decayCounter: 0 // count those concurrent timeouts - phew!
	};
	
	// plugin functions go here
	$.Matrix.prototype = {
		init : function() {
			// going to need to define this, as there are some anonymous closures in this function.
			// something interesting to consider
			var myObject = this;
			
			// this seems a bit hacky, but for now I will unbind the namespace first before binding
			this.destroy();
			
			
			this.el.html("");
			this.el.css("position","relative");
			this.el.counter = 0;
			this.el.blockCounter = 0;				
			this.el.timer;				
			this.el.width = this.opts.matrix[0].length;
			this.el.height = this.opts.matrix.length;
			this.el.css({"height" : this.el.height * this.opts.blockSize + "px", "width" : this.el.width * this.opts.blockSize + "px"});	
			
			// get the grid and store the data in the grid.positions object
			//grid.positions = $.fn.matrix.setMatrixPositions(grid, opts);
			this.setMatrixPositions();
			
			// find the next block to animate
			this.findNextBlock();
			
		},
		setMatrixPositions : function()
		{
			// for each row on the matrix, loop through each column and add blocks if the array value = 0
			//for each row
			var matrixHTML = "";	
				this.el.positions = [];
						
			for (var r = 0; r < this.el.height; r++)
			{
				this.el.positions[r] = [];
				// then loop through each column
				// need to add a function here to get some variable scope issues sorted
				// $.fn.matrix.getRowData();
				for (var c = 0; c < this.el.width; c++)
				{
								
					//  grid matrix counter
					this.el.blockCounter++;
					// the data object for the grid item. if its visible, then it holds the id, background-colour and it's position in the matrix in terms of css
					
					this.el.positions[r][c] = [];			
					
					if(this.opts.matrix[r][c] === 0)
					{
						// incriment counter
						this.el.counter++;
						// set block ID
						var blockID = this.opts.blockId + this.el.blockCounter + "";
						// set colour for block
						var colour = Math.floor(Math.random() * this.opts.colorPalette.length);
						// add block to container
						// the html element has these values:
						// id, left, top, height, width, background-color					
						matrixHTML += '<div id="' + blockID + '" style="position:absolute; left:' + (c * this.opts.blockSize) + 'px; top:' + (r * this.opts.blockSize) + 'px; width:' + this.opts.blockSize + 'px; height:' + this.opts.blockSize + 'px; background:' + this.opts.colorPalette[colour] + '"></div>';
						this.el.positions[r][c]["id"] = blockID;	
						this.el.positions[r][c]["left"] = c * this.opts.blockSize;
						this.el.positions[r][c]["top"] = r * this.opts.blockSize;
						this.el.positions[r][c]["bg"] = this.opts.colorPalette[colour];
						 
					}  // END pixel bool check
					
					// item data, html, grid
					
				} // END column loop
				
			}  // END row loop*/		
			
			//console.log(rowData);
			if (this.opts.animation == "explode")
			{		
				this.el.append(matrixHTML);
			}
			
		},
		findNextBlock : function()
		{
			
			if (this.el.counter > 0)
			{
			
				// choose a random block to animate
				var rndRow = Math.floor(Math.random() * this.el.height),
					rndCol = Math.floor(Math.random() * this.el.width);
					
				// Check to make sure there is a block, if not then iterate through the matrix to find one
				// at the end of the matrix, go back to the beginning to find one
				if(this.opts.matrix[rndRow][rndCol] == 1)
				{		
					while(this.opts.matrix[rndRow][rndCol] == 1)
					{				
						rndCol++;			
						if(rndCol == this.el.width)
						{
							rndCol=0;					
							rndRow++;
							if(rndRow == this.el.height)
							{
								rndRow = 0;
							}
						
						}/*END if*/
				
					}/*END while*/
				}
				
				this.el.counter--;
				
				this.opts.matrix[rndRow][rndCol] = 1;
				
				/*get the block id from the matrix coordinates*/
				var blockId = this.opts.blockId + (((rndRow * this.el.width) + rndCol) + 1);		
				// I will need to return this id so I can pass it to the animate function			
														
				if (this.opts.animation == "explode")
				{
					this.decayMatrix(blockId);
				}
				else if (this.opts.animation == "implode")
				{		
					this.formMatrix(blockId, rndRow, rndCol);
				}
				//return blockId;
			}
			else
			{
				//console.log("your animation has finished - woot!");
				//return false;
			}
			
		},
		decayMatrix : function(blockId)
		{
			var matrix = this,
				animationOpts = this.findAnimationPoint(),
				speed = Math.random() * this.opts.animationSpeed;
				
			//console.log(blockId);										
								
			/*animate block and reset the function once finished*/
			$("#" + blockId).css("z-index", "1").animate(animationOpts, speed, function()
			{
				matrix.opts.decayCounter++;	
				//console.log("decay matrix counter: "+matrix.opts.decayCounter);							
				$(this).remove();
				matrix.findNextBlock();	
				//console.log("threshold counter: "+opts.thresholdCounter+", threshold: "+opts.threshold);
				if (matrix.opts.decayMultiplier && matrix.opts.decayCounter < matrix.opts.decayThreshold)
				{
					for (var i = 0; i < matrix.opts.decayMultiplier; i++)
					{
						//console.log("threshold counter: "+matrix.opts.thresholdCounter);
						
						// calculate the timing of the next animation
						var quickTime = (Math.random() * matrix.opts.animationSpeed) / matrix.opts.decay;
						var timer = setTimeout(function(){matrix.findNextBlock();}, quickTime);
					}
				}									
			});
		
		},
		formMatrix : function(blockId, rndRow, rndCol)
		{
			//console.log("row: "+rndRow+", col: "+rndCol);		
			//console.log(blockId);
			var matrix = this,
				speed = Math.floor(Math.random() * this.opts.animationSpeed),
				animationOpts = {top: this.el.positions[rndRow][rndCol]["top"], left: this.el.positions[rndRow][rndCol]["left"]},
				//console.log(grid.positions[rndRow][rndCol]);				
				// first create the html element, fade it into the position, and then animate it to the end point
				//console.log("positions: "+this.el.positions);
				newBox = '<div id="' + blockId + '" style="display:none; height:' + this.opts.blockSize + 'px; width:' + this.opts.blockSize + 'px; position:absolute; background-color:' + this.el.positions[rndRow][rndCol]["bg"] + '"></div>',
				//console.log(grid.positions);
				startPos = this.findAnimationPoint();
				
			//console.log(startPos);
			this.el.append(newBox);		
			$("#" + blockId).css({
				"top"		: startPos["top"],
				"left"		: startPos["left"],
				"display"	: "block"}).fadeIn("2000");
			//console.log(blockId);
			//console.log(speed);
			$("#" + blockId).animate(animationOpts, speed, function()
			{
				//console.log("something");
				matrix.findNextBlock();
				//console.log("threshold counter: "+opts.thresholdCounter+", threshold: "+opts.threshold);
				
				if (matrix.opts.decayMultiplier && matrix.opts.decayCounter < matrix.opts.decayThreshold)
				{
					for (var i = 0; i < matrix.opts.decayMultiplier; i++)
					{
						//console.log("threshold counter: "+opts.thresholdCounter);
						matrix.opts.decayCounter++;
						//console.log("form matrix counter: "+opts.decayCounter);
						// calculate the timing of the next animation
						var quickTime = (Math.random() * matrix.opts.animationSpeed) / matrix.opts.decay;
						var timer = setTimeout(function(){matrix.findNextBlock();}, quickTime);
					}
				}
				
			});
			//console.log("end animation");
			//console.log(startPos);
		},
		// define radom positions for the block to either animate to or animate from
		findAnimationPoint : function()
		{		
			var pageHeight = $(document).height(),
				pageWidth = $(document).width(),			
				north = Math.floor(-pageHeight + (-Math.random() * pageHeight)) + "px",
				east = Math.floor(pageWidth + (Math.random() * pageWidth)) + "px",
				south = Math.floor(pageHeight + (Math.random() * pageHeight)) + "px",
				west = Math.floor(-pageWidth + (-Math.random() * pageWidth)) + "px",
				vertical = Math.floor(this.getRandomBoolean() * pageHeight) + (this.getRandomBoolean() * Math.random() * pageHeight) + "px",
				sideway =  Math.floor(this.getRandomBoolean() * pageWidth) + (this.getRandomBoolean() * Math.random() * pageWidth) + "px",
				blockPosition = {};
				
				// set the end position for the animation
				switch (this.opts.animationDirection)
				{
					case "N"	:
						return blockPosition = {top : north};
						break;
					case "NE"	:										
						return blockPosition = {top : north, left: east};						
						break;
					case "E"	:
						return blockPosition = {left : east};
						break;
					case "SE"	:					
						return blockPosition = {top : south, left: east};	
						break;
					case "S"	:
						return blockPosition = {top : south};
						break;
					case "SW"	:					
						return blockPosition = {top: south, left: west};	
						break;
					case "W"	:
						return blockPosition = {left: east};
						break;
					case "NW"	:					
						return blockPosition = {top: north, left: west};
						break;
					case "random"	:					
						return blockPosition = {top: vertical, left: sideway};
						break;
					default:
						return blockPosition = {top: 0, left: 0};
						break;					
				};
		},
		getRandomBoolean : function()
		{
			var booleanSwitch = Math.round(Math.random()),
				i;
			if (booleanSwitch)
			{
				i = 1;
			}
			else
			{
				i = -1;
			}
			return i;
		},
		option : function(args) {
			this.opts = $.extend(true, {}, this.opts, args);
		},
		destroy : function() {
			this.el.unbind("." + this.namespace);
		}
	};
	
	// the plugin bridging layer to allow users to call methods and add data after the plguin has been initialised
	// props to https://github.com/jsor/jcarousel/blob/master/src/jquery.jcarousel.js for the base of the code & http://isotope.metafizzy.co/ for a good implementation
	$.fn.matrix = function(options, callback) {
		// define the plugin name here so I don't have to change it anywhere else. This name refers to the jQuery data object that will store the plugin data
		var pluginName = "matrix",
			args;
		
		// if the argument is a string representing a plugin method then test which one it is
		if ( typeof options === 'string' ) {
			// define the arguments that the plugin function call may make 
			args = Array.prototype.slice.call( arguments, 1 );
			// iterate over each object that the function is being called upon
			this.each(function() {
				// test the data object that the DOM element that the plugin has for the DOM element
				var pluginInstance = $.data(this, pluginName);
				
				// if there is no data for this instance of the plugin, then the plugin needs to be initialised first, so just call an error
				if (!pluginInstance) {
					alert("The plugin has not been initialised yet when you tried to call this method: " + options);
					return;
				}
				// if there is no method defined for the option being called, or it's a private function (but I may not use this) then return an error.
				if (!$.isFunction(pluginInstance[options]) || options.charAt(0) === "_") {
					alert("the plugin contains no such method: " + options);
					return;
				}
				// apply the method that has been called
				else {
					pluginInstance[options].apply(pluginInstance, args);
				}
			});
			
		}
		// initialise the function using the arguments as the plugin options
		else {
			// initialise each instance of the plugin
			this.each(function() {
				// define the data object that is going to be attached to the DOM element that the plugin is being called on
				var pluginInstance = $.data(this, pluginName);
				// if the plugin instance already exists then apply the options to it. I don't think I need to init again, but may have to on some plugins
				if (pluginInstance) {
					pluginInstance.option(options);
					// initialising the plugin here may be dangerous and stack multiple event handlers. if required then the plugin instance may have to be 'destroyed' first
					//pluginInstance.init(callback);
				}
				// initialise a new instance of the plugin
				else {
					$.data(this, pluginName, new $.Matrix(options, this, callback));
				}
			});
		}
		
		// return the jQuery object from here so that the plugin functions don't have to
		return this;
	};

	// end of module
})(jQuery);
