var linearChart = function (container, config) {
	this.config = config;
	this.containerEl = document.querySelector(container);

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
	svgNS: 'http://www.w3.org/2000/svg',
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
			axisLength = points.length - 1,
			stepX = this.config.width / axisLength,
			el = document.createElementNS(this.svgNS, 'g'),
			tickText = document.createElementNS(this.svgNS, 'text'),
			tickLine = document.createElementNS(this.svgNS, 'line'),
			axisLine = document.createElementNS(this.svgNS, 'path'),
			tick;

		this.singleStepX = this.config.width / (points[axisLength] - points[0]);

		el.classList.add('axis');
		el.classList.add('x');
		el.setAttribute('transform', 'translate(0,' + (this.config.height - 1) + ')');

		tickLine.setAttribute('y2', 4);
		tickText.setAttribute('dy', 17);

		axisLine.classList.add('axisLine');
		axisLine.setAttribute('d', 'M0,1 H' + this.config.width);

		x = 0;
		for (i = 0; i <= axisLength; i++) {
			tickText = tickText.cloneNode();
			tickText.textContent = points[i];

			tick = document.createElementNS(this.svgNS, 'g');
			tick.setAttribute('transform', 'translate(' + x + ',0)');

			tick.appendChild(tickLine.cloneNode());
			tick.appendChild(tickText);

			el.appendChild(tick);
			x += stepX;
		}
		el.appendChild(axisLine);

		this.gMain.appendChild(el);
	},
	initAxisYLeft: function () {
		var i,
			points = this.config.axisY.points,
			axisLength = points.length - 1,
			el = document.createElementNS(this.svgNS, 'g'),
			tickLine = document.createElementNS(this.svgNS, 'line'),
			tickText = document.createElementNS(this.svgNS, 'text'),
			tick;

		this.stepY = this.config.height / axisLength;

		el.classList.add('axis');
		el.classList.add('yLeft');

		tickLine.setAttribute('x2', this.config.width);
		tickLine.style.stroke = this.config.middleLineColor;

		tickText.setAttribute('y', 4);
		tickText.setAttribute('x', -20);
		tickText.style.fill = this.config.middleLineColor;

		for (i = axisLength; i > 0; i--) {
			tick = document.createElementNS(this.svgNS, 'g');
			tick.setAttribute('transform', 'translate(0,' + (this.config.height - points[i] * this.stepY) + ')');

			tickText = tickText.cloneNode();
			tickText.textContent = points[i];

			tick.appendChild(tickLine.cloneNode());
			tick.appendChild(tickText);
			el.appendChild(tick);
		}

		this.gMain.appendChild(el);
	},
	initAxisYRight: function () {
		var axisLength = this.config.axisY.points2.length,
			el = document.createElementNS(this.svgNS, 'g'),
			tick, i, point;

		el.classList.add('axis');
		el.classList.add('yRight');
		el.setAttribute('transform', 'translate(' + (this.config.width + 5) + ',5)');

		for (i = axisLength; i > 0; i--) {
			point = this.config.axisY.points2[i - 1];

			tick = document.createElementNS(this.svgNS, 'text');
			tick.setAttribute('transform', 'translate(0,' + (this.config.height - point.val * this.stepY) + ')');
			tick.textContent = point.lbl;

			el.appendChild(tick);
		}

		this.gMain.appendChild(el);
	},
	initBasicWrappers: function () {
		this.spotsEl = document.createElementNS(this.svgNS, 'g');
		this.vLines = document.createElementNS(this.svgNS, 'g');
		this.defs = document.createElementNS(this.svgNS, 'defs');

		this.spotsEl.classList.add('spots');
		this.vLines.classList.add('vLines');
		this.vLines.setAttribute('transform', 'translate(0,' + this.config.height + ')');

		this.gMain.appendChild(this.vLines);
		this.gMain.appendChild(this.defs);
	},
	initMainLine: function () {
		this.mainLine = document.createElementNS(this.svgNS, 'path');
		this.mainLine.classList.add('mainLine');
	},
	initDefsElements: function () {
		var el = document.createElementNS(this.svgNS, 'linearGradient'),
			stopEl = document.createElementNS(this.svgNS, 'stop'),
			stopEl1;

		el.setAttribute('x', 0);
		el.setAttribute('y', 0);
		el.setAttribute('x2', 0);
		el.setAttribute('y2', 1);

		stopEl.setAttribute('stop-color', '#fff');
		stopEl.setAttribute('offset', 0);
		stopEl.setAttribute('stop-opacity', 0.1);

		stopEl1 = stopEl.cloneNode();
		stopEl1.setAttribute('offset', 1);
		stopEl1.classList.add('gradientColor');

		el.appendChild(stopEl);
		el.appendChild(stopEl1);

		this.linearGradient = el;
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
		var el = document.createElementNS(this.svgNS, 'g'),
			path = document.createElementNS(this.svgNS, 'path'),
			textEl = document.createElementNS(this.svgNS, 'g'),
			textBG = document.createElementNS(this.svgNS, 'path'),
			text = document.createElementNS(this.svgNS, 'text');

		path.classList.add('vLine');
		textEl.setAttribute('transform', 'translate(0,-7)');

		textBG.classList.add('vLineBG');
		textBG.setAttribute('d', 'M0,0 V-15');

		text.setAttribute('y', -4);

		textEl.appendChild(textBG);
		textEl.appendChild(text);
		el.appendChild(path);
		el.appendChild(textEl);

		this.vLineEl = el;
	},
	generateChart: function (chartConfig) {
		var j, k,
			mainLine = this.mainLine.cloneNode(),
			linearGradient = this.linearGradient.cloneNode(true),
			lineCoords = 'M',
			styleEl = this.containerEl.querySelector('style');

		mainLine.style.stroke = chartConfig.color;
		mainLine.classList.add(chartConfig.id);

		this.gMain.appendChild(mainLine);

		// defs
		linearGradient.querySelector('.gradientColor').setAttribute('stop-color', chartConfig.color);
		linearGradient.setAttribute('id', chartConfig.id + '_gradient');
		this.defs.appendChild(linearGradient);

		for (j = 0, k = chartConfig.points.length; j < k; j++)
			lineCoords += this.generateSpot(chartConfig.id, chartConfig.color, chartConfig.points[j]);

		mainLine.setAttribute('d', lineCoords);

		if (!styleEl) {
			styleEl = document.createElement('style');
			this.containerEl.appendChild(styleEl);
		}
		styleEl.innerHTML += '.showChart_' + chartConfig.id + ' .' + chartConfig.id + ' {display: block}';

		if (chartConfig.selected)
			this.selectChart(chartConfig.id);
	},
	generateSpot: function (id, color, point) {
		var spot, vLine,
		x = this.singleStepX * (point.x - this.config.axisX.points[0]),
		y = this.config.height - this.stepY * point.y;

		spot = this.spot.cloneNode(true);
		spot.classList.add(id);
		spot.setAttribute('transform', 'translate(' + x + ',' + y + ')');
		spot.style.stroke = color;
		spot.querySelector('.hint').style.fill = 'url(#' + id + '_gradient)';
		spot.querySelector('.yValue').textContent = point.y;
		spot.querySelector('.percentageValue').textContent = point.percent + '%';

		this.spotsEl.appendChild(spot);
		//label here

		vLine = this.vLineEl.cloneNode(true);
		vLine.classList.add(id);
		vLine.setAttribute('transform', 'translate(' + x + ',0)');
		vLine.querySelector('.vLine').setAttribute('d', 'M0,0 V-' + (this.config.height - y - 10));
		vLine.querySelector('text').textContent = point.x;

		this.vLines.appendChild(vLine);

		return x + ',' + y + ' ';
	},
	selectChart: function (id) {
		id = id || 'none';
		var chartClassList = this.containerEl.classList;

		var toRemove = [], i;
		for(i in chartClassList)
			if(chartClassList.hasOwnProperty(i) && !isNaN(i))
				if(chartClassList[i].match(/showChart_(\S)+/))
					toRemove.push(chartClassList[i]);
		if(toRemove)
			for(i = 0; i < toRemove.length; i++)
				chartClassList.remove(toRemove[i]);

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