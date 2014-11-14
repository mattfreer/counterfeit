"use strict"

var counterfeit = angular.module("counterfeit", []);

counterfeit.factory("CounterfeitPromise", function() {
  var $timeout, $q;

  function CounterfeitPromise() {
    this._injectDependecies();
    this.reset();
  }

  // Public
  // ------------------------------
  CounterfeitPromise.prototype.resolve = function(value) {
    this._complete(this.deferred.resolve, value);
  };

  CounterfeitPromise.prototype.reject = function(value) {
    this._complete(this.deferred.reject, value);
  };

  CounterfeitPromise.prototype.notify = function(value) {
    this._complete(this.deferred.notify, value);
  };

  CounterfeitPromise.prototype.reset = function() {
    this.deferred = $q.defer();
    return this.deferred.promise;
  };
  // ------------------------------

  CounterfeitPromise.prototype._injectDependecies = function() {
    inject(function(_$q_, _$timeout_) {
      $q = _$q_;
      $timeout = _$timeout_;
    });
  };

  CounterfeitPromise.prototype._complete = function(fn, value) {
    $timeout(function(){fn(value);});
    $timeout.flush();
  };

  return {
    create: function () {
      return new CounterfeitPromise();
    }
  }
});

counterfeit.service("CounterfeitStub", function() {
  return {
    create: function(promise) {
      var p = promise.reset();

      return function() {
        return {
          $promise: p
        }
      };
    }
  };
});

counterfeit.factory("counterfeit", function(CounterfeitPromise, CounterfeitStub) {
  return {
    promise: function () {
      return CounterfeitPromise.create();
    },

    stub: function(promise) {
      return CounterfeitStub.create(promise);
    }
  }
});
