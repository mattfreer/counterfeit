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

})(chai.expect, describe, it, angular, sinon);
