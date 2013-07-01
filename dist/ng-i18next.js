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
            translations[key] = localize(key);
          });
        }
        t = localize;
        for (var key in translations) {
          setTranslation(key);
        }
        $rootScope.$broadcast('i18nextLanguageChange');
      });
    }
    function translate(key) {
      if (!t) {
        translations[key] = key;
      } else {
        translations[key] = t(key);
      }
    }
    function $i18nextTanslate(key) {
      translate(key);
      return translations[key];
    }
    optionsObj = $i18nextTanslate.options = self.options;
    $rootScope.$watch(function () {
      return $i18nextTanslate.options;
    }, function (newOptions, oldOptions) {
      console.log('i18next options changed: \n', 'old options', oldOptions, 'new options', newOptions);
      optionsObj = $i18nextTanslate.options;
      init(optionsObj);
    }, true);
    return $i18nextTanslate;
  };
});
angular.module('jm.i18next').directive('ngI18next', [
  '$rootScope',
  '$i18next',
  '$interpolate',
  '$compile',
  function ($rootScope, $i18next, $interpolate, $compile) {
    'use strict';
    function parse(scope, element, key) {
      var attr = 'text';
      if (key.indexOf('[') === 0) {
        var parts = key.split(']');
        key = parts[1];
        attr = parts[0].substr(1, parts[0].length - 1);
      }
      if (key.indexOf(';') === key.length - 1) {
        key = key.substr(0, key.length - 2);
      }
      var string = $i18next(key);
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
        attrs.$observe('ngI18next', function (value) {
          if (value === '') {
            scope.translationValue = element.text().replace(/^\s+|\s+$/g, '');
          } else {
            scope.translationValue = value;
          }
          if (!scope.translationValue) {
            return;
          }
          localize(scope.$parent, element, scope.translationValue);
        });
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
    return function (string) {
      return $i18next(string);
    };
  }
]);