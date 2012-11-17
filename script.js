var linearChart = function (container, config) {
//	this.config = config;
	var i, l, x, y;

	var svgNS = 'http://www.w3.org/2000/svg';
	var containerWidth = config.width + 65;
	var containerHeight = config.height + 80;

	var axisXLength = config.axisX.points.length;
	var axisYLeftLength = config.axisY.points.length;
	var axisYRightLength = config.axisY.points2.length;

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

	axisYLeftText = document.createElementNS(svgNS, 'text');
	axisYLeftText.setAttribute('y', 4);
	axisYLeftText.setAttribute('x', -20);

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

	// function that composing charts container

	containerEl.appendChild(axisXEl);
	containerEl.appendChild(axisYLeftEl);
	containerEl.appendChild(axisYRightEl);


	//==============================================================


	// create papth
	// create defs
	// create spots

	// function that creates charts through loop over it in config
};