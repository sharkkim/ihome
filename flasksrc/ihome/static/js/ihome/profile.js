function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$('#form-avatar').submit(function (e) {
    e.preventDefault()
    $(this).ajaxSubmit({
        url:'/user/profile/',
        dataType:'json',
        type:'POST',
        success:function (data) {
            location.href='/user/my/'
        },error:function (data) {
            alert('0')
        }
    })
})

$('#form-name').submit(function (e) {
    e.preventDefault()
    $(this).ajaxSubmit({
        url:'/user/profile/',
        dataType:'json',
        type:'PATCH',
        success:function (data) {
            location.href='/user/my/'
        },error:function (data) {
            alert('0')
        }
    })
})