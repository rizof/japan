var branches = [];
var seed     = {i: 0, x: 420, y: 600, a: 0, l: 100, d:0}; // a = angle, l = length, d = depth
var da       = 0.3; // Angle delta
var dl       = 0.85; // Length delta (factor)
var ar       = 0.7; // Randomness
var maxDepth = 0;



// Tree creation functions
function branch(b) {
	var end = endPt(b), daR, newB;

	branches.push(b);

	if (b.d === maxDepth)
		return;

	// Left branch
	daR = ar * Math.random() - ar * 0.5;
	newB = {
		i: branches.length,
		x: end.x,
		y: end.y,
		a: b.a - da + daR,
		l: b.l * dl,
		d: b.d + 1,
		parent: b.i
	};
	branch(newB);

	// Right branch
	daR = ar * Math.random() - ar * 0.5;
	newB = {
		i: branches.length,
		x: end.x, 
		y: end.y, 
		a: b.a + da + daR, 
		l: b.l * dl, 
		d: b.d + 1,
		parent: b.i
	};
	branch(newB);
}

function regenerate(initialise) {
	branches = [];
	branch(seed);
	initialise ? create() : update();
}


function endPt(b) {
	// Return endpoint of branch
	var x = b.x + b.l * Math.sin( b.a );
	var y = b.y - b.l * Math.cos( b.a );
	return {x: x, y: y};
}


// D3 functions
var color = d3.scale.linear()
    .domain([0, maxDepth])
    .range(["black","purple"]);

function x1(d) {return d.x;}
function y1(d) {return d.y;}
function x2(d) {return endPt(d).x;}
function y2(d) {return endPt(d).y;}
function highlightParents(d) {  
	var colour = d3.event.type === 'mouseover' ? 'green' : color(d.d);
	var depth = d.d;
	for(var i = 0; i <= depth; i++) {
		d3.select('#id-'+parseInt(d.i)).style('stroke', colour);
		d = branches[d.parent];
	}	
}

function create() {
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', function(d) {
        var t = parseInt(maxDepth*.5 +1 - d.d*.5);
        return  t + 'px';
    })
  	.style('stroke', function(d) {
        return color(d.d);
    })
		.attr('id', function(d) {return 'id-'+d.i;});
}

function update() {
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.transition()
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2);
}

//d3.selectAll('body').on('click', regenerate);

regenerate(true);

function submitQuiz(calcScore) {
	// get each answer score
	function answerScore (qName) {
		var radiosNo = document.getElementsByName(qName);

		for (var i = 0, length = radiosNo.length; i < length; i++) {
				if (radiosNo[i].checked) {
		// do something with radiosNo
				var answerValue = Number(radiosNo[i].value);
			}
		}
		// change NaNs to zero
		if (isNaN(answerValue)) {
			answerValue = 0;
		}
		return answerValue;
	}

	// calc score with answerScore function
	var calcScore = (answerScore('q1') + answerScore('q2') + answerScore('q3') + answerScore('q4') + answerScore('q5') + answerScore('q6') + answerScore('q7') + answerScore('q8') + answerScore('q9') + answerScore('q10'));
	maxDepth = calcScore;

	regenerate(color,true);

	// calculate "possible score" integer
	var questionCountArray = document.getElementsByClassName('question');

	var questionCounter = 0;
	for (var i = 0, length = questionCountArray.length; i < length; i++) {
		questionCounter++;
	}

	// show score as "score/possible score"
	var showScore = "Your Score: " + calcScore +"/" + questionCounter;

	document.getElementById('userScore').innerHTML = showScore;
}

function animateTree() {
	regenerate(false);
	setTimeout(animateTree, 300);
}

$(document).ready(function() {

	$('#submitButton').click(function() {
		$(this).addClass('hide');
	});

	setTimeout(function () {
		animateTree();
	}, 300);

});