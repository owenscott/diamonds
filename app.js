var completed = 0;

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

		incrementInventory: function() {
			this.inventory = this.inventory + 1;
		},
		
		incrementAndCheck: function() {

			if (this.currentTime === this.cycleTime) {
				this.passToNextProcess();
				this.currentTime = 0;
			}
			else if (this.inventory > 0) {
				this.currentTime++;
			}

			if (this.name === 'cleave')	this.logSelf();

			if (this.queuedInventory) {
				this.queuedInventory = false;
				this.inventory++;
			}

		},

		logSelf: function() {
			$('#' + this.el).html(this.inventory);
		},

		passToNextProcess: options.passToNextProcess || function() {
			
			this.inventory = this.inventory - 1;
			

			if (this.nextProcess === 'done') {
				console.log('one unit done');
				completed++;
			}
			else {
				console.log('passing from ' + this.name + ' to ' + this.nextProcess.name);
				this.nextProcess.incrementInventory();
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
	nextProcess: round
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
	nextProcess: cleave,
	inventory: Infinity
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

$('document').ready( function() {
	setInterval(function() {
		processes.forEach(function(process) {
			process.incrementAndCheck();
			process.logSelf();
		})
		turn ++;
		$('#turn').html(turn);
		$('#completed').html(completed);
	}, 200)
})



