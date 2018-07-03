(function() {
    'use strict';
    angular.module('theHiveControllers')
        .controller('CaseReportCtrl', CaseReportCtrl);

        function CaseReportCtrl($uibModalInstance, $http, $q, CaseReportSrv, caze, tasks, observables) {            
            var self = this;

            this.caze = caze;
            console.log("CASE");
            console.log(caze);
            
            this.tasks = tasks;
            console.log("TASKS");
            console.log(this.tasks);

            this.observables = observables;
            console.log("OBSERVABLES");
            console.log(observables);

            this.download = function() {
                this.export();
                $uibModalInstance.close();
            };
            this.export = function() {
                var newline = {
                    text: "\n"
                }
                var docDefinition = {
                    content: [
                        {
                            text: "Case #" + caze.caseId + ": " + caze.title,
                            style: "header",
                            alignment: "center"
                        }, 
                        newline,
                        newline,
                        {
                            alignment: "justify",
                            columns: [
                                {
                                    text: "Owner: " + caze.owner
                                },
                                {
                                    text: "Status: " + caze.status
                                },
                                {
                                    text: "Severity: " + caze.severity
                                },
                                {
                                    text: "TLP: " + caze.tlp
                                }
                            ]
                        },
                        newline,
                        newline,
                        {
                            text: "Case Description: " + caze.description,
                            style: "subheader",
                            alignment: "center"
                        },
                        newline,
                        newline,
                        {
                            text: ""
                        }


                    ],
                    styles: {
                        header: {
                            fontSize: 22,
                            bold: true
                        },
                        subheader: {
                            fontSize: 16,
                            bold: true
                        }
                    },
                    defaultStyle: {
                        columnGap: 20
                    }
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
             };

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };

            this.taskLogs = function(taskId) {
                return CaseReportSrv.taskLogs(taskId);
            };

        }        
})();
