(function() {
    'use strict';
    angular.module('theHiveServices').service('RemedyTemplateSrv', function($q, $http) {
        this.list = function() {
            var defer = $q.defer();
            $http.post('./api/remedy/template/_search', {}, {
                params: {
                    range: 'all'
                }
            }).then(function(response) {
                defer.resolve(response.data);
            }, function(err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        this.get = function(id) {
            var defer = $q.defer();
            $http.get('./api/remedy/template/' + id).then(function(response) {
                defer.resolve(response.data);
            }, function(err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        this.delete = function(id) {
            return $http.delete('./api/remedy/template/' + id);
        };

        this.create = function(template) {
            return $http.post('./api/remedy/template', template);
        }

        this.update = function(id, template) {
            return $http.patch('./api/remedy/template/' + id, template);
        }
    });
})();
