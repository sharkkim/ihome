function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}


$(document).ready(function(){
    $.ajax({
        url:'/user/auth_ever/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            if(data.code==200){
                $('#id-card').val(data.id).attr('disabled','true')
                $('#real-name').val(data.name).attr('disabled','true')
                $('.btn-success').hide()
            }
        },error:function (data) {
            alert('0')
        }
    })
})


$('#form-auth').submit(function (e) {
    e.preventDefault()
    var name=$('#real-name').val()
    var id=$('#id-card').val()
    if (!name || !id || id.length!=18){
        $('.error-msg').show()
    }else {
        $(this).ajaxSubmit({
            url:'/user/auth/',
            type:'POST',
            dataType:'json',
            success:function (data) {
                alert(data.msg)
                if(data.msg=='success for auth'){
                    $('.error-msg').hide()
                    $('.btn-success').hide()
                    $('#real-name').attr('disabled','true')
                    $('#id-card').attr('disabled','true')
                }

            },error:function (data) {
                alert('wrong wrong wrong')
            }
        })
    }

})

