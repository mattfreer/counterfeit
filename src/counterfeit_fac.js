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
