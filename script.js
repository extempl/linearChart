var linearChart = function (container, config) {
//	this.config = config;
	var i, l, x, y;

	var svgNS = 'http://www.w3.org/2000/svg';
	var containerWidth = config.width + 65;
	var containerHeight = config.height + 80;

	var axisXLength = config.axisX.points.length;
	var axisYLeftLength = config.axisY.points.length;
	var axisYRightLength = config.axisY.points2.length;

	var singleStepX = config.width / (config.axisX.points[axisXLength - 1] - config.axisX.points[0]);

	var stepX = config.width / (axisXLength - 1);
	var stepY = config.height / (axisYLeftLength - 1);
//	var stepY2 = config.height / (axisYRightLength - 1);

	// create svg container
	var svgEl = document.createElementNS(svgNS, 'svg');
	svgEl.setAttribute('width', containerWidth);
	svgEl.setAttribute('height', containerHeight);
	var gMain = document.createElementNS(svgNS, 'g');
	gMain.setAttribute('transform', 'translate(20,60)');
	svgEl.appendChild(gMain);
	var containerEl = document.querySelector(container);
	containerEl.appendChild(svgEl);
	containerEl = svgEl.querySelector('g');

	// axisX
	var axisXLine;
	var axisXEl;
	var axisXTick;
	var axisXTickText;
	var axisXTickLine;

	axisXEl = document.createElementNS(svgNS, 'g');
	axisXEl.classList.add('axis');
	axisXEl.classList.add('x');
	axisXEl.setAttribute('transform', 'translate(0,' + (config.height - 1) + ')');

	axisXTickLine = document.createElementNS(svgNS, 'line');
	axisXTickLine.setAttribute('y2', 4);

	axisXTickText = document.createElementNS(svgNS, 'text');
	axisXTickText.setAttribute('dy', 17);

	x = 0;
	for(i = 0; i < axisXLength; i++) {
		axisXTick = document.createElementNS(svgNS, 'g');
		axisXTick.setAttribute('transform', 'translate(' + x + ',0)');

		axisXTickText = axisXTickText.cloneNode();
		axisXTickText.textContent = config.axisX.points[i];

		axisXTick.appendChild(axisXTickLine.cloneNode());
		axisXTick.appendChild(axisXTickText);
		axisXEl.appendChild(axisXTick);
		x += stepX;
	}
	axisXLine = document.createElementNS(svgNS,'path');
	axisXLine.classList.add('axisLine');
	axisXLine.setAttribute('d', 'M0,1 H' + config.width);
	axisXEl.appendChild(axisXLine);

	// left axisY
	var axisYLeftEl;
	var axisYLeftTick;
	var axisYLeftLine;
	var axisYLeftText;

	var point;

	axisYLeftEl = document.createElementNS(svgNS, 'g');
	axisYLeftEl.classList.add('axis');
	axisYLeftEl.classList.add('yLeft');

	axisYLeftLine = document.createElementNS(svgNS, 'line');
	axisYLeftLine.setAttribute('x2', 550);
	axisYLeftLine.style.stroke = config.middleLineColor;

	axisYLeftText = document.createElementNS(svgNS, 'text');
	axisYLeftText.setAttribute('y', 4);
	axisYLeftText.setAttribute('x', -20);
	axisYLeftText.style.fill = config.middleLineColor;

	for(i = axisYLeftLength; i > 1; i--) {
		point = config.axisY.points[i-1];

		axisYLeftTick = document.createElementNS(svgNS, 'g');
		axisYLeftTick.setAttribute('transform', 'translate(0,' + (config.height - point * stepY) + ')');

		axisYLeftText = axisYLeftText.cloneNode();
		axisYLeftText.textContent = point;

		axisYLeftTick.appendChild(axisYLeftLine.cloneNode());
		axisYLeftTick.appendChild(axisYLeftText);
		axisYLeftEl.appendChild(axisYLeftTick);
	}

	//right axisY
	var axisYRightEl;
	var axisYRightTick;


	axisYRightEl = document.createElementNS(svgNS, 'g');
	axisYRightEl.classList.add('axis');
	axisYRightEl.classList.add('yRight');
	axisYRightEl.setAttribute('transform', 'translate(' + (config.width + 10) + ',5)');
	for (i = axisYRightLength; i > 0; i--) {
		point = config.axisY.points2[i-1];

		axisYRightTick = document.createElementNS(svgNS, 'text');
		axisYRightTick.setAttribute('transform', 'translate(0,' + (config.height - point.val * stepY) + ')');
		axisYRightTick.textContent = point.lbl;

		axisYRightEl.appendChild(axisYRightTick);
	}

	var spotsEl = document.createElementNS(svgNS, 'g'); // move to main
	spotsEl.classList.add('spots');

	var vLines = document.createElementNS(svgNS, 'g'); //move to main
	vLines.classList.add('vLines');
	vLines.setAttribute('transform', 'translate(0,' + config.height + ')');

	var defs = document.createElementNS(svgNS, 'defs');


	// function that composing charts container

	containerEl.appendChild(axisXEl);
	containerEl.appendChild(axisYLeftEl);
	containerEl.appendChild(axisYRightEl);
	containerEl.appendChild(spotsEl);
	containerEl.appendChild(vLines);
	containerEl.appendChild(defs);

	//==============================================================

	// create path
	var mainLine = document.createElementNS(svgNS, 'path');
	mainLine.classList.add('mainLine');

	// create defs
	var linearGradient = document.createElementNS(svgNS, 'linearGradient');
	linearGradient.setAttribute('x', 0);
	linearGradient.setAttribute('y', 0);
	linearGradient.setAttribute('x2', 0);
	linearGradient.setAttribute('y2', 1);
	var stopEl = document.createElementNS(svgNS, 'stop');
	stopEl.setAttribute('stop-color', '#fff');
	stopEl.setAttribute('offset', 0);
	stopEl.setAttribute('stop-opacity', 0.1);

	var stopEl1 = stopEl.cloneNode();
	stopEl1.setAttribute('offset', 1);
	stopEl1.classList.add('gradientColor');
	stopEl1.setAttribute('stop-opacity', 0.1);

	linearGradient.appendChild(stopEl);
	linearGradient.appendChild(stopEl1);

	// create spots
	var spot = document.createElementNS(svgNS, 'g');
	var circle = document.createElementNS(svgNS, 'circle');
	circle.setAttribute('r', 5);
	var hintText = document.createElementNS(svgNS, 'text');
	hintText.setAttribute('transform', 'translate(0,-21)');
	var hintTextX = hintText.cloneNode();
	hintText.classList.add('percentageValue');
	hintTextX.classList.add('yValue');
	hintTextX.setAttribute('transform', 'translate(0,-35)');
	var hint = document.createElementNS(svgNS, 'path');
	hint.setAttribute('d',
		'M0,-10 l-19,-10    h  -1 ' +
	    'a 3,3 0 0,1 -3, -3 v -28 ' +
	    'a 3,3 0 0,1  3, -3 h  40 ' +
	    'a 3,3 0 0,1  3,  3 v  28 ' +
	    'a 3,3 0 0,1 -3,  3 h  -1 z');
	var hintBG = hint.cloneNode();
	hintBG.classList.add('hintWhiteBG');
	hint.classList.add('hint');

	spot.appendChild(circle);
	spot.appendChild(hintBG);
	spot.appendChild(hint);
	spot.appendChild(hintTextX);
	spot.appendChild(hintText);

	//create vLines
	var vLineEl = document.createElementNS(svgNS, 'g');
	var vLinePath = document.createElementNS(svgNS, 'path');
	var vLineTextEl = document.createElementNS(svgNS, 'g');
	var vLineTextBG = document.createElementNS(svgNS, 'path');
	var vLineText = document.createElementNS(svgNS, 'text');


	vLinePath.classList.add('vLine');
	vLineTextEl.setAttribute('transform', 'translate(0,-7)');
	vLineTextBG.classList.add('vLineBG');
	vLineTextBG.setAttribute('d', 'M0,0 V-15');
	vLineText.setAttribute('y', -4);

	vLineTextEl.appendChild(vLineTextBG);
	vLineTextEl.appendChild(vLineText);
	vLineEl.appendChild(vLinePath);
	vLineEl.appendChild(vLineTextEl);

	// menu handler
	document.querySelector('.navPanel').addEventListener('click', function (e) {
		if(e.target.tagName != 'SPAN')
			return true;
		var el = e.target;
		for(var i = 0, l = this.children.length; i < l; i++) {
			this.children[i].classList.remove('current');
		}
		el.parentNode.classList.add('current');
		document.querySelector('#chartContainer').setAttribute('class', 'showChart_' + el.parentNode.getAttribute('id'));
	});


	// function that creates charts through loop over it in config

	this.generateChart = function (chartConfig) {
		var j, k;

		var currentMainLine = mainLine.cloneNode();
		currentMainLine.style.stroke = chartConfig.color;
		currentMainLine.classList.add(chartConfig.id);
		// append line
		containerEl.appendChild(currentMainLine);

		// defs
		var currentLinearGradient = linearGradient.cloneNode(true);
		currentLinearGradient.querySelector('.gradientColor').setAttribute('stop-color', chartConfig.color);
		currentLinearGradient.setAttribute('id', chartConfig.id + '_gradient');
		defs.appendChild(currentLinearGradient);

		// iterate
		var lineCoords = 'M';
		var currentSpot;
		for(j = 0, k = chartConfig.points.length; j < k; j++) {
			x = singleStepX * (chartConfig.points[j].x - config.axisX.points[0]);
			y =  config.height - stepY * chartConfig.points[j].y;

			lineCoords += x + ',' + y + ' ';

			currentSpot = spot.cloneNode(true);
			currentSpot.classList.add(chartConfig.id);
			currentSpot.setAttribute('transform', 'translate(' + x + ',' + y + ')');
			currentSpot.style.stroke = chartConfig.color;
			currentSpot.querySelector('.hint').style.fill = 'url(#' + chartConfig.id + '_gradient)';
			currentSpot.querySelector('.yValue').textContent = chartConfig.points[j].y;
			currentSpot.querySelector('.percentageValue').textContent = chartConfig.points[j].percent + '%';
			spotsEl.appendChild(currentSpot);
			//label here

			var currentVLine = vLineEl.cloneNode(true);
			currentVLine.classList.add(chartConfig.id);
			currentVLine.setAttribute('transform', 'translate(' + x + ',0)');
			currentVLine.querySelector('.vLine').setAttribute('d', 'M0,0 V-' + (config.height - y - 10));
			currentVLine.querySelector('text').textContent = chartConfig.points[j].x;
			vLines.appendChild(currentVLine);
		}
		currentMainLine.setAttribute('d', lineCoords);

		var styleEl = document.querySelector(container + ' style');
		if(!styleEl) {
			styleEl = document.createElement('style');
			document.querySelector(container).appendChild(styleEl);
		}
		styleEl.innerHTML += '.showChart_' + chartConfig.id + ' .' + chartConfig.id + ' {display: block}';

		if(chartConfig.selected)
			document.querySelector(container).classList.add('showChart_' + chartConfig.id);
	};

	var selectedChart = 0; //for first init (e.g. by URL)

	for(i = 0, l = config.data.length; i < l; i++) {
		if(i == selectedChart) {
			config.data[i].selected = true;
		}
		this.generateChart(config.data[i]);
	}
	containerEl.appendChild(spotsEl);
};