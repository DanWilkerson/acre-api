var Api = require('./Api.js');
var Parser = require('./Parser.js');
var State = (function() {

  var _State = {};
  var _storedState;

  _State.get = function StateGet(callback) {

    if(typeof _storedState !== 'undefined') {

			callback(null, _storedState);

		} else {

			Api('get', 'search', {}, function(err, html) {

				if(err) { 

					callback(err);

				} else {

					_storedState = Parser.stateData(html);
					callback(null, _storedState);

				}

			});

		}

	};

	_State.set = function(state) {

    _storedState = state;

	};

	return _State;

})();

module.exports = State;
