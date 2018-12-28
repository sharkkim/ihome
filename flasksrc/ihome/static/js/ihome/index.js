//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function setStartDate() {
    var startDate = $("#start-date-input").val();
    if (startDate) {
        $(".search-btn").attr("start-date", startDate);
        $("#start-date-btn").html(startDate);
        $("#end-date").datepicker("destroy");
        $("#end-date-btn").html("离开日期");
        $("#end-date-input").val("");
        $(".search-btn").attr("end-date", "");
        $("#end-date").datepicker({
            language: "zh-CN",
            keyboardNavigation: false,
            startDate: startDate,
            format: "yyyy-mm-dd"
        });
        $("#end-date").on("changeDate", function() {
            $("#end-date-input").val(
                $(this).datepicker("getFormattedDate")
            );
        });
        $(".end-date").show();
    }
    $("#start-date-modal").modal("hide");
}

function setEndDate() {
    var endDate = $("#end-date-input").val();
    if (endDate) {
        $(".search-btn").attr("end-date", endDate);
        $("#end-date-btn").html(endDate);
    }
    $("#end-date-modal").modal("hide");
}

function goToSearchPage(th) {
    var url = "/house/search/?";
    url += ("aid=" + $(th).attr("area-id"));
    url += "&";
    var areaName = $(th).attr("area-name");
    if (undefined == areaName) areaName="";
    url += ("aname=" + areaName);
    url += "&";
    url += ("sd=" + $(th).attr("start-date"));
    url += "&";
    url += ("ed=" + $(th).attr("end-date"));
    location.href = url;
}



$(document).ready(function(){

    $(".top-bar>.register-login").show();

    // 个人用户信息展示
    $.ajax({
        url:'/house/index_user/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            if(data.code==200){
                $('#btn-theme3').text(data.user)
                $('#user_info').show()
                $('#login_register').hide()
            }else{
                $('#user_info').hide()
                $('#login_register').show()
            }
        },error:function (data) {
            $('#user_info').hide()
            $('#login_register').show()
        }
    })


    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);               //当窗口大小变化的时候
    $("#start-date").datepicker({
        language: "zh-CN",
        keyboardNavigation: false,
        startDate: "today",
        format: "yyyy-mm-dd"
    });
    $("#start-date").on("changeDate", function() {
        var date = $(this).datepicker("getFormattedDate");
        $("#start-date-input").val(date);
    });


    // 首页房源轮播
    $.get('/house/house_info/',function (data) {
        // 循环房源首图
        for (var i = 0; i < data.houses.length; i++) {
            a='<div class="swiper-slide">\n' +
                '                    <a href="/house/detail/?id=' + data.houses[i].id + '/"><img src="/static/media/' + data.houses[i].image + '"></a>\n' +
                '                    <div class="slide-title">' + data.houses[i].title + '</div>\n' +
                '                </div>'
            $('.swiper-wrapper').append(a)

        }
        // 首页房源轮播设置
         var mySwiper = new Swiper ('.swiper-container', {
            loop: true,
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            pagination: '.swiper-pagination',
            paginationClickable: true
        });

        // 获取城区列表
        for(var i=0;i<data.areas.length;i++){
            var li='<a href="#" area-id="'+data.areas[i].id+'">'+data.areas[i].name+'</a>'
            $('.area-list').append(li)
        }

           // 城区选择点击事件
        $(".area-list a").click(function(e){
            $("#area-btn").html($(this).html());
            $(".search-btn").attr("area-id", $(this).attr("area-id"));
            $(".search-btn").attr("area-name", $(this).html());
            $("#area-modal").modal("hide");
        });
    })
})