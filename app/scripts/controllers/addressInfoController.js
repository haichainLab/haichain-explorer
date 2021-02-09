angular.module('ethExplorer')

    .controller('addressInfoCtrl', function ($rootScope, $scope, $location, $routeParams, $q) {

        var web3 = $rootScope.web3;

        $scope.init = function () {

            $scope.addressId = $routeParams.addressId;

            if ($scope.addressId !== undefined) {
                getAddressInfos().then(function (result) {
                    $scope.balance = result.balance;
                    $scope.balanceInEther = result.balanceInEther;
                });
            }


            function getAddressInfos() {
                var deferred = $q.defer();

                web3.eth.getBalance($scope.addressId, function (error, result) {
                    if (!error) {
                        deferred.resolve({
                            balance: result,
                            balanceInEther: web3.fromWei(result, 'ether')
                        });
                    } else {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            }


        };

        $scope.init();

        loading(1, $routeParams.addressId);


    });
var haiaddress;

function loading(pagenum, address) {
    // var address = "0x5583ae36fbbd066599b7972a0f265bbbba4d1ab5";
    if(address.substring(0, 2)!="0x"){
        address="0x"+address;
    }

    this.haiaddress = address;
    $.ajax({
        type: "get",
        url: "http://appapi.haicshop.com/api/haitranslist?address=" + address
            + "&page=" + pagenum + "&page_size=" + 10,
        dataType: "json",
        // data:{
        //     address:"0x5583ae36fbbd066599b7972a0f265bbbba4d1ab5",
        //     page:pagenum
        // },
        success: function (rlt) {
            /*totalData 总数据 totalPage 总页数*/
            /* pagenum == 1 的时候，才需要对分页插件进行初始化 */
            if (pagenum == 1) {
                paging(rlt.totalData, rlt.totalPage, pagenum);
            }
            /*数据渲染*/
            /*自定义的函数，可以根据自己的需求来写*/
            displayData(rlt.data);
        },
        error: function () {
            alert("管理员列表信息获取失败！");
        }
    });
}

function paging(totalData, totalPage, pagenum) {
    $('#box').paging({
        initPageNo: pagenum, // 初始页码
        totalPages: totalPage, //总页数
        totalCount: 'total ' + totalData + ' data', // 条目总数
        slideSpeed: 600, // 缓动速度 单位毫秒
        jump: true, //是否支持跳转
        callback: function (page) {
            // 回调函数
        }
    });
}

function JumpToPage(pagenum) {
    loading(pagenum, this.haiaddress);
}

function displayData(dataObj) {
    // var $tab1 = $("." + tableClass + "");
    var $tab1 = $("#txList");
    $("#txList tbody").html("");
    var tds = [];
    tds.push(getTD("Txn Hash"));
    tds.push(getTD("From"));
    tds.push(getTD("To"));
    tds.push(getTD("Contract"));
    tds.push(getTD("Value"));
    tds.push(getTD("Time"));
    $tab1.append(getTR(tds));

    for (i = 0; i < dataObj.length; i++) {
        var tds = [];
        var amount = 0;
        if(dataObj[i]['contract_address'] != "0x0000000000000000000000000000000000000000"){
            amount = dataObj[i]['amount'] / 1000000000000000000;
        }else{
            amount =dataObj[i]['amount'];
        }
        // console.log(dataObj[i]['from_token']);
        //<a href="/#/block/{{i.number}}">{{i.number}}</a>
        tds.push(getTD("<a href=\"/#/transaction/"+dataObj[i]['txid']+"\">"+stringMaxLength(dataObj[i]['txid'])+"</a>"));
        tds.push(getTD("<a href=\"/#/address/"+dataObj[i]['txfrom']+"\">"+stringMaxLength(dataObj[i]['txfrom'])+"</a>"));
        tds.push(getTD("<a href=\"/#/address/"+dataObj[i]['txto']+"\">"+stringMaxLength(dataObj[i]['txto'])+"</a>"));
        tds.push(getTD(dataObj[i]['contract_address']));
        tds.push(getTD(amount));
        tds.push(getTD(formatDateTime(dataObj[i]['block_create_time'])));
        $tab1.append(getTR(tds));

    }

}

function getTD(val) {

    var $tdName = $("<td></td>");
    $tdName.html(val);
    return $tdName

}

function getTR(tds) {

    var $tr = $("<tr></tr>");//
    $tr.append(tds);
    return $tr;

}

function stringMaxLength(val) {

    if (val.length > 11) {
        s = val.substring(0, 5) + "..." + val.substring(val.length - 6);
    } else {
        s = val;
    }
    return s;

}

function formatDateTime(inputTime) {

    if(inputTime.length == 10){
        var date = new Date(parseInt(inputTime) * 1000);
    }else if(inputTime.length == 13){
        var date = new Date(parseInt(inputTime));
    }

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
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};