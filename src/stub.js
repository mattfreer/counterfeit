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
