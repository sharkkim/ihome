var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
}

// 获取后端所有房源信息
function houseIofo(th){
    $.ajax({
        url:'/house/search_info/',
        data:th,
        type:'GET',
        dataType:'json',
        success:function (data) {
            $('.house-list').empty()
            // 传回房源列表
            for (var i = 0; i < data.houses.length; i++) {
                var li='<li class="house-item">'
                    li+='<a href="/house/detail/?id='+data.houses[i].id+'/"><img src="/static/media/'+data.houses[i].image+'"></a>'
                    li+='<div class="house-desc">'
                        li+='<div class="landlord-pic"><img src="/static/media/'+data.houses[i].user_avatar+'"></div>'
                        li+='<div class="house-price">￥<span>'+data.houses[i].price+'</span>/晚</div>'
                        li+='<div class="house-intro">'
                            li+='<span class="house-title">'+data.houses[i].title+'</span>'
                            li+='<em>出租'+data.houses[i].room_count+ '间- '+data.houses[i].capacity+'人入住 -'+ data.houses[i].address+'</em></div></div></li>'
                $('.house-list').append(li)

            }
        },error(data){
           alert('0')
        }

    })

}




// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
    houseIofo(params)
}

$(document).ready(function(){
    var queryData = decodeQuery();
    var cs=location.search
    $.ajax({
        url:'/house/search_info/'+cs,
        type:'GET',
        dataType:'json',
        success:function (data) {
            // 传回房源列表
            for (var i = 0; i < data.houses.length; i++) {
                var li='<li class="house-item">'
                    li+='<a href="/house/detail/?id='+data.houses[i].id+'/"><img src="/static/media/'+data.houses[i].image+'"></a>'
                    li+='<div class="house-desc">'
                        li+='<div class="landlord-pic"><img src="/static/media/'+data.houses[i].user_avatar+'"></div>'
                        li+='<div class="house-price">￥<span>'+data.houses[i].price+'</span>/晚</div>'
                        li+='<div class="house-intro">'
                            li+='<span class="house-title">'+data.houses[i].title+'</span>'
                            li+='<em>出租'+data.houses[i].room_count+ '间- '+data.houses[i].capacity+'人入住 -'+ data.houses[i].address+'</em></div></div></li>'
                $('.house-list').append(li)
            }
        },error(data){
           alert('0')
        }

    })


    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();
        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");

    });

    $.get('/house/search_cq/',function (data) {
        // 获取城区列表
        for (var i = 0; i < data.areas.length; i++) {
            var li = '<li area-id="' + data.areas[i].id + '">' + data.areas[i].name + '</li>'
            $('.filter-area').append(li)
        }
        $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
            if (!$(this).hasClass("active")) {
                $(this).addClass("active");
                $(this).siblings("li").removeClass("active");
                $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
            } else {
                $(this).removeClass("active");
                $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
            }
        });
    })

    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }
    })


})