function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function booking_info(){
    // 获取当前房源id
    var id=location.search.split('=')[1]
    var id=parseInt(id)
    $.ajax({
        url:'/order/orders_info/'+id+'/',
        type:'GET',
        dataType:'json',
        success(data){
            if(data.id){
                $('#img').attr('src','/static/media/'+data.image)
                $('#title').text(data.title)
                $('#price').text(data.price)
            }
        },error(data){
            alert('0')
        }
    })
}

$('.submit-btn').click(function () {
    var sd=$('#start-date').val()
    var ed=$('#end-date').val()
    if(!sd || !ed){
        // 日期为空的错误信息提示功能
        $('.popup_con').fadeIn('fast', function() {
            setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){});
        },1000)
    });



    }
    var id=location.search.split('=')[1]
    var id=parseInt(id)

    $.ajax ({
        url:'/order/orders_info/'+id+'/',
        type:'POST',
        data:{'id':id,'sd':sd,'ed':ed},
        dataType:'json',
        success(data) {
            if(data.code==200){
                alert('预定成功')
                location.href='/order/orders/'
            }
        },error(){
            alert('0')
        }
    })

})



$(document).ready(function(){
    booking_info()

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });


})
