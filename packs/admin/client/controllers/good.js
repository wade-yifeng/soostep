/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin');

app.controller('Good', function ($scope, $http, $route, Upload) {
    document.title = 'Goods Management';

    $http.get('/goodCategories').success(function (result) {
        commonGetPagedGoods(1);
        toggleCreateUpdate(false);
        $scope.goodCategories = result;
    });

    $scope.getPagedGoods = function (page) {
        commonGetPagedGoods(page);
    };

    $scope.editGood = function (_id) {
        $http.get('/goods/' + _id).success(function (result) {
            if (!result.code) {
                $scope.good = result;
                toggleCreateUpdate(true);
                $('#editForm').addClass('animated bounceInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $('#editForm').removeClass('animated bounceInUp')
                });
            }
        });
    };

    $scope.cancelEdit = function () {
        toggleCreateUpdate(false);
    };

    $scope.saveGood = function (good) {
        var res = window.ValidateGood(good);
        if (res.isValid()) {
            if (!$scope.isUpdate) {
                $http.post('/goods', good).success(function (result) {
                    if (!result.code) {
                        showInfo('商品创建成功');
                        $('div.alert').hide();

                        //新建成功跳到新商品所在页
                        $scope.pages.current = Math.ceil(($scope.goodsTotal + 1) / $scope.pages.limit);
                        commonGetPagedGoods($scope.pages.current);
                        $scope.good = {pics: []};
                    }
                });
            }
            else {
                $http.put('/goods/' + good._id, good).success(function (result) {
                    if (result.code == 0) {
                        showInfo('商品更新成功');
                        commonGetPagedGoods($scope.pages.current);
                        toggleCreateUpdate(false);
                    }
                });
            }
        }
        else {
            showValidationResult(res.msgs);
        }
    };

    $scope.deleteGood = function (_id) {
        showConfirm('确定要删除商品吗?');
        $scope.entityToOperate = _id;
    };

    $scope.confirmOperation = function (_id) {
        $http.delete('/goods/' + _id).success(function (result) {
            if (result.code == 0) {
                //删除当页最后一条后跳到前一页
                if ((($scope.goodsTotal - 1) % 10 == 0) && !$scope.pages.hasNext) {
                    $scope.pages.current -= 1;
                }
                commonGetPagedGoods($scope.pages.current);
            }
        });
    };

    $scope.uploadFiles = function (files) {
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: '/pics',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $scope.good.pics.push(response.data);
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        });
    };

    $scope.deleteFile = function (file) {
        $http.delete('/pics/' + file).success(function (result) {
            if (result.code == 0) {
                $scope.good.pics.splice($scope.good.pics.indexOf(file), 1);
            }
        })
    };

    var commonGetPagedGoods = function (page) {
        $http.get('/goodsPaged?page=' + page).success(function (result) {
            if (!result.code) {
                $scope.goods = [];
                $scope.goods.push.apply($scope.goods, result.data);
                $scope.pages = result.pages;
                $scope.pageArray = getPageArray(result.pages.current, result.pages.total);
                $scope.goodsTotal = result.items.total;
            }
        });
    };

    var getPageArray = function (current, total) {
        var start = current > 5 ? current - 4 : 1;
        var end = total - current > 3 ? current + 4 : total;
        return _.range(start, end + 1);
    };

    var toggleCreateUpdate = function (isUpdate) {
        $('div.alert').hide();
        $scope.isUpdate = isUpdate;
        $scope.buttonName = isUpdate ? '提交编辑' : '新建商品';
        if (!isUpdate) {
            $scope.good = {pics: []};

            //测试用数据
            $scope.good = {
                name: '草莓',
                desc: '描述',
                category: 'Berry',
                pics: [],
                spec: '1kg',
                provenance: '上海',
                shelfLife: 1,
                storage: '阴凉',
                price: 10,
                sales: 0,
                balance: 120
            };
        }
    };
});