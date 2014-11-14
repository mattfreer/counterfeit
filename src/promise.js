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
