# Counterfeit

[![Build Status](https://travis-ci.org/mattfreer/counterfeit.svg?branch=master)](https://travis-ci.org/mattfreer/counterfeit)
[![npm version](https://badge.fury.io/js/counterfeit.svg)](http://badge.fury.io/js/counterfeit)

Counterfeit is an AngularJS module, that provides test doubles for
asynchronous promises.

This library facilitates the stubbing of functions that return
promises. Providing users with easy access to resolve/reject fake
promises.

## Installation

Install the module via npm

```bash
$ npm install counterfeit --save-dev
```

If you are using the [Karma](http://karma-runner.github.io) test runner
then you will need to add counterfeit to the files list in your Karma
configuration:

```javascript
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/counterfeit/dist/counterfeit.js'
    ],

    ...
  });
}

```

## Example Usage

To demonstrate how `counterfeit` can be used to facilitate testing,
consider the following AngularJS module called `starWars`:

```javascript
var starWars = angular.module("starWars", ["ngResource"]);

starWars.service('DeflectorShield', function($resource) {
  return $resource({}, null, {
    "reboot": {
      method: "PUT",
      url: "/starwars/deflector_shield/reboot"
    }
  });
});

starWars.factory('DeathStar', function(DeflectorShield) {
  var status, shieldStatus;

  shieldStatus = function(msg) {
    status = msg;
  };

  return {
    rebootDeflectorShield: function() {
      DeflectorShield.reboot().$promise.then(
        shieldStatus, shieldStatus, shieldStatus);
    },

    shieldStatus: function() {
      return status;
    },
  }
});
```

As can be seen the `DeathStar` factory uses the `DeflectorShield`
service, that exposes one public method called `reboot`. This method
returns a promise. This presents a challenge for the testing of the
`DeathStar` factory because the `rebootDeflectorShield` method relies
upon an asynchronous operation that returns a promise.

In order to test the functionality of `DeathStar.rebootDeflectorShield`
we need a way of controlling when the promise returned from
`DeflectorShield.reboot` is resolved/rejected. This is where
`counterfeit` comes into play.

The following `DeathStar` test (using [mocha](https://github.com/mochajs/mocha),
[chai](http://chaijs.com) and [sinon](http://sinonjs.org)) is setup to
decorate the `DeflectorShield` service so that the `reboot` method is a
`CounterfeitStub`. This stub is configured to return a
`CounterfeitPromise`, which can be conveniently resolved within the
test, allowing assertions to be made against `DeathStar` behaviour that
is asynchronous.

```javascript

describe('DeathStar', function() {
  var promise, deathStar;

  beforeEach(function() {
    module("counterfeit");
    module("starWars");

    module(function($provide) {
      $provide.decorator("DeflectorShield", function($delegate, counterfeit) {
        promise = counterfeit.promise();
        $delegate.reboot = counterfeit.stub(promise);
        return $delegate;
      });
    });

    inject(function(DeathStar) {
      deathStar = DeathStar;
    });
  });

  describe("#rebootDeflectorShield", function() {
    describe("when reboot in progress", function() {
      it("sets shield status", function() {
        deathStar.rebootDeflectorShield();
        promise.notify("Shield rebooting");
        expect(deathStar.shieldStatus()).to.eql("Shield rebooting");
      });
    });

    describe("when successfully rebooted", function() {
      it("sets shield status", function() {
        deathStar.rebootDeflectorShield();
        promise.resolve("All systems are operational");
        expect(deathStar.shieldStatus()).to.eql("All systems are operational");
      });
    });

    describe("when reboot fails", function() {
      it("sets shield status", function() {
        deathStar.rebootDeflectorShield();
        promise.reject("Shield malfunction");
        expect(deathStar.shieldStatus()).to.eql("Shield malfunction");
      });
    });
  });
});
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License
This project rocks and uses MIT-LICENSE.
