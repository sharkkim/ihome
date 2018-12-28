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


function mylorders(){
    $.get('/order/mylorders/',function (data) {
        for(var i=0;i<data.orders.length;i++){

            var div='<div class="orders-con">'
                div+='<ul class="orders-list">'
                    div+='<li order-id=>'
                        div+='<div class="order-title">'
                            div+='<h3>订单编号：'+data.orders[i].order_id+'</h3>'
                            div+='<div class="fr order-operate">'
                                div+='<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>'
                                div+='<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>'
                            div+='</div>'
                        div+='</div>'
                        div+='<div class="order-content">'
                            div+='<img src="/static/media/'+data.orders[i].image+'">'
                            div+='<div class="order-text">'
                                div+='<h3>'+data.orders[i].house_title+'</h3>'
                                div+='<ul>'
                                    div+='<li>创建时间：'+data.orders[i].create_date+'</li>'
                                    div+='<li>入住日期：'+data.orders[i].begin_date+'</li>'
                                    div+='<li>离开日期：'+data.orders[i].end_date+'</li>'
                                    div+='<li>合计金额：￥'+data.orders[i].amount+'(共'+data.orders[i].days+'晚)</li>'
                                    div+='<li>订单状态：'
                                        div+='<span>待接单</span>'
                                    div+='</li>'
                                    div+='<li>客户评价： '+data.orders[i].comment+'</li>'
                                div+='</ul></div></div></li></ul>'
                div+='<div class="modal fade" id="accept-modal" tabindex="-1" role="dialog" aria-labelledby="accept-label">'
                    div+='<div class="modal-dialog" role="document">'
                        div+='<div class="modal-content">'
                            div+='<div class="modal-header">'
                                div+='<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'
                                div+='<h4 class="modal-title">操作提示</h4>'
                            div+='</div>'
                            div+='<div class="modal-body">'
                                div+='<p>您确定接此订单吗？</p>'
                            div+='</div>'
                            div+='<div class="modal-footer">'
                                div+='<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'
                                div+='<button type="button" class="btn btn-primary modal-accept">确定接单</button>'
                            div+='</div></div></div></div>'
                div+='<div class="modal fade" id="reject-modal" tabindex="-1" role="dialog" aria-labelledby="reject-label">'
                    div+='<div class="modal-dialog" role="document">'
                        div+='<div class="modal-content">'
                            div+='<div class="modal-header">'
                                div+='<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'
                                div+='<h4 class="modal-title">请输入拒接单原因</h4>'
                            div+='</div>'
                            div+='<div class="modal-body">'
                                div+='<textarea class="form-control" rows="3" id="reject-reason" placeholder="此处必须填写原因"></textarea>'
                            div+='</div>'
                            div+='<div class="modal-footer">'
                                div+='<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'
                                div+='<button type="button" class="btn btn-primary modal-reject">确定</button>'
                            div+='</div></div></div></div></div>'
            $('.container').append(div)
        }

    })
}


$(document).ready(function(){
    
    mylorders();
    
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });
});