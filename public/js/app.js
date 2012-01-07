

function showAddObs(){
  if (app.values && app.values.length>0){
    var v = Math.round(app.values[0].value/100)/10;
    $('#value').text(v);
  }
  
  $('body').css('background-position','50% 50%');
  $('.now input').hide();
  $('#stamp').val('');
  $('.now span').show();
  $('.addObs').show();
}

function hideAddObs(){
  $('body').css('background-position','');
  $('.now input').hide();
  $('.now span').show();
  $('.addObs').hide();
}

google.load('visualization', '1', {packages: ['corechart']});
function drawGraph(){
  if (!app.values) return;
  var values = app.values;
  
  var data = {
    cols: [
    {id: 'date', label: 'Date', type: 'date'},
    {id: 'power', label: 'Signal', type: 'number'}],
    rows: [/*{c:[{v: new Date("2011/06/21")}, {v: 7}]},*/]
  };
  if (values && values.length>0){
    for (var i=values.length-1;i>=0;i--){
      var value = values[i].value/1000;
      var stamp = new Date(Date.parse(values[i].stamp));
      data.rows.push({c:[{v: stamp}, {v: value}]});
    }
  }
  var datatable = new google.visualization.DataTable(data,0.6);
  var options = {
    title: 'im-w ',
    titleHeight: 32,
    logscale : false,
    //showRoller: true,
    //rollPeriod: 1,
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

$(function(){
  window.scrollTo(0,0);
  $('#container').bind('touchmove',function(e){
    e.preventDefault();
  });
  $('#value').touchtrack({
    range: 100,
    scale:.05,
    round:.2
  });


  hideAddObs();
  $('.addObsBtn').click(function(){
    showAddObs();    
  });
  $('#dygraph').click(function(){
    toggleRange();
  });
  $('.now').click(function(){
    $('#stamp').val('');
    $('.now span').hide();
    $('.now input').show().focus();
  });
  $('.cancel').click(function(){
    hideAddObs();
  });
  $('.add').click(function(){
    var value=$('#value').text();
    var stamp = $('#stamp').val();

    if (!stamp){
      stamp = new Date().toISOString();
    } else {
      var norm = new Date(Date.parse(stamp)).toISOString();
      if (norm=='Invalid Date'){
        info('Invalid Date');
        hideAddObs();
        return;
      }
      stamp=norm;
    }
    
    console.log('add',value,stamp);
    app.svc.add(stamp,value,function(err){
      if (err){
        info(err.message);
      } else {
        info('observation added');
      }
      hideAddObs();
      refreshData();
    });
  });
  DNode.connect({reconnect:5000},function (remote) {
    app.svc=remote; // global!
    refreshData();
  });
});

function info(msg){
  $('#console').append('<div>'+new Date().toISOString()+' '+msg+'</div>');
}


