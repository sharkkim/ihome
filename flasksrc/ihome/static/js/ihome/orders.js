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

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function myorders(){
    $.get('/order/myorders/',function (data) {
        for(var i=0;i<data.orders.length;i++){
            var li='<li order-id="'+data.orders[i].order_id+'">'
                    li+='<div class="order-title">'
                        li+='<h3>订单编号：'+data.orders[i].order_id+'</h3>'
                        li+='<div class="fr order-operate">'
                            li+='<button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
                        li+='</div>'
                    li+='</div>'
                    li+='<div class="order-content">'
                        li+='<img src="/static/media/'+data.orders[i].image+'">'
                        li+='<div class="order-text">'
                            li+='<h3>订单</h3>'
                            li+='<ul>'
                                li+='<li>创建时间：'+data.orders[i].create_date+'</li>'
                                li+='<li>入住日期：'+data.orders[i].begin_date+'</li>'
                                li+='<li>离开日期：'+data.orders[i].end_date+'</li>'
                                li+='<li>合计金额：'+data.orders[i].amount+'元(共'+data.orders[i].days+'晚)</li>'
                                li+='<li>订单状态：'+data.orders[i].status
                                    li+='<span>已拒单</span>'
                                li+='</li>'
                                li+='<li>我的评价：</li>'
                                li+='<li>拒单原因：</li>'
                            li+='</ul></div></div></li></ul>'
          $('.orders-list').append(li)
        }
    })
}


$(document).ready(function(){
    myorders();
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });
});