// Matrix jQuery plugin

// TO DO:
//

(function($){

	$.fn.matrix = function(config)
	{
		// config - default settings
		var settings = {
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

		// if settings have been defined then overwrite the default ones
		// comments:			true value makes the merge recursive. that is - 'deep' copy
		//				{} creates an empty object so that the second object doesn't overwrite the first object
		//				this emtpy takes object1, extends2 onto object1 and writes both to the empty object
		//				the new empty object is now stored in the var opts.
		var opts = $.extend(true, {}, settings, config);
		
		// iterate over each object that calls the plugin and do stuff
		this.each(function(){
			// do pluging stuff here
			// each box calling the plugin now has the variable name: myBox
			var grid = $(this);
				grid.html("");
				grid.css("position","relative");
				grid.counter = 0;
				grid.blockCounter = 0;				
				grid.timer;				
				grid.width = opts.matrix[0].length;
				grid.height = opts.matrix.length;
				grid.css({"height":grid.height*opts.blockSize+"px","width":grid.width*opts.blockSize+"px"});				

			// get the grid and store the data in the grid.positions object
			//grid.positions = $.fn.matrix.setMatrixPositions(grid, opts);
			$.fn.matrix.setMatrixPositions(grid, opts);
			//console.log(grid.positions);
			
			// find the next block to animate
			$.fn.matrix.findNextBlock(grid, opts);

			// end of plugin stuff
		});

		// return jQuery object
		return this;
	};

	// plugin functions go here - example of two different ways to call a function, and also two ways of using the namespace
	// note: $.fn.testPlugin.styleBox allows for this function to be extended beyond the scope of the plugin and used elsewhere, 
	// that is why it is a superior namespace. Also: anonymous function calling I think is probably better naming practise too.
	
	$.fn.matrix.setMatrixPositions = function(grid, opts)
	{
		// for each row on the matrix, loop through each column and add blocks if the array value = 0
		//for each row
		var matrixHTML = "";	
			grid.positions = [];		
			//rowData = [];
			//itemData = [];
					
		for (var r = 0; r < grid.height; r++)
		{
			grid.positions[r] = [];
			// then loop through each column
			// need to add a function here to get some variable scope issues sorted
			// $.fn.matrix.getRowData();
			for(var c = 0; c < grid.width; c++)
			{
				
							
				//  grid matrix counter
				grid.blockCounter++;
				// the data object for the grid item. if its visible, then it holds the id, background-colour and it's position in the matrix in terms of css
				
				grid.positions[r][c] = [];			
				
				if(opts.matrix[r][c] === 0)
				{
					// incriment counter
					grid.counter++;
					// set block ID
					var blockID = opts.blockId + grid.blockCounter + "";
					// set colour for block
					var colour = Math.floor(Math.random()*opts.colorPalette.length);
					// add block to container
					// the html element has these values:
					// id, left, top, height, width, background-color					
					matrixHTML += '<div id="'+blockID+'" style="position:absolute; left:'+(c*opts.blockSize)+'px; top:'+(r*opts.blockSize)+'px; width:'+opts.blockSize+'px; height:'+opts.blockSize+'px; background:'+opts.colorPalette[colour]+'"></div>';
					grid.positions[r][c]["id"] = blockID;	
					grid.positions[r][c]["left"] = c*opts.blockSize;
					grid.positions[r][c]["top"] = r*opts.blockSize;
					grid.positions[r][c]["bg"] = opts.colorPalette[colour];
					//console.log(itemData[c]);			
					 
				}  // END pixel bool check
				
				// item data, html, grid
				
				
				//console.log(itemData[c]);	
				

			} // END column loop
			
			//rowData[r] = itemData;
			
			//console.log(rowData[r]);

		}  // END row loop*/		
		
		//console.log(rowData);
		if (opts.animation == "explode")
		{		
			grid.append(matrixHTML);
		}
		
		//return rowData;				
				
	};
	
	$.fn.matrix.findNextBlock = function(grid, opts)
	{
		
		if (grid.counter > 0)
		{
		
			// choose a random block to animate
			var rndRow = Math.floor(Math.random() * grid.height),
				rndCol = Math.floor(Math.random() * grid.width);
				
			// Check to make sure there is a block, if not then iterate through the matrix to find one
			// at the end of the matrix, go back to the beginning to find one
			if(opts.matrix[rndRow][rndCol] == 1)
			{		
				while(opts.matrix[rndRow][rndCol] == 1)
				{				
					rndCol++;			
					if(rndCol == grid.width)
					{
						rndCol=0;					
						rndRow++;
						if(rndRow == grid.height)
						{
							rndRow = 0;
						}
					
					}/*END if*/
			
				}/*END while*/
			}
			
			grid.counter--;
			
			opts.matrix[rndRow][rndCol] = 1;
			
			/*get the block id from the matrix coordinates*/
			var blockId = opts.blockId + (((rndRow * grid.width) + rndCol) + 1);		
			// I will need to return this id so I can pass it to the animate function			
													
			if (opts.animation == "explode")
			{
				$.fn.matrix.decayMatrix(grid, opts, blockId);
			}
			else if (opts.animation == "implode")
			{		
				$.fn.matrix.formMatrix(grid, opts, blockId, rndRow, rndCol);
			}
			//return blockId;
		}
		else
		{
			//console.log("your animation has finished - woot!");
			//return false;
		}
		
	};
	
	$.fn.matrix.decayMatrix = function(grid, opts, blockId)
	{
		var animationOpts = $.fn.matrix.findAnimationPoint(opts),
			speed = Math.random() * opts.animationSpeed;
			
		//console.log(blockId);										
							
		/*animate block and reset the function once finished*/
		$("#"+blockId).css("z-index","1").animate(animationOpts, speed, function()
		{
			opts.decayCounter++;	
			//console.log("decay matrix counter: "+opts.decayCounter);							
			$(this).remove();
			$.fn.matrix.findNextBlock(grid, opts);	
			//console.log("threshold counter: "+opts.thresholdCounter+", threshold: "+opts.threshold);
			if (opts.decayMultiplier && opts.decayCounter < opts.decayThreshold)
			{
				for (var i = 0; i < opts.decayMultiplier; i++)
				{
					//console.log("threshold counter: "+opts.thresholdCounter);
					
					// calculate the timing of the next animation
					var quickTime = (Math.random() * opts.animationSpeed) / opts.decay;
					var timer = setTimeout(function(){$.fn.matrix.findNextBlock(grid, opts);}, quickTime);
				}
			}									
		});
					
	};
	
	$.fn.matrix.formMatrix = function(grid, opts, blockId, rndRow, rndCol)
	{
		//console.log("row: "+rndRow+", col: "+rndCol);		
		//console.log(blockId);
		var speed = Math.floor(Math.random() * opts.animationSpeed),
			animationOpts = {top: grid.positions[rndRow][rndCol]["top"],left: grid.positions[rndRow][rndCol]["left"]}
		//console.log(grid.positions[rndRow][rndCol]);				
		// first create the html element, fade it into the position, and then animate it to the end point
		//console.log("positions: "+grid.positions);
		var newBox = '<div id="'+blockId+'" style="display:none;height:'+opts.blockSize+'px;width:'+opts.blockSize+'px;position:absolute;background-color:'+grid.positions[rndRow][rndCol]["bg"]+'"></div>';
		//console.log(grid.positions);
		var startPos = $.fn.matrix.findAnimationPoint(opts);
		//console.log(startPos);
		grid.append(newBox);		
		$("#"+blockId).css({"top":startPos["top"],"left":startPos["left"], "display": "block"}).fadeIn("2000");
		//console.log(blockId);
		//console.log(speed);
		$("#"+blockId).animate(animationOpts, speed, function()
		{
			//console.log("something");
			$.fn.matrix.findNextBlock(grid, opts);	
			//console.log("threshold counter: "+opts.thresholdCounter+", threshold: "+opts.threshold);
			
			if (opts.decayMultiplier && opts.decayCounter < opts.decayThreshold)
			{
				for (var i = 0; i < opts.decayMultiplier; i++)
				{
					//console.log("threshold counter: "+opts.thresholdCounter);
					opts.decayCounter++;
					//console.log("form matrix counter: "+opts.decayCounter);
					// calculate the timing of the next animation
					var quickTime = (Math.random() * opts.animationSpeed) / opts.decay;
					var timer = setTimeout(function(){$.fn.matrix.findNextBlock(grid, opts);}, quickTime);
				}
			}
			
		});
		//console.log("end animation");
		//console.log(startPos);
	};
	
	// define radom positions for the block to either animate to or animate from
	$.fn.matrix.findAnimationPoint = function(opts)
	{		
		var pageHeight = $(document).height(),
			pageWidth = $(document).width(),			
			north = Math.floor(-pageHeight + (-Math.random()*pageHeight)) + "px"
			east = Math.floor(pageWidth + (Math.random()*pageWidth)) + "px",
			south = Math.floor(pageHeight + (Math.random()*(pageHeight))) + "px",
			west = Math.floor(-pageWidth + (-Math.random()*pageWidth)) + "px",
			vertical = Math.floor($.fn.matrix.getRandomBoolean()*pageHeight) + ($.fn.matrix.getRandomBoolean()*Math.random()*pageHeight) + "px",
			sideway =  Math.floor($.fn.matrix.getRandomBoolean()*pageWidth) + ($.fn.matrix.getRandomBoolean()*Math.random()*pageWidth) + "px",
			blockPosition = {};
			
			// set the end position for the animation
			switch (opts.animationDirection)
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
	};
	
	$.fn.matrix.getRandomBoolean = function()
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
	};

	// end of module
})(jQuery);