(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    //set up test data 
    var motors=[{value:'all',name:'All Motors'},{value:'t0',name:'Motor 567'},{value:'t1',name:'Motor 8798'}];
    var positionSensors=[{value:'p0',name:'7 of 9'},{value:'p1',name:'B0rg'}];
    var key ={};
    key.COM001 = motors;
    key.COM002 = positionSensors;

    var symptomListItems= [
        {key:'D001',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D002',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D003',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D004',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D005',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D006',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D007',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D008',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D009',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D010',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D011',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D012',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D013',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D014',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D015',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D016',desc:'No observable motion at motor point',href:'#',filtervalues:['COM001','t0']},
        {key:'D017',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D018',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']},
        {key:'D019',desc:'The motor will draw excessive current',href:'#',filtervalues:['COM001','t1']},
        {key:'D020',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']}
    ];
    var numberShown = 10;

    var $listContainer = $("#listcontainer");

    function loadResults(data, startindex, endIndex){
        var listToShow = data;
        if(endIndex){
            listToShow = data.slice(startindex,endIndex);
        }
        var $symptomList =$(templates.linkList.render({listitems:listToShow}));
        if(startindex===0){
            $listContainer.empty();
            $listContainer.append($symptomList);
        }
        else{
            //get rid of ul
            var $children = $symptomList.children();
            $listContainer.find('ul').append($children);
        }
        
    }
    //load 10 to start
    loadResults(symptomListItems,0,numberShown);
    
    //add search filter
    $listContainer.btsListFilter('#listSearch', 
        {
            itemEl:'.link-list-item', 
            itemChild: '.item-details',
            itemFilter: function(item, val) {
                //val = val.replace(new RegExp("^[.]$|[\[\]|()*]",'g'),'');
                //val = val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                var $item = $(item);
                //check both items 
                var text1 = $item.find('.item-key').text();
                var text2 = $item.find('.item-desc').text();
                val = val && val.replace(new RegExp("[({[^.$*+?\\\]})]","g"),'');
                
                var regSearch = new RegExp(val,'ig');


                return  regSearch.test( text1 ) || regSearch.test( text2 );
            }
        }
    );
    //load more button
    var increment = 5;
    $("#loadMore").on("click", function(){
        loadResults(symptomListItems,numberShown,numberShown+increment);
        numberShown+=increment;
    });

    $("#showAll").on("click", function(){
        loadResults(symptomListItems,0);
    });

    //for the filters
    var contextId= 'context-select';
    $('#component-type').on('change',function(){
        var $selector = $(this);
        var selectedValue = this.value;
        $('#'+contextId).remove();
        console.log('Selected '+ selectedValue);
        if(key.hasOwnProperty(selectedValue)){
            var $contextSelect = $(templates.select.render({id:contextId,label:'Component name',options:key[selectedValue]}));
            $contextSelect.insertAfter($selector);
        }
        
    });
  });

})(jQuery, window, document);
