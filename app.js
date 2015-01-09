var completed = 0;
var measure = false;

var throughout = 0;
var elapsedTime = 0;

var Process = function(options) {

	return {
		
		nextProcess: options.nextProcess || 'done',
		
		currentTime: 0,

		name: options.name || null,
		
		cycleTime: options.cycleTime || 0,
		
		inventory: options.inventory || 0,

		el: options.el,

		// inventory has been queued this turn but is not yet available to the process

		queuedInventory: false, 

		queueInventory: function() {
			this.queuedInventory = true;
		},

		incrementInventory: function(num) {
			this.inventory = this.inventory + num;
		},
		
		incrementAndCheck: function() {
			if (this.currentTime >= this.cycleTime) {
				this.passToNextProcess();
				this.currentTime = 0;
				if (this.inventory > 0) {
					this.currentTime++;
				}
			}
			
			else if (this.inventory > 0) {
				this.currentTime++;
			}

			if (this.name === 'cleave')	this.logSelf();

			if (this.queuedInventory) {
				console.log('starting production');
				this.queuedInventory = false;
				this.inventory++;
			}

		},

		logSelf: function() {
			$('#' + this.el).html(this.inventory);
			$('#' + this.el + '-progress').html(this.currentTime + ' / ' + this.cycleTime)
			this.cycleTime = $('#' + this.el + '-time').val()
		},

		passToNextProcess: options.passToNextProcess || function() {
			
			this.inventory = this.inventory - 1;
			

			if (this.nextProcess === 'done') {
				console.log('one unit done');
				completed++;
				if (measure) {
					throughout++;
				}
			}
			else {
				this.nextProcess.incrementInventory(1);
			}


		}

	}

}

var processes = [];



var inspect = new Process({
	name: 'inspect',
	el: 'inspect',
	cycleTime: 25
})

var polish = new Process({
	name: 'polish',
	el: 'polish',
	cycleTime: 40,
	nextProcess: inspect
})

var round = new Process({
	name: 'round',
	el: 'round',
	cycleTime: 30,
	nextProcess: polish
})

var saw = new Process({
	name: 'saw',
	el: 'saw',
	cycleTime: 60,
	nextProcess: round,
	passToNextProcess: function() {

		this.inventory = this.inventory - 1;
		this.nextProcess.incrementInventory(2);

	}
})

var cleave = new Process({
	name: 'cleave',
	el: 'cleave',
	cycleTime: 40,
	nextProcess: saw
})

var inspectRoughStones = new Process({
	name:'inspect rough stones',
	el: 'inspect-stones',
	cycleTime: 30,
	// passes either to round or cleave
	inventory: Infinity,
	passToNextProcess: function() {

		this.inventory = this.inventory - 1;
		var random = Math.random();
		console.log(random);
		if(random < $('#doubles').val()) {
			console.log('double');
			cleave.incrementInventory(1);
		}
		else {
			console.log('single');
			round.incrementInventory(1);
		}

	}
})

processes = [
	inspectRoughStones,
	cleave,
	saw,
	round,
	polish,
	inspect
]

var turn = 0;




var main = function() {
	processes.forEach(function(process) {
		process.incrementAndCheck();
		process.logSelf();
	})
	turn ++;
	$('#turn').html(turn);
	$('#completed').html(completed);
	if (measure) {
		elapsedTime++;
		$('#throughout').html(throughout);
		$('#elapsed-time').html(elapsedTime);
		$('#cycle-time').html(parseInt(elapsedTime / throughout));
	}
	setTimeout(main, $('#speed').val());
}

$('document').ready( function() {
	setTimeout(main , 100);
	$('#measure').click(function() {
		if (measure === false) {
			measure = true;
			throughout = 0;
			elapsedTime = 0;
			$('#measure').html('Stop Measuring');
		}
		else {
			measure = false;
			$('#measure').html('Start Measuring');
		}
	});

	$('#reset').click(function() {	
		processes.forEach(function(process) {
			if (process.inventory < Infinity) {
				process.inventory = 0;				
			}

		})
	});

})



