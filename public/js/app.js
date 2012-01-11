
function hideURLBar(){
  window.scrollTo(0,0);
}
function resetAddObs(){
  if (app.values && app.values.length>0){
    var v = Math.round(app.values[0].value/100)/10;
    $('#value').text(v);
  }
}

function showAddObs(){
  //info('showAddObs: '+$('body').css('background-position'));
  resetAddObs();
  $('.now input').hide();
  $('#stamp').val('');
  $('.now span').show();
  
  // display:none/block and opactity animation need attention
  // set display:block now, opacity:1 in nextTick
  $('.addObs .activeControls').css({display:''});
  setTimeout(function(){
    $('.addObs').addClass('showing');
    $('body').css('background-position','50% 50%');
  },0);
}

function hideAddObs(){
  //info('hideAddObs: '+$('body').css('background-position'));  
  $('body').css('background-position','');
  $('.addObs').removeClass('showing');
  // display:none after opacity animation done
  setTimeout(function(){
    $('.addObs .activeControls').css({display:'none'});
  },1000);
  setTimeout(function(){ // timing on this is not understood
    hideURLBar();
  },1500);
  $('.now input').hide();
  $('.now span').show();
}

google.load('visualization', '1', {packages: ['corechart']});
function drawGraph(){
  if (!app.values) return;
  var values = app.values;
  
  var data = {
    cols: [
    {id: 'date', label: 'Date', type: 'date'},
    {id: 'weight', label: 'Weight', type: 'number'}
    //,{id: 'sigma', label: 'Error', type: 'number'}
    ],
    rows: [/*{c:[{v: new Date("2011/06/21")}, {v: 7}]},*/]
  };
  if (values && values.length>0){
    for (var i=values.length-1;i>=0;i--){
      var value = values[i].value/1000;
      var stamp = new Date(Date.parse(values[i].stamp));
      data.rows.push({c:[{v: stamp}, {v: value}]});
      // data.rows.push({c:[{v: stamp}, {v: value}, {v: 1}]});
    }
  }
  var datatable = new google.visualization.DataTable(data,0.6);
  var options = {
    title: 'im-w ',
    titleHeight: 32,
    logscale : false,

    //showRoller: true, // allows controlling roller
    // rollPeriod: 30, // ok depends on scale

    //rollPeriod: 3,
    // errorBars: true, requires sigma column

    // gridLineColor: '#FF0000',
    // highlightCircleSize: 10,
    strokeWidth: 2,

    axisLabelColor: 'gray',
    
    colors:['rgb(128,128,255)'],
    // axis:{
    //   'weight':{axisLabelWidth:20}
    // },
    // axisLineColor: 'blue',
    // drawXGrid: false,
    // drawYGrid: false,
    // axisLabelWidth:100, // doesn't seem to do anything
    yAxisLabelWidth:25
    
    // for touch stuff later...
    //interactionModel: interactionModel
  };
  globalG=new Dygraph.GVizChart(document.getElementById('dygraph'));
  globalG.draw(datatable,options);
}

function toggleRange(desiredDays){
  if (!app.values) return;
  var values = app.values;

  // all math in unix_ts
  var now = new Date-0;
  var oldest = Date.parse(values[values.length-1].stamp);
  
  var day=1000*60*60*24; // in ms
  maxDays = Math.round((now-oldest)/day);

  var g=globalG.date_graph;
  var xR = g.xAxisRange();
  if (!desiredDays){
    var current=Math.round((xR[1]-xR[0])/day);
    console.log('current range',current);
    // $.each([30,90,365,730,max],function(i,days){    
    if (current<30){
      desiredDays=30;
    } else if (current<90){
      desiredDays=90;
    } else if (current<180){
      desiredDays=180;
    } else if (current<365){
      desiredDays=365;
    } else if (current<730){
      desiredDays=730;
    } else if (current<maxDays) {
      desiredDays=maxDays;
    } else {
      desiredDays=30;
    }
  }
  console.log('desired range',desiredDays);

  if(1) g.updateOptions({
    dateWindow: [now-desiredDays*day,now],
    title:'im-w '+desiredDays+'d'
  });
  
}
function printGraph(){
  if (!app.values) return;
  var values = app.values;
  $('#obs').text('');
  $.each(values,function(i,v){
    if (i>2 && i<values.length-2) return;
    $('#obs').append(v.stamp+' '+v.value/1000+'\n');
  });
}

var app = {
  svc:null,
  values:null
}

function refreshData(){
  // console.log('about to get');
  if (!app.svc) return;
  app.svc.get(function(err,o){
    if (err){
      console.log('svc.get::error',error);
      rerturn;
    }
    info('refreshed data');
    app.values = o.values;

    drawGraph();
    //printGraph();

  });
}

function addObs(cb){ // cb(err,msgok)
  var value=$('#value').text();
  var stamp = $('#stamp').val();

  if (!stamp){
    stamp = new Date().toISOString();
  } else {
    var norm = new Date(Date.parse(stamp)).toISOString();
    if (norm=='Invalid Date'){
      cb({message:'Invalid Date'});
      return;
    }
    stamp=norm;
  }
  
  console.log('add',value,stamp);
  app.svc.add(stamp,value,cb);
}

$(function(){
  hideURLBar();
  //setInterval(hideURLBar,1000);
  $('html').bind('touchmove',function(e){
    e.preventDefault();
  });
  // be more specific ?
  $value = $('#value');
  $('.arctouch').arctouch({
    getter:function(){
      return $('#value').text()/1;
    },
    setter:function(initialValue,delta01){
      //console.log('setter',initialValue,delta01,value,typeof value);
      value = Math.round((initialValue+delta01*2)*10)/10;
      if ($value.text()==value) return;
      $value.text(value);
    }
  });
  $('#value').touchtrack({
    range: 100,
    scale:.05,
    round:.2
  });


  hideAddObs();
  $('#dygraph').click(function(){
    toggleRange();
  });
  $('.now').click(function(){
    $('#stamp').val('');
    $('.now span').hide();
    $('.now input').show().focus();
  });
  $('.now input').blur(hideURLBar);
  if(0)$('.now input').change(function(){
    setTimeout(function(){
      hideURLBar();    
    },1000);
  });
  
  $('.cancelObsBtn').click(function(){
    hideAddObs();
  });
  $('.resetObsBtn').click(function(){
    resetAddObs();
  });
  $('.addObsBtn').click(function(){
    if ($('.addObs').hasClass('showing')){
      addObs(function(err,nullexpected){
        if (err){
          info(err.message);
        } else {
          info('observation added');
        }
        hideAddObs();
        refreshData();
      });
    } else {
      showAddObs();    
    }
    return;
  });
  DNode.connect({reconnect:5000},function (remote) {
    app.svc=remote; // global!
    refreshData();
  });
});

function info(msg,clear){
  if(clear) $('#console').html('');
  $('#console').append('<div>'+new Date().toISOString()+' '+msg+'</div>');
}


