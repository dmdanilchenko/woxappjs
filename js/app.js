(function(){
	
    var app = angular.module('store',[]);
          
    app.controller('AppController', function($scope, $http){
		$scope.dataSets 					= [];
		$scope.searchField 					= '';
		$scope.addDataSetButtonVisible 		= false;
		$scope.choiceDataSetInputsVisible 	= true;
		
		$scope.setSortProp = function(sortBy, tableIndex) {
			var sortBy = sortBy;
			var sortOrder = $scope.dataSets[tableIndex].sortReverse;
			$scope.dataSets[tableIndex].sortType = sortBy; 
			$scope.dataSets[tableIndex].sortReverse = !sortOrder;
			$scope.dataSets[tableIndex].list.sort(function(a, b) {
			  if(a[sortBy] > b[sortBy]){
				  return sortOrder?1:-1;
			  }else{
				  return sortOrder?-1:1;
			  }
			});
			groupToPages($scope.dataSets[tableIndex]);
		}
		
		$scope.showCurrentRow = function(currentPage, rowIndex, tableIndex) {
			$scope.dataSets[tableIndex].currentRow = $scope.dataSets[tableIndex].pagedItems[currentPage][rowIndex];
		}
		$scope.getDataSet = function() {
			
			$scope.choiceDataSetInputsVisible 	= false;
			
			$http({
				method : "POST",
				url : "../backend/getDataSet.php",
				data:{'value':$scope.radioValue}
			}).then(function mySucces(response) {
				dataSet = parseData(response.data, $scope.dataSets.length);
				$scope.dataSets.push(dataSet);
				$scope.addDataSetButtonVisible 		= true;
			}, function myError(response) {
				alert(" Can't do because: " + response.statusText);
			});
			

		}
		  
		$scope.range = function (size, start, end, gap) {
			var ret = [];        
						  
			if (size < end) {
				end = size;
				start = size-gap;
			}
			for (var i = start; i < end; i++) {
				ret.push(i);
			}              
			return ret;
		};
		
		$scope.prevPage = function (tableIndex) {
			if ($scope.dataSets[tableIndex].currentPage > 0) {
				$scope.dataSets[tableIndex].currentPage--;
			}
		};
		
		$scope.nextPage = function (tableIndex) {
			if ($scope.dataSets[tableIndex].currentPage < $scope.dataSets[tableIndex].pagedItems.length - 1) {
				$scope.dataSets[tableIndex].currentPage++;
			}
		};
		
		$scope.setPage = function (tableIndex) {
			$scope.dataSets[tableIndex].currentPage = this.n;
		};
		
    });

	//dd 
	function parseData(data, index){
				
		var dataSet = {};
		dataSet.tableIndex   = index;
		dataSet.sortType     = 'id';
		dataSet.sortReverse  = false; 
		dataSet.currentPage  = 0;
		dataSet.list = [];
		
		var firstItem = data.splice(0, 1)
		dataSet.headers = firstItem[0];
		dataSet.columnsCount = data[0].length;
		
		for(var i=0; data.length>i;i++){
			var itemObj = {};
			var j = 0;
			for(key in dataSet.headers){
				var value = data[i][j];
				if((typeof value=="string")&&!isNaN(Number(value))){
					value = Number(value);
				}
				itemObj[key]=value;
				j++;
			}
			dataSet.list.push(itemObj);
			j = 0;
		}
		
		groupToPages(dataSet);
		return dataSet;
	}
	
	function groupToPages(dataSet) {
		dataSet.pagedItems = [];
		var filteredItems = dataSet.list;
		for (var i = 0; i < filteredItems.length; i++) {
			if (i % 50 === 0) {
				dataSet.pagedItems[Math.floor(i / 50)] = [ filteredItems[i] ];
			} else {
				dataSet.pagedItems[Math.floor(i / 50)].push(filteredItems[i]);
			}
		}
		
		dataSet.needPagination = dataSet.pagedItems.length>1?true:false;
		dataSet.gap = dataSet.pagedItems.length>5?5:dataSet.pagedItems.length;
	}
	
})();
