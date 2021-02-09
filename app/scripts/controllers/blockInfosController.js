angular.module('ethExplorer')
    .controller('blockInfosCtrl', function ($rootScope, $scope, $location, $routeParams, $q) {

        var web3 = $rootScope.web3;

        $scope.init = function () {

            $scope.blockId = $routeParams.blockId;

            if ($scope.blockId !== undefined) {

                getBlockInfos()
                    .then(function (result) {
                        var number = web3.eth.blockNumber;

                        $scope.result = result;

                        if (result.hash !== undefined) {
                            $scope.hash = result.hash;
                        } else {
                            $scope.hash = 'pending';
                        }
                        if (result.miner !== undefined) {
                            $scope.miner = result.miner;
                        } else {
                            $scope.miner = 'pending';
                        }
                        $scope.gasLimit = result.gasLimit;
                        $scope.gasUsed = result.gasUsed;
                        $scope.nonce = result.nonce;
                        $scope.difficulty = ("" + result.difficulty).replace(/['"]+/g, '');
                        $scope.gasLimit = result.gasLimit; // that's a string
                        $scope.nonce = result.nonce;
                        $scope.number = result.number;
                        $scope.parentHash = result.parentHash;
                        $scope.blockNumber = result.number;
                        $scope.timestamp = formatDateTime(result.timestamp);
                        $scope.extraData = result.extraData;
                        $scope.dataFromHex = hex2a(result.extraData);
                        $scope.size = result.size;
                        if ($scope.blockNumber !== undefined) {
                            $scope.conf = number - $scope.blockNumber + " Confirmations";
                            if ($scope.conf === 0 + " Confirmations") {
                                $scope.conf = 'Unconfirmed';
                            }
                        }
                        if ($scope.blockNumber !== undefined) {
                            var info = web3.eth.getBlock($scope.blockNumber);
                            if (info !== undefined) {
                                var newDate = new Date();
                                newDate.setTime(info.timestamp * 1000);
                                $scope.time = newDate.toUTCString();
                            }
                        }


                    });

            } else {
                $location.path("/");
            }


            function getBlockInfos() {
                var deferred = $q.defer();

                web3.eth.getBlock($scope.blockId, function (error, result) {
                    if (!error) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }


        };
        $scope.init();

        // parse transactions
        $scope.transactions = []
        web3.eth.getBlockTransactionCount($scope.blockId, function (error, result) {
            var txCount = result

            for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                web3.eth.getTransactionFromBlock($scope.blockId, blockIdx, function (error, result) {

                    var transaction = {
                        id: result.hash,
                        hash: result.hash,
                        from: result.from,
                        to: result.to,
                        gas: result.gas,
                        input: result.input,
                        value: result.value
                    }
                    $scope.$apply(
                        $scope.transactions.push(transaction)
                    )
                })
            }
        })


        function hex2a(hexx) {
            var hex = hexx.toString();//force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str.replace("geth","haic");
        }


        function formatDateTime(inputTime) {
            var date = new Date(parseInt(inputTime) * 1000);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        }
    });
