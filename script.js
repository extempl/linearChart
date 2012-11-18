var linearChart = function (container, config) {
	this.config = config;
	this.containerEl = document.querySelector(container);

	this.svgNS = 'http://www.w3.org/2000/svg';

	this.init();

	document.querySelector('.navPanel').addEventListener('click', this.onclickNav.bind(this));

	var selected;
	for(var i = 0, l = config.data.length; i < l; i++) {
		this.generateChart(config.data[i]);
		if(config.data[i].selected)
			selected = true;
	}
	if(!selected)
		this.selectChart(config.data[0].id);

	this.gMain.appendChild(this.spotsEl);
};

linearChart.prototype = {
	init: function () {
		this.createSVGContainer();
		this.initAxisX();
		this.initAxisYLeft();
		this.initAxisYRight();
		this.initBasicWrappers();
		this.initMainLine();
		this.initDefsElements();
		this.initSpotElements();
		this.initVLineElements();
	},
	createSVGContainer: function () {
		var svgEl = document.createElementNS(this.svgNS, 'svg'),
			gMain = document.createElementNS(this.svgNS, 'g');

		svgEl.setAttribute('width', this.config.width + 65);
		svgEl.setAttribute('height', this.config.height + 80);
		gMain.setAttribute('transform', 'translate(20,60)');
		svgEl.appendChild(gMain);
		this.containerEl.appendChild(svgEl);

		this.gMain = gMain;
	},
	initAxisX: function () {
		var x, i,
			points = this.config.axisX.points,
			axisXLength = points.length - 1,
			stepX = this.config.width / axisXLength,
			axisXEl = document.createElementNS(this.svgNS, 'g'),
			axisXTickText = document.createElementNS(this.svgNS, 'text'),
			axisXTickLine = document.createElementNS(this.svgNS, 'line'),
			axisXLine = document.createElementNS(this.svgNS, 'path'),
			axisXTick;

		this.singleStepX = this.config.width / (points[axisXLength] - points[0]);

		axisXEl.classList.add('axis');
		axisXEl.classList.add('x');
		axisXEl.setAttribute('transform', 'translate(0,' + (this.config.height - 1) + ')');

		axisXTickLine.setAttribute('y2', 4);
		axisXTickText.setAttribute('dy', 17);

		axisXLine.classList.add('axisLine');
		axisXLine.setAttribute('d', 'M0,1 H' + this.config.width);

		x = 0;
		for (i = 0; i <= axisXLength; i++) {
			axisXTickText = axisXTickText.cloneNode();
			axisXTickText.textContent = points[i];

			axisXTick = document.createElementNS(this.svgNS, 'g');
			axisXTick.setAttribute('transform', 'translate(' + x + ',0)');

			axisXTick.appendChild(axisXTickLine.cloneNode());
			axisXTick.appendChild(axisXTickText);

			axisXEl.appendChild(axisXTick);
			x += stepX;
		}
		axisXEl.appendChild(axisXLine);

		this.gMain.appendChild(axisXEl);
	},
	initAxisYLeft: function () {
		var i,
			points = this.config.axisY.points,
			axisYLeftLength = points.length - 1,
			axisYLeftEl = document.createElementNS(this.svgNS, 'g'),
			axisYLeftLine = document.createElementNS(this.svgNS, 'line'),
			axisYLeftText = document.createElementNS(this.svgNS, 'text'),
			axisYLeftTick;

		this.stepY = this.config.height / axisYLeftLength;

		axisYLeftEl.classList.add('axis');
		axisYLeftEl.classList.add('yLeft');

		axisYLeftLine.setAttribute('x2', this.config.width);
		axisYLeftLine.style.stroke = this.config.middleLineColor;

		axisYLeftText.setAttribute('y', 4);
		axisYLeftText.setAttribute('x', -20);
		axisYLeftText.style.fill = this.config.middleLineColor;

		for (i = axisYLeftLength; i > 0; i--) {
			axisYLeftTick = document.createElementNS(this.svgNS, 'g');
			axisYLeftTick.setAttribute('transform', 'translate(0,' + (this.config.height - points[i] * this.stepY) + ')');

			axisYLeftText = axisYLeftText.cloneNode();
			axisYLeftText.textContent = points[i];

			axisYLeftTick.appendChild(axisYLeftLine.cloneNode());
			axisYLeftTick.appendChild(axisYLeftText);
			axisYLeftEl.appendChild(axisYLeftTick);
		}

		this.gMain.appendChild(axisYLeftEl);
	},
	initAxisYRight: function () {
		var axisYRightLength = this.config.axisY.points2.length,
			axisYRightEl = document.createElementNS(this.svgNS, 'g'),
			axisYRightTick, i, point;

		axisYRightEl.classList.add('axis');
		axisYRightEl.classList.add('yRight');
		axisYRightEl.setAttribute('transform', 'translate(' + (this.config.width + 10) + ',5)');

		for (i = axisYRightLength; i > 0; i--) {
			point = this.config.axisY.points2[i - 1];

			axisYRightTick = document.createElementNS(this.svgNS, 'text');
			axisYRightTick.setAttribute('transform', 'translate(0,' + (this.config.height - point.val * this.stepY) + ')');
			axisYRightTick.textContent = point.lbl;

			axisYRightEl.appendChild(axisYRightTick);
		}

		this.gMain.appendChild(axisYRightEl);
	},
	initBasicWrappers: function () {
		this.spotsEl = document.createElementNS(this.svgNS, 'g');
		this.vLines = document.createElementNS(this.svgNS, 'g');
		this.defs = document.createElementNS(this.svgNS, 'defs');

		this.spotsEl.classList.add('spots');
		this.vLines.classList.add('vLines');
		this.vLines.setAttribute('transform', 'translate(0,' + this.config.height + ')');

		// function that composing charts container

		this.gMain.appendChild(this.vLines);
		this.gMain.appendChild(this.defs);
	},
	initMainLine: function () {
		this.mainLine = document.createElementNS(this.svgNS, 'path');
		this.mainLine.classList.add('mainLine');
	},
	initDefsElements: function () {
		var linearGradient = document.createElementNS(this.svgNS, 'linearGradient'),
			stopEl = document.createElementNS(this.svgNS, 'stop'),
			stopEl1;

		linearGradient.setAttribute('x', 0);
		linearGradient.setAttribute('y', 0);
		linearGradient.setAttribute('x2', 0);
		linearGradient.setAttribute('y2', 1);

		stopEl.setAttribute('stop-color', '#fff');
		stopEl.setAttribute('offset', 0);
		stopEl.setAttribute('stop-opacity', 0.1);

		stopEl1 = stopEl.cloneNode();
		stopEl1.setAttribute('offset', 1);
		stopEl1.classList.add('gradientColor');

		linearGradient.appendChild(stopEl);
		linearGradient.appendChild(stopEl1);

		this.linearGradient = linearGradient;
	},
	initSpotElements: function () {
		var spot = document.createElementNS(this.svgNS, 'g'),
			circle = document.createElementNS(this.svgNS, 'circle'),
			hintText = document.createElementNS(this.svgNS, 'text'),
			hint = document.createElementNS(this.svgNS, 'path'),
			hintTextX, hintBG;

		circle.setAttribute('r', 5);

		hintText.setAttribute('transform', 'translate(0,-21)');
		hintTextX = hintText.cloneNode();
		hintText.classList.add('percentageValue');
		hintTextX.classList.add('yValue');
		hintTextX.setAttribute('transform', 'translate(0,-35)');

		hint.setAttribute('d',
			'M0,-10 l-19,-10    h  -1 ' +
			'a 3,3 0 0,1 -3, -3 v -28 ' +
			'a 3,3 0 0,1  3, -3 h  40 ' +
			'a 3,3 0 0,1  3,  3 v  28 ' +
			'a 3,3 0 0,1 -3,  3 h  -1 z');
		hintBG = hint.cloneNode();
		hintBG.classList.add('hintWhiteBG');
		hint.classList.add('hint');

		spot.appendChild(circle);
		spot.appendChild(hintBG);
		spot.appendChild(hint);
		spot.appendChild(hintTextX);
		spot.appendChild(hintText);

		this.spot = spot;
	},
	initVLineElements: function () {
		var vLineEl = document.createElementNS(this.svgNS, 'g'),
			vLinePath = document.createElementNS(this.svgNS, 'path'),
			vLineTextEl = document.createElementNS(this.svgNS, 'g'),
			vLineTextBG = document.createElementNS(this.svgNS, 'path'),
			vLineText = document.createElementNS(this.svgNS, 'text');

		vLinePath.classList.add('vLine');
		vLineTextEl.setAttribute('transform', 'translate(0,-7)');

		vLineTextBG.classList.add('vLineBG');
		vLineTextBG.setAttribute('d', 'M0,0 V-15');

		vLineText.setAttribute('y', -4);

		vLineTextEl.appendChild(vLineTextBG);
		vLineTextEl.appendChild(vLineText);
		vLineEl.appendChild(vLinePath);
		vLineEl.appendChild(vLineTextEl);

		this.vLineEl = vLineEl;
	},
	generateChart: function (chartConfig) {
		var j, k,
			currentMainLine = this.mainLine.cloneNode(),
			currentLinearGradient = this.linearGradient.cloneNode(true),
			lineCoords = 'M',
			styleEl = this.containerEl.querySelector('style');

		currentMainLine.style.stroke = chartConfig.color;
		currentMainLine.classList.add(chartConfig.id);
		// append line
		this.gMain.appendChild(currentMainLine);

		// defs
		currentLinearGradient.querySelector('.gradientColor').setAttribute('stop-color', chartConfig.color);
		currentLinearGradient.setAttribute('id', chartConfig.id + '_gradient');
		this.defs.appendChild(currentLinearGradient);

		for (j = 0, k = chartConfig.points.length; j < k; j++)
			lineCoords += this.generateSpot(chartConfig, j);

		currentMainLine.setAttribute('d', lineCoords);

		if (!styleEl) {
			styleEl = document.createElement('style');
			this.containerEl.appendChild(styleEl);
		}
		styleEl.innerHTML += '.showChart_' + chartConfig.id + ' .' + chartConfig.id + ' {display: block}';

		if (chartConfig.selected)
			this.selectChart(chartConfig.id);
	},
	generateSpot: function (chartConfig, point) {
		point = chartConfig.points[point];
		var x, y, currentSpot, currentVLine;
		x = this.singleStepX * (point.x - this.config.axisX.points[0]);
		y = this.config.height - this.stepY * point.y;

		currentSpot = this.spot.cloneNode(true);
		currentSpot.classList.add(chartConfig.id);
		currentSpot.setAttribute('transform', 'translate(' + x + ',' + y + ')');
		currentSpot.style.stroke = chartConfig.color;
		currentSpot.querySelector('.hint').style.fill = 'url(#' + chartConfig.id + '_gradient)';
		currentSpot.querySelector('.yValue').textContent = point.y;
		currentSpot.querySelector('.percentageValue').textContent = point.percent + '%';

		this.spotsEl.appendChild(currentSpot);
		//label here

		currentVLine = this.vLineEl.cloneNode(true);
		currentVLine.classList.add(chartConfig.id);
		currentVLine.setAttribute('transform', 'translate(' + x + ',0)');
		currentVLine.querySelector('.vLine').setAttribute('d', 'M0,0 V-' + (this.config.height - y - 10));
		currentVLine.querySelector('text').textContent = point.x;

		this.vLines.appendChild(currentVLine);

		return x + ',' + y + ' ';
	},
	selectChart: function (id) {
		id = id || 'none';
		var currentClassList = this.containerEl.classList;

		var toRemove = [], i;
		for(i in currentClassList)
			if(currentClassList.hasOwnProperty(i) && !isNaN(i))
				if(currentClassList[i].match(/showChart_(\S)+/))
					toRemove.push(currentClassList[i]);
		if(toRemove)
			for(i = 0; i < toRemove.length; i++)
				currentClassList.remove(toRemove[i]);

		this.containerEl.classList.add('showChart_' + id);
		if(document.querySelector('.current'))
			document.querySelector('.current').classList.remove('current');
		if(document.querySelector('#' + id))
			document.querySelector('#' + id).classList.add('current');
	},
    onclickNav: function (e) {
		if (e.target.tagName == 'SPAN')
			this.selectChart(e.target.parentNode.id);
	}
};