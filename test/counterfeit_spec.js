(function(expect, describe, it, angular, sinon) {
  "use strict";

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

  describe('DeathStar', function() {
    var counterfeit, promise, deathStar;

    beforeEach(function() {
      module("counterfeit");
      module("starWars");

      module(function($provide) {
        $provide.decorator("DeflectorShield", function($delegate) {
          $delegate.reboot = counterfeit.stub(promise);
          return $delegate;
        });
      });

      inject(function(_counterfeit_) {
        counterfeit = _counterfeit_;
        promise = counterfeit.promise();
      })

      // DeathStar has to be injected after counterfeit and promise have
      // been setup to ensure that all the dependencies are available
      // for the decoration of DeflectorShield
      inject(function(DeathStar) {
        deathStar = DeathStar;
      });
    });

    describe("#rebootDeflectorShield", function() {
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
})(chai.expect, describe, it, angular, sinon);
