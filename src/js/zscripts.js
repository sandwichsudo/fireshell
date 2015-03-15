(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    //set up test data 
    var motors=[{value:'',name:' all Motors'},{value:'t0',name:'Motor 567'},{value:'t1',name:'Motor 8798'}];
    var positionSensors=[{value:'',name:' all Position Sensors'},{value:'p0',name:'7 of 9'},{value:'p1',name:'B0rg'}];
    var key ={};
    key.COM001 = motors;
    key.COM002 = positionSensors;

    var symptomListItems= [
        {key:'D001',desc:'No observable motion at motor point',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D002',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D003',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D004',desc:'No observable motion at your face',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D005',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D006',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D007',desc:'No observable motion at other point',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D008',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D009',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D010',desc:'No observable motion at motor point',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D011',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D012',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D013',desc:'No observable motion at motor point',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D014',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D015',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D016',desc:'No observable motion at motor point',href:'#',componentType:'COM001',componentName:'t0'},
        {key:'D017',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D018',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'},
        {key:'D019',desc:'The motor will draw excessive current',href:'#',componentType:'COM001',componentName:'t1'},
        {key:'D020',desc:'Bent teeth and cracks in the tooth root filets',href:'#',componentType:'COM002',componentName:'p0'}
    ];
    var numberShown = 10;

    var $listContainer = $("#listcontainer");
    var $componentType=$('#component-type');
    var contextId= 'context-select';
  
    var searchInputSelector ='#listSearch';
    var $searchInput=$(searchInputSelector);
    var pageSize=10;
    var $listSize = $("#pageSize");
    var $resultCount = $("#resultsCount");
    var componentTypeNameId="componentTypePlayback";
    var componentNameId="componentNamePlayback";
    var $filterContainer = $("#filters").hide();
    
    /*
        From the data, append the results to the list
    */
    function loadResults(data, append){
        var listToShow = data;
        var $symptomList =$(templates.linkList.render({listitems:listToShow}));
        if(!append){
            $listContainer.empty();
            $listContainer.append($symptomList);
        }
        else{
            //get rid of ul
            var $children = $symptomList.children();
            $listContainer.find('ul').append($children);
        }
        $listSize.text($listContainer.find('ul').children().length);
        
        var $list = $listContainer.find('ul');
        //add search filter
        $list.btsListFilter(searchInputSelector, 
            {
                itemEl:'.link-list-item', 
                itemChild: '.item-details',
                resetOnBlur: false,
                sourceTmpl: '<li class="link-list-item" data-filtervalues={filtervalues}><a href="{href}" class="link-wrap"><dl class="item-details"><dt class="item-key badge">{key}</dt><dd class="item-desc">{desc}</dd></dl><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"><span class="sr-only">Go to {desc}</span></span></a></li>',
                sourceData: function(text, callback) {
                    var searchTerm = $searchInput.val();

                    //get filtered data
                    var searchResults = getFilteredJson(getFilterValues(), searchTerm,0, pageSize);
                    $resultCount.text(searchResults.totalResults);
                    $listSize.text(searchResults.results.length);
                   callback(searchResults.results);
                }
            }
        );
        //if the search bar is empty, reset the results with the current filters
        //as we need to make the count correct and i no londer know how many there
        //where at the start
        $(searchInputSelector).on('keyup',function(e){
            if(this.value===''){
                doSearch(0,false);
            }
        });
    }
    /*Apply simple string match for record and ID*/
    function stringMatchRecord(record,val){
        var text1 = record.key;
        var text2 = record.desc;
        val = val && val.replace(new RegExp("[({[^.$*+?\\\]})]","g"),'');

        var regSearch = new RegExp(val,'ig');


        return  regSearch.test( text1 ) || regSearch.test( text2 );
    }

    /*Get Filter values*/
    function getFilterValues(record,val){
        var componentType = $componentType[0].value;
        var componentName = $('#'+contextId)[0] ? $('#'+contextId)[0].value : "";
        var filters = [{key:'componentName',value:componentName},{key:'componentType',value:componentType}];
        return filters;
    }
    /*Get the filter values and perform a search. then load the data*/
    function doSearch(pageNumber, append){
        var searchTerm = $searchInput.val();
        var filteredData = getFilteredJson(getFilterValues(), searchTerm, pageNumber, pageSize);
        $resultCount.text(filteredData.totalResults);
        loadResults(filteredData.results, append);
        return filteredData;
    }
    /*
        Takes in filters and number of results required and returns the filtered data
    */

    function getFilteredJson(filterValues, searchTerm, pageNumber,pageSize){
         

        function applyFilters(data, filters){
            var filteredItems = data;
            for (var i = filters.length - 1; i >= 0; i--) {
                var currentFilter = filters[i];
                var filterName = currentFilter.key;
                var filterValue = currentFilter.value;
                if(filterValue){
                     for (var j = filteredItems.length - 1; j >= 0; j--) {
                        var record = filteredItems[j];
                        if(record.hasOwnProperty(filterName)){
                            if(record[filterName] != filterValue){
                                //remove that record
                                filteredItems.splice(j,1);
                            }
                        }
                        else{
                            //remove that record
                            filteredItems.splice(j,1);

                        }
                    };
                }
               
            };
            return filteredItems;
        }

        function applySearchTerm(data, searchTerm){
            var filteredItems = data;
            if(searchTerm){
                for (var i = filteredItems.length - 1; i >= 0; i--) {
                    var record = filteredItems[i];
                    if(!stringMatchRecord(record,searchTerm)){
                        //remove that record
                        filteredItems.splice(i,1);
                       
                    }
                        
                };
            }
            return filteredItems;
        }
        //shallow copy data before removing elements
        var filteredItems = applyFilters(symptomListItems.slice(),filterValues);
        //remove those which do not match the searchTerm
        filteredItems = applySearchTerm(filteredItems.slice(),searchTerm);
       
        //return appropriate number of items
        //first page is page 0
        //if page size is -1 load all the pages
        var resultsToReturn;
        if(pageSize===-1){
            resultsToReturn=filteredItems;
        }
        else{
            resultsToReturn = filteredItems.slice(pageNumber*pageSize, (pageNumber*pageSize)+pageSize);
        }
        return {results:resultsToReturn,totalResults:filteredItems.length};
    }
    //load 10 to start
    var filteredData =doSearch(0,false);
    $resultCount.text(filteredData.totalResults);
        //load more button
    var currentPage = 0;
    $("#loadMore").on("click", function(){
        currentPage++;
        doSearch(currentPage,true);
    });

    $("#showAll").on("click", function(){
        doSearch(-1,false);
    });

    function resetFilter($selector){
        //set filter back to default
        $selector.val("");
        //trigger change to update results
        $selector.change();
    }

    function updateFilterInfo($selector,playbackId){
        
        
        var selectedOptionVal="";
        if($selector){
             var $selectedOption = $selector.find('option').filter(function(index,el){
                return el.selected;
            });
            var selectedOptionText = $selectedOption.text();
            selectedOptionVal=$selectedOption.val();
        }
       
        
        if(selectedOptionVal!==""){
             //show a button
            var $replacement = $(templates.removeFilterButton.render({id:playbackId,text:selectedOptionText}));
            $replacement.on('click',function(e){
                resetFilter($selector);
            });
            var $button= $("#"+playbackId);
            if($button.length===0){
                $filterContainer.append($replacement);
            }
            else{
                $button.replaceWith( $replacement);
            }
            
            $filterContainer.show();
        }
        else{
            $("#"+playbackId).remove();
            if($filterContainer.children().length===1){
                $filterContainer.hide();
            }
        }
        
    }

    //for the filters

    $componentType.on('change',function(){
        var $selector = $(this);
        var selectedValue = this.value; 

        $('#'+contextId).parent().remove();
        updateFilterInfo($selector,componentTypeNameId,false);
        //update displayed data
        doSearch(0);
        //update ui
        if(selectedValue){
            
            if(key.hasOwnProperty(selectedValue)){
                var $contextSelectComponent = $(templates.select.render({id:contextId,label:'Component name',options:key[selectedValue]}));
                $contextSelectComponent.insertAfter($selector,componentNameId);
                var $contextSelect=$contextSelectComponent.find('select');
                updateFilterInfo($contextSelect,componentNameId,true);
                

                $contextSelect.on("change",function(e){
                    updateFilterInfo($(this),componentNameId,true);
                    doSearch(0);
                });
            }
        }
        else{
            $("#"+contextId).remove();
            updateFilterInfo(null,componentNameId,true);
        }
        
       
        console.log('Selected '+ selectedValue);
        
        
    });
  });

})(jQuery, window, document);
