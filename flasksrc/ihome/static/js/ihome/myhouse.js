$(document).ready(function(){
    $(".auth-warn").show();
    $.ajax({
        url:'/user/myhouse_ever/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            if(data.code==200){
                $(".auth-warn").hide()
                for(var i=0;i<data.house.length;i++){
                    var li='<li><a href="/house/detail/?id='+data.house[i].id+
                    '/"><div class="house-title"><h3>房屋ID:'+data.house[i].id+
                    ' —— '+data.house[i].title+'</h3></div><div class="house-content"><img src="/static/media/'+
                    data.house[i].image+'"><div class="house-text"><ul><li>位于：'+data.house[i].address+
                    '</li><li>价格：￥'+data.house[i].price+'/晚</li><li>发布时间：'+data.house[i].create_time+'</li></ul></div></div></a></li>'
                    $('#houses-list').append(li)
                }

            }else{
                $("#houses-list").hide()
            }
        },error:function () {
            alert('something with wrong')
        }
    })
})

