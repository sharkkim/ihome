function logout() {
    $.get("/user/logout/", function(data){
        if (0 == data.errno) {
            location.href = "/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url:'/user/my_info/',
        type:'GET',
        dataType:'json',
        success:function (data) {
            $('#user-avatar').attr('src','/static/media/'+data.icon)
            $('#user-name').text(data.name)
            $('#user-mobile').text(data.phone)

        },error:function (data) {
            alert('0')
        }
    })
})