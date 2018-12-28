function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url:'/house/newhouse_cqpt/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            cq=data.cq_list
            pt=data.pt_list
            for(var i=0;i<cq.length;i++){
                var option=$('<option>').val(cq[i].id).text(cq[i].name)
                $('#area-id').append(option)
            }
            for(var i=0;i<pt.length;i++) {
                var li='<li>'+'<div class="checkbox">'+'<label>'+'<input type="checkbox" name="facility" value="'+pt[i].id+'">'+pt[i].name+'<label>'+'</div>'+'</li>'
                $('.clearfix').append(li)
            }
        },error:function (data) {
            alert('0')
        }
    })
})

$('#form-house-info').submit(function (e) {
    e.preventDefault()
    $(this).ajaxSubmit({
        url:'/house/newhouse/',
        type:'POST',
        dataType:'json',
        success:function (data) {
            if (data.code==200){
                $('#form-house-image').show()
                $('#house-id').val(data.id)
                $('#form-house-info').hide()
            }
        },error:function (data) {
            alert('0')
        }
    })

})


$('#form-house-image').submit(function (e) {
    e.preventDefault()
    $(this).ajaxSubmit({
        url:'/house/newhouse/',
        type:'PATCH',
        dataType:'json',
        success:function (data) {
            if (data.code=200){
                alert('1')
            }
        },error:function (data) {
            alert('0')
        }
    })

})