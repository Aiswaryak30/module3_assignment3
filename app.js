(function(){
    'use strict';
    
    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)
    .directive('foundItems',FoundItems);

    function FoundItems(){
        var ddo={
            templateUrl:'MenuItems.html',
            scope:{
                foundItem:'<',
                onRemove:'&'
            }
        }
        return ddo;
    }

    NarrowItDownController.$inject=['MenuSearchService']
    function NarrowItDownController(MenuSearchService){
        var menu=this;
        menu.foundItem=""
        menu.searchTerm=""
        menu.getMatchedMenuItems=function(searchTerm){
           
            if(menu.searchTerm.length===0){
                menu.message="Nothing found!!";
    
            }
            else{
                var promise=MenuSearchService.getItems(searchTerm);
                promise.then(function(response){
                    if(response.length===0){
                        menu.message="Nothing found!!";
                    }
                    else{
                        menu.foundItem=response;
                    }
                       
                       
                })
                .catch(function(error){
                    console.log(error);
                }) 
            }
                 
            
                        
        }
        menu.removeItem=function(index){
            MenuSearchService.removeItem(index);
        }
    }

    MenuSearchService.$inject=['$http'];
    function MenuSearchService($http){
        var service=this;

        var found=[];
        service.getItems=function(item){
            
    found=[];
    var data={short_name:'short_name', name:'name' ,description:'description'}
    return $http({
        method:'GET',
        url: "https://davids-restaurant.herokuapp.com/menu_items.json",
        params:data
    })
    .then(function(response){
    var result=response.data.menu_items;
   
    item=item.charAt(0).toUpperCase();
    for(var i=0;i<result.length;i++){
      if(result[i].name.match(item)){
        found.push(result[i]);
      }   
    }
     return found;
    })
    .catch(function(error){
      console.log(error)
    })
      }
      service.removeItem=function(index){
        found.splice(index,1);
      }
    }
})();