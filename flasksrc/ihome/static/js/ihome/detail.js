function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}


function house_info() {
    // 获取当前房源id
    var id=location.search.split('=')[1]
    var id=parseInt(id)
    $.ajax({
        url:'/house/detail_info/'+id+'/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            alert('房源图片几张？'+data.house.images.length)
            for(var i=0;i<data.house.images.length;i++){
                var img='<li class="swiper-slide"><img src="/static/media/'+data.house.images[i]+'"></li>'
                $('.swiper-wrapper').append(img)
            }

            $('.house-price span').text(data.house.price)
            $('.house-title').text(data.house.title)
            $('.landlord-pic img').attr('src','/static/media/'+data.house.user_avatar)
            $('.landlord-name span').text(data.house.user_name)
            $('#ul1 li').text(data.house.address)
            $('#h31').text('出租'+data.house.room_count+'间')
            $('#p1').text('房屋面积:'+data.house.acreage+'平米')
            $('#p2').text('房屋户型:'+data.house.unit)
            $('#h32').text('宜住'+data.house.capacity+'人')
            $('#p3').text(data.house.beds)
            $('#li1 span').text(data.house.deposit)
            $('#li2 span').text(data.house.min_days)
            $('#li3 span').text(data.house.max_days)
            $('#booking').attr('href','/order/booking/?id='+data.house.id+'/')


            for(var i=0;i<data.house.facilities.length;i++){
                var li='<li><span class="'+data.house.facilities[i].css+'"></span>'+data.house.facilities[i].name+'</li>'
                $('.house-facility-list').append(li)
            }

            // 轮播样式（不用管）
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            })

            // 判断登陆与否及是否是房源发布人
            // $(".book-house").show();
            if(data.loginer_id==data.house.user_id){
                $('.book-house').hide()
            }
            // if(!data.loginer_id){
            //     location.href='/user/login/'
            // }
            // alert(data.loginer_id)
            // alert(data.house.user_id)

        },error:function (data) {
            alert('0')
        }
    })
}


$(document).ready(function(){

    house_info();


})

