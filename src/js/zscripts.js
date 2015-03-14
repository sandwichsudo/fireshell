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
        {key:'D003',desc:'Bent teeth and cracks in the tooth root filets',href:'#',filtervalues:['COM002','p0']}
    ];

    //load full list on load
    var $symptomList =$(templates.linkList.render({listitems:symptomListItems}));
    var $listContainer = $("#listcontainer");
    $listContainer.append($symptomList);
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
