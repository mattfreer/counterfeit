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
})(chai.expect, describe, it, angular, sinon);
