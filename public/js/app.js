

$(function(){
  $('#container').bind('touchmove',function(e){
    e.preventDefault();
  });
  $('#valuediv').touchtrack({
    range: 100,
    scale:.05,
    round:.2
  });
  
  $('#add').click(function(){
    var value=$('#value').val();
    var stamp = $('#stamp').val();
    console.log('add',value,stamp);
    svc.add(stamp,value,function(err){
      if (err){
        info(err.message);
      } else {
        info('observation added');
      }
    });
  });
  DNode.connect({reconnect:5000},function (remote) {
    svc=remote;
    //tryzing();
    console.log('about to get');
    svc.get(function(o){
      console.log('get called back',o)
      $('#obs').text(JSON.stringify(o,null,2));
      $('#obs').text(JSON.stringify({
        _id:o._id,
        length:o.values.length,
        '0':o.values[0],
        '-1':o.values[o.values.length-1]
        },null,2)
      );      
      info('get returned');
    })
  });
  //setInterval(tryzing,10000);
});

function info(msg){
  $('#console').append('<div>'+new Date().toISOString()+' '+msg+'</div>');
}

var svc=null; // this is the remote object
function tryzing(){
  if (svc) {
    var x = Math.round(new Date().getSeconds());
    info('calling zing');
    $('#zing-in').text(x);
    svc.zing(x,function (z) {
        console.log('zing called back',x,z)
        $('#zing-out').text(z);
        info('zing returned');
    });      
  } else {
    info('no remote object yet');
  }
}

