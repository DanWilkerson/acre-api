// Manage our requests to prevent overloading the server
var Connections = (function Connections(){
	
	var _Connections        = {};
	var _queue             = [];
	var currentConnections = 0; 
	var maxConnections     = 20;

	var check = function ConnectionsCheck() {

		if(currentConnections < maxConnections) {

			var availableConnections = maxConnections - currentConnections < _queue.length ? maxConnections - currentConnections : _queue.length; 
			process(availableConnections);

		}

	};

	var process = function ConnectionsProcess(num) {

		var i;
	
		for(i = 0; i < num; i++){

			_queue[0]();
			_queue.splice(0, 1);
			currentConnections++;

		}

	};

	_Connections.add = function ConnectionsAdd(item) {

		_queue.push(item);
		check();

	};

	_Connections.remove = function ConnectionsRemove() {

		currentConnections--;
		check();

	};

	return _Connections;

})();
module.exports = Connections;
