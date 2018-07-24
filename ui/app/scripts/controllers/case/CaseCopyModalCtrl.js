(function() {
    'use strict';
    angular.module('theHiveControllers').controller('CaseCopyModalCtrl', function($scope, CaseSrv, $uibModalInstance, caze) {
        $scope.caze = caze;
        $scope.loading = false;

        $scope.confirm = function() {
            $scope.loading = true;
            CaseSrv.copy({ 
                caze: $scope.caze,
                caseId: $scope.caze.id 
            })
            .$promise.then(function(response) {
                $uibModalInstance.close(response);                    
            })
            .catch(function(err) {
                $uibModalInstance.dismiss(err);
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
