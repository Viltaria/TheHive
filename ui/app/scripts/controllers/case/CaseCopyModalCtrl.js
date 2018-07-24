(function() {
    'use strict';
    angular.module('theHiveControllers').controller('CaseCopyModalCtrl', function($q, $http, $scope, CaseSrv, $uibModalInstance, caze) {
        $scope.caze = caze;
        $scope.loading = false;

        $scope.confirm = function() {
            $scope.loading = true;

            var illegalTags = ['_type', 'updatedAt', 'stats', '_version', '_id', 'caseId', '_routing', 'id', 'createdAt', 'createdBy', '_parent', 'updatedBy'];

            for (var i = 0; i < illegalTags.length; i++) {
                delete $scope.caze[illegalTags[i]];
            }

            $http.post('./api/case', $scope.caze).then(function(response) {
                $uibModalInstance.close(response);
            }, function (error) {
                $uibModalInstance.dismiss(error);
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
