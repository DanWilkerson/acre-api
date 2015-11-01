var Api = require('./Api.js');
var Parser = require('./Parser.js');

var State = (function() {

  var _State = {};
  var _gettingState = false;
  var _queue = [];
  var _storedState;

  _State.get = function StateGet(callback) {

    if (_storedState) {

			callback(null, _storedState);

		} else if(_gettingState) {

      _queue.push(function() {

        callback(null, _storedState);

      });

    } else {

      _gettingState = true;

			Api('get', 'search', {}, function(err, html) {

				if(err) { 

          _gettingState = false;
					callback(err);

				} else {

					_storedState = Parser.stateData(html);

          if(_gettingState) {

            _clearQueue();
            _gettingState = false;

          }

					callback(null, _storedState);

				}

			});

		}

	};

	_State.set = function(state) {

    _storedState = state;

	};

	return _State;

  function _clearQueue() {

    _queue.forEach(function(el) {

      el();

    });

    _queue.length = 0;

  }

})();

module.exports = State;
