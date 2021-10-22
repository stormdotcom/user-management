
$.validator.addMethod("alpha", function (value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});
let password;
$.validator.addMethod("isEmail", function (value, element) {
    return this.optional(element) || value == value.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i);

});
$.validator.addMethod("matchPass", function (value, element) {
    password=$("#password").val()
    if(password===value ) {
        return true;
    }
    else {
        return false;
    }
});
$(document).ready(()=>{
    // Login    
    $("#form1").validate({
        rules:{
            email:{
                required: true,
                minlength:3,
                isEmail:true
            },
            password:{
                required:true,
                minlength:5,
            }
        },
        messages:{
            email:{
                required: "*Required Feild",
                minlength:"Min character 3",
                isEmail:"Enter a valid Email"
            },
            password:{
                required:"*Required Feild",
                minlength:"Min character 5",

            }
        },
        // submitHandler:function(form){
        //     $.ajax({
        //         url:"/login",
        //         data:$("#form1").serialize(),
        //         method:"POST",
        //     })
        // }
    })

})

$(document).ready(()=>{
    // SignUp
    $("#form2").validate({
        rules:{
            name:{
                required: true,
                minlength:3,
                alpha: true
            },
            email:{
                required:true,
                minlength:3,
                isEmail:true,

            },
            password:{
                required:true,
                minlength:5,
            },
            password2:{
                required:true,
                minlength:5,
                matchPass:true
            }
        },
        messages:{
            name:{
                alpha:"Characters only",
                required: "*Required Feild",
                minlength:"Min character 3"
            },
            email:{
                required: "*Required Feild",
                minlength:"Min character 3",
                isEmail:"Enter a valid Email"
            },
            password:{
                required:"*Required Feild",
                minlength:"Min character 5",
            },
            password2:{
                required:"*Required Feild",
                matchPass:"Password not Matching"
            }
        }
    //     submitHandler:function(form){
    //         $.ajax({
    //             url:"/signup",
    //             data:$("#form2").serialize(),
    //             method:"POST",
    //     })
    // }

})
})
$('#message1').css('display', 'none')
function blockUser(id){
    $.ajax({
        url:"/admin/block-user",
        method:"POST",
        data:{id:id},
        success:(res)=>{
            if(res.status){
                setTimeout((location.href="/admin"), 500)
                
            }
            else alert("Error while blocking")
           
        }
})
}

function unblockUser(id){
    console.log(id)
    $.ajax({
        url:"/admin/unblock-user",
        method:"POST",
        data:{id:id},
        success:(res)=>{
            if(res.status){
                setTimeout((location.href="/admin"), 500)
            }
            else alert("Failed to unblock")
            
        }
})
}
function deleteUser(id){
    $.ajax({
        url:"/admin/delete-user",
        method:"POST",
        data:{id:id},
        success:(res)=>{
            if(res.status){
                $('#message1').css('display', 'block')
                $('#message6').html('Item Removed' )
                setTimeout((location.href="/admin"), 500)
            }
        }
    })
}
