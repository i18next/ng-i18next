angular.module('jm.i18next', ['ng']);
angular.module('jm.i18next').provider('$i18next', function () {
  'use strict';
  var self = this, t = null, translations = {}, optionsObj;
  self.options = {};
  self.$get = function ($rootScope) {
    function init(options) {
      window.i18n.init(options, function (localize) {
        function setTranslation(key) {
          $rootScope.$apply(function () {
            translations[options.lng][key] = localize(key);
          });
        }
        t = localize;
        for (var key in translations) {
          setTranslation(key);
        }
        $rootScope.$broadcast('i18nextLanguageChange');
      });
    }
    function translate(key, options) {
      var lng = options.lng;
      if (!translations[lng]) {
        translations[lng] = {};
      }
      if (!t) {
        translations[lng][key] = key;
      } else {
        translations[lng][key] = t(key, options);
      }
    }
    function $i18nextTanslate(key, options) {
      var mergedOptions = angular.extend({}, optionsObj, options);
      translate(key, mergedOptions);
      return translations[mergedOptions.lng][key];
    }
    $i18nextTanslate.debugMsg = [];
    optionsObj = $i18nextTanslate.options = self.options;
    $rootScope.$watch(function () {
      return $i18nextTanslate.options;
    }, function (newOptions, oldOptions) {
      $i18nextTanslate.debugMsg.push('i18next options changed: \n', 'old options', oldOptions, 'new options', newOptions);
      optionsObj = $i18nextTanslate.options;
      if (!optionsObj.lng) {
        optionsObj.lng = 'dev';
      }
      init(optionsObj);
    }, true);
    init(optionsObj);
    return $i18nextTanslate;
  };
});
angular.module('jm.i18next').directive('ngI18next', [
  '$rootScope',
  '$i18next',
  '$interpolate',
  '$compile',
  '$parse',
  function ($rootScope, $i18next, $interpolate, $compile, $parse) {
    'use strict';
    function parse(scope, element, key) {
      var attr = 'text', attrs = [attr], string;
      if (key.indexOf('[') === 0) {
        var parts = key.split(']');
        key = parts[1];
        attr = parts[0].substr(1, parts[0].length - 1);
      }
      if (key.indexOf(';') === key.length - 1) {
        key = key.substr(0, key.length - 2);
      }
      if (attr.indexOf(':') >= 0) {
        attrs = attr.split(':');
        attr = attrs[0];
      } else if (attr === 'i18next') {
        attrs[1] = 'i18next';
        attr = 'text';
      }
      if (attr !== 'i18next' && attrs[1] !== 'i18next') {
        string = $i18next(key);
      } else {
        var options = {}, strippedKey = key;
        if (key.indexOf('(') >= 0 && key.indexOf(')') >= 0) {
          var keys = key.split(')');
          keys[0] = keys[0].substr(1, keys[0].length);
          options = $parse(keys[0])();
          strippedKey = keys[1];
        }
        string = $i18next(strippedKey, options);
      }
      if (attr === 'html') {
        element.html(string);
      } else if (attr === 'text') {
        element.text(string);
      } else {
        element.attr(attr, string);
      }
      $compile(element.contents())(scope);
    }
    function localize(scope, element, key) {
      if (key.indexOf(';') >= 0) {
        var keys = key.split(';');
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] !== '') {
            parse(scope, element, keys[i]);
          }
        }
      } else {
        parse(scope, element, key);
      }
    }
    return {
      restrict: 'A',
      scope: true,
      link: function postLink(scope, element, attrs) {
        function observe(value) {
          if (value === '') {
            scope.translationValue = element.text().replace(/^\s+|\s+$/g, '');
          } else {
            scope.translationValue = value;
          }
          if (!scope.translationValue) {
            return;
          }
          localize(scope.$parent, element, scope.translationValue);
        }
        attrs.$observe('ngI18next', observe);
        observe(attrs.ngI18next);
        scope.$on('i18nextLanguageChange', function () {
          localize(scope.$parent, element, scope.translationValue);
        });
      }
    };
  }
]);
angular.module('jm.i18next').filter('i18next', [
  '$parse',
  '$timeout',
  '$i18next',
  function ($parse, $timeout, $i18next) {
    'use strict';
    return function (string, options) {
      return $i18next(string, options);
    };
  }
]);