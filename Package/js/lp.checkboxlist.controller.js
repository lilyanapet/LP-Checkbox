angular.module("umbraco")
    .controller("LP.Checkbox.Controller",
        function ($scope, $http, $routeParams) {
            var newItems = [];
            $scope.selectedItems = [];
            $scope.selectedItemsSortOrder = [];
            var items = function () {
                return $http.get($scope.model.config.apiUrl, { params: { id: $routeParams.id } })
                    .then(function (data) {
                        $scope.items = data;
                        for (var i = 0; i < $scope.items.data.length; i++) {
                            newItems.push({ id: $scope.items.data[i].id, value: $scope.items.data[i].name });
                        }
                        $scope.items = newItems;
                    });
            }
            items()
                .then(function () {
                    $scope.$on("formSubmitting",
                        function (ev, args) {

                            var selectedItems = [];
                            angular.forEach($scope.selectedItems,
                                function (value, key) {
                                    var itemSelected = value.selected;
                                    if (itemSelected === true) {
                                        selectedItems.push({
                                            value: value.key,
                                            name: value.val,
                                            sortOrder: value.sortOrder,
                                            selected: value.selected
                                        });
                                    }
                                });
                            $scope.model.value = selectedItems;
                        });

                    function setupViewModel() {
                        if ($scope.model.value === null || $scope.model.value === undefined) {
                            $scope.model.value = [];
                        }
                        var sortOrder = 1;
                        for (var i = 0; i < $scope.items.length; i++) {

                            var isSelected = false;
                            if ($scope.model.value !== null && $scope.model.value !== undefined && $scope.model.value !== [] ) {
                                for (var k = 0; k < $scope.model.value.length; k++) {
                                    if ($scope.model.value[k].value.toString() === $scope.items[i].id.toString()) {
                                      
                                        sortOrder = $scope.model.value[k].sortOrder;
                                        isSelected = true;
                                        break;
                                    }
                                }
                            }

                            $scope.selectedItems.push({
                                selected: isSelected,
                                sortOrder: sortOrder,
                                key: $scope.items[i].id,
                                val: $scope.items[i].value
                            });
                            sortOrder++;
                        }
                    }

                    setupViewModel();

                    $scope.$watch("selectedItems",
                        function (newVal, oldVal) {
                            $scope.model.value = [];

                            for (var x = 0; x < $scope.selectedItems.length; x++) {
                                if ($scope.selectedItems[x].selected) {
                                    $scope.model.value.push({
                                        selected: $scope.selectedItems[x].selected,
                                        value: $scope.selectedItems[x].key,
                                        name: $scope.selectedItems[x].value,
                                        sortOrder: $scope.selectedItems[x].sortOrder
                                    });
                                }
                            }
                        },
                        true);


                    $scope.model.onValueChanged = function (newVal, oldVal) {

                        setupViewModel();
                    };
                });
        });