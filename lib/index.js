'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _once = require('once');

var _once2 = _interopRequireDefault(_once);

var _httpplease = require('httpplease');

var _httpplease2 = _interopRequireDefault(_httpplease);

var _oldiexdomain = require('httpplease/plugins/oldiexdomain');

var _oldiexdomain2 = _interopRequireDefault(_oldiexdomain);

var _shouldComponentUpdate = require('./shouldComponentUpdate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = _get__('httpplease').use(_get__('ieXDomain'));

var Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
  UNSUPPORTED: 'unsupported',
  UNMOUNTING: 'unmounting'
};

var getRequestsByUrl = {};
var loadedIcons = {};

var createGetOrUseCacheForUrl = function createGetOrUseCacheForUrl(url, callback) {
  if (_get__('loadedIcons')[url]) {
    (function () {
      var params = _get__('loadedIcons')[url];

      setTimeout(function () {
        return callback(params[0], params[1]);
      }, 0);
    })();
  }

  if (!_get__('getRequestsByUrl')[url]) {
    _get__('getRequestsByUrl')[url] = [];

    _get__('http').get(url, function (err, res) {
      _get__('getRequestsByUrl')[url].forEach(function (cb) {
        _get__('loadedIcons')[url] = [err, res];
        cb(err, res);
      });
    });
  }

  _get__('getRequestsByUrl')[url].push(callback);
};

var supportsInlineSVG = _get__('once')(function () {
  if (!document) {
    return false;
  }

  var div = document.createElement('div');
  div.innerHTML = '<svg />';
  return div.firstChild && div.firstChild.namespaceURI === 'http://www.w3.org/2000/svg';
});

var isSupportedEnvironment = _get__('once')(function () {
  return ((typeof window !== 'undefined' && window !== null ? window.XMLHttpRequest : void 0) || (typeof window !== 'undefined' && window !== null ? window.XDomainRequest : void 0)) && _get__('supportsInlineSVG')();
});

var uniquifyIDs = function () {
  var mkAttributePattern = function mkAttributePattern(attr) {
    return '(?:(?:\\s|\\:)' + attr + ')';
  };

  var idPattern = new RegExp('(?:(' + mkAttributePattern('id') + ')="([^"]+)")|(?:(' + mkAttributePattern('href') + '|' + mkAttributePattern('role') + '|' + mkAttributePattern('arcrole') + ')="\\#([^"]+)")|(?:="url\\(\\#([^\\)]+)\\)")', 'g');

  return function (svgText, svgID) {
    var uniquifyID = function uniquifyID(id) {
      return id + '___' + svgID;
    };

    return svgText.replace(idPattern, function (m, p1, p2, p3, p4, p5) {
      //eslint-disable-line consistent-return
      if (p2) {
        return p1 + '="' + uniquifyID(p2) + '"';
      } else if (p4) {
        return p3 + '="#' + uniquifyID(p4) + '"';
      } else if (p5) {
        return '="url(#' + uniquifyID(p5) + ')"';
      }
    });
  };
}();

var getHash = function getHash(str) {
  var chr = void 0;
  var hash = 0;
  var i = void 0;
  var j = void 0;
  var len = void 0;

  if (!str) {
    return hash;
  }

  for (i = 0, j = 0, len = str.length; len <= 0 ? j < len : j > len; i = len <= 0 ? ++j : --j) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash = hash & hash;
  }
  return hash;
};

var InlineSVGError = function (_Error) {
  _inherits(InlineSVGError, _Error);

  function InlineSVGError(message) {
    var _ret2;

    _classCallCheck(this, InlineSVGError);

    var _this = _possibleConstructorReturn(this, (InlineSVGError.__proto__ || Object.getPrototypeOf(InlineSVGError)).call(this));

    _this.name = 'InlineSVGError';
    _this.isSupportedBrowser = true;
    _this.isConfigurationError = false;
    _this.isUnsupportedBrowserError = false;
    _this.message = message;

    return _ret2 = _this, _possibleConstructorReturn(_this, _ret2);
  }

  return InlineSVGError;
}(Error);

var createError = function createError(message, attrs) {
  var err = new (_get__('InlineSVGError'))(message);

  Object.keys(attrs).forEach(function (k) {
    err[k] = attrs[k];
  });

  return err;
};

var unsupportedBrowserError = function unsupportedBrowserError(message) {
  var newMessage = message;

  if (newMessage === null) {
    newMessage = 'Unsupported Browser';
  }

  return _get__('createError')(newMessage, {
    isSupportedBrowser: false,
    isUnsupportedBrowserError: true
  });
};

var configurationError = function configurationError(message) {
  return _get__('createError')(message, {
    isConfigurationError: true
  });
};

var InlineSVG = function (_get__$Component) {
  _inherits(InlineSVG, _get__$Component);

  function InlineSVG(props) {
    _classCallCheck(this, InlineSVG);

    var _this2 = _possibleConstructorReturn(this, (InlineSVG.__proto__ || Object.getPrototypeOf(InlineSVG)).call(this, props));

    _this2.shouldComponentUpdate = _shouldComponentUpdate.shouldComponentUpdate;


    _this2.state = {
      status: _get__('Status').PENDING
    };

    _this2.handleLoad = _this2.handleLoad.bind(_this2);
    return _this2;
  }

  _createClass(InlineSVG, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.state.status === _get__('Status').PENDING) {
        if (this.props.supportTest()) {
          if (this.props.src) {
            this.setState({
              status: _get__('Status').LOADING
            }, this.load);
          } else {
            this.fail(_get__('configurationError')('Missing source'));
          }
        } else {
          this.fail(_get__('unsupportedBrowserError')());
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.state.status = _get__('Status').UNMOUNTING;
    }
  }, {
    key: 'fail',
    value: function fail(error) {
      var _this3 = this;

      var status = error.isUnsupportedBrowserError ? _get__('Status').UNSUPPORTED : _get__('Status').FAILED;

      this.setState({ status: status }, function () {
        if (typeof _this3.props.onError === 'function') {
          _this3.props.onError(error);
        }
      });
    }
  }, {
    key: 'handleLoad',
    value: function handleLoad(err, res) {
      var _this4 = this;

      if (err) {
        this.fail(err);
        return;
      }
      if (this.state.status === _get__('Status').UNMOUNTING) {
        return;
      }
      this.setState({
        loadedText: res.text,
        status: _get__('Status').LOADED
      }, function () {
        return typeof _this4.props.onLoad === 'function' ? _this4.props.onLoad() : null;
      });
    }
  }, {
    key: 'load',
    value: function load() {
      var match = this.props.src.match(/data:image\/svg[^,]*?(;base64)?,(.*)/);
      if (match) {
        return this.handleLoad(null, {
          text: match[1] ? atob(match[2]) : decodeURIComponent(match[2])
        });
      }
      if (this.props.cacheGetRequests) {
        return _get__('createGetOrUseCacheForUrl')(this.props.src, this.handleLoad);
      }

      return _get__('http').get(this.props.src, this.handleLoad);
    }
  }, {
    key: 'getClassName',
    value: function getClassName() {
      var className = 'isvg ' + this.state.status;

      if (this.props.className) {
        className += ' ' + this.props.className;
      }

      return className;
    }
  }, {
    key: 'processSVG',
    value: function processSVG(svgText) {
      if (this.props.uniquifyIDs) {
        return _get__('uniquifyIDs')(svgText, _get__('getHash')(this.props.src));
      }

      return svgText;
    }
  }, {
    key: 'renderContents',
    value: function renderContents() {
      switch (this.state.status) {
        case _get__('Status').UNSUPPORTED:
          return this.props.children;
        default:
          return this.props.preloader;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.wrapper({
        className: this.getClassName(),
        dangerouslySetInnerHTML: this.state.loadedText ? {
          __html: this.processSVG(this.state.loadedText)
        } : undefined
      }, this.renderContents());
    }
  }]);

  return InlineSVG;
}(_get__('React').Component);

InlineSVG.propTypes = {
  cacheGetRequests: _get__('React').PropTypes.bool,
  children: _get__('React').PropTypes.node,
  className: _get__('React').PropTypes.string,
  onError: _get__('React').PropTypes.func,
  onLoad: _get__('React').PropTypes.func,
  preloader: _get__('React').PropTypes.func,
  src: _get__('React').PropTypes.string.isRequired,
  supportTest: _get__('React').PropTypes.func,
  uniquifyIDs: _get__('React').PropTypes.bool,
  wrapper: _get__('React').PropTypes.func
};
InlineSVG.defaultProps = {
  wrapper: _get__('React').DOM.span,
  supportTest: _get__('isSupportedEnvironment'),
  uniquifyIDs: true,
  cacheGetRequests: false
};
exports.default = InlineSVG;
var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'httpplease':
      return _httpplease2.default;

    case 'ieXDomain':
      return _oldiexdomain2.default;

    case 'loadedIcons':
      return loadedIcons;

    case 'getRequestsByUrl':
      return getRequestsByUrl;

    case 'http':
      return http;

    case 'once':
      return _once2.default;

    case 'supportsInlineSVG':
      return supportsInlineSVG;

    case 'InlineSVGError':
      return InlineSVGError;

    case 'createError':
      return createError;

    case 'Status':
      return Status;

    case 'React':
      return _react2.default;

    case 'isSupportedEnvironment':
      return isSupportedEnvironment;

    case 'configurationError':
      return configurationError;

    case 'unsupportedBrowserError':
      return unsupportedBrowserError;

    case 'createGetOrUseCacheForUrl':
      return createGetOrUseCacheForUrl;

    case 'uniquifyIDs':
      return uniquifyIDs;

    case 'getHash':
      return getHash;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof InlineSVG === 'undefined' ? 'undefined' : _typeof(InlineSVG);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(InlineSVG, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(InlineSVG)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;