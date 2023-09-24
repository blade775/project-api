//codes that share in more than one page




//darkmode
darkMode()
function darkMode(){
    document.addEventListener("DOMContentLoaded", function () {
const darkModeToggle = document.getElementById("darkmode-toggle");

darkModeToggle.addEventListener("change", function () {
    const body = document.body;

    if (darkModeToggle.checked) {
        body.setAttribute("data-bs-theme", "dark");
    } else {
        body.setAttribute("data-bs-theme", "light")
    }
});
});

}


//==========auth functions


function setUi(){
   
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    var object = JSON.parse(user)
    let profile= document.getElementById("profile")
    let logandregBtn=document.getElementById("change-to-logout")
    let logOut=document.getElementById("logout-btn")
    let addPost=document.getElementById("add-post")
    let addcomment=document.getElementById("addcomment")

    if(token ==null)//user is guest(notlogged in)
    {   
        logandregBtn.setAttribute('style','display:block !important')
        logOut.setAttribute('style','display:none !important;margin-right: 10px;')
        profile.setAttribute('style','display:none !important')
        addcomment.setAttribute('style','display:none !important')

    }else{
      
        logandregBtn.setAttribute('style','display:none !important')
        logOut.setAttribute('style','display:block !important')
        profile.setAttribute('style','display:block !important')
        profile.setAttribute('style','margin-right:10px')
        // let user=getCurrentUser()
        // document.getElementById('nav-username').innerHTML=user.username
        profile.innerHTML= 
        `
        <img class="rounded-5 border " src="${object.profile_image}" alt="" style="width: 40px;height:40px;">
        <b>@${object.name}</b>
        `
        addcomment.setAttribute('style','display:block !important')
    }
}
setUi()
//log in

document.getElementById("log-btn").addEventListener("click",()=>{
    let valueUser=document.getElementById("loginuser").value
    let valuepass= document.getElementById("pass").value
    toggleLoader(true)

    axios.post("https://tarmeezacademy.com/api/v1/login",
    {
        "username" : valueUser,
        "password" : valuepass

    })
    .then(response=>{
        toggleLoader(false)

        let token=response.data.token
        console.log(response.data)
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
       const modal =document.getElementById('exampleModal')
       const modalInstance=bootstrap.Modal.getInstance(modal)
       modalInstance.hide()
       setUi()
       afterlogin("logged in successfully")
    }).catch(function (error) {
        // handle error
        document.getElementById("error").innerHTML= error.response.data.message
    }).finally(()=>{
        toggleLoader(false)
    })
})
//reg btn
function registerbtn(){
    let image = document.getElementById("profile-img").files[0];
    let regname=document.getElementById("reg-name-input").value
    let reguser=document.getElementById("reg-username-input").value
    let regpass=document.getElementById("reg-pass-input").value
    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("name", regname);
    formdata.append("username", reguser);
    formdata.append("password", regpass);
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/register",formdata
)
    .then(response=>{
        toggleLoader(false)
        console.log(response)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal =document.getElementById('reg-modal')
        const modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        setUi()
        afterlogin("New User Registered successfully")
       
    }).catch(function (error) {
        console.log(error)
        // handle error
        document.getElementById("error-reg").innerHTML= error.response.data.message
    }).finally(()=>{
        toggleLoader(false)
    })

}




//log Out

function logOut(){
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    afterlogin("logged out successfully")
    setUi()
    
}


//alert for everything

function afterlogin(customemessage){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
   `<div id="success-alert" class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',

    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    
    }

    //todo
    appendAlert(customemessage, 'success')
   
    // setTimeout(()=>{
    //     const modal =document.getElementById('success-alert')
    //     const modalInstance=bootstrap.Modal.getInstance(modal)
    //     modalInstance.hide()
    // },2000)
}

function getCurrentUser(){
   let user = null
   const storageUser= localStorage.getItem('user')

   if(storageUser != null){
    user=JSON.parse(storageUser)
   }
   return user
}


// =========POST REQUEST=======
function editPostBtnClicked(postObject){
    // alert("dsadas")
    let post=JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("post-btn").innerHTML="Update"
    document.getElementById("post-id").value=post.id
    document.getElementById("post-modal-title").innerHTML="Edit post"
    document.getElementById("title-content").value=post.title
    document.getElementById("post-content").value=post.body
    
    let postEdit= new bootstrap.Modal(document.getElementById("createpost"),{})
    postEdit.toggle()
    }
    
    function deletePostBtnClicked(postObject){
        let post=JSON.parse(decodeURIComponent(postObject))
        console.log(post)
        document.getElementById("delete-post-input").value=post.id
       
        // document.getElementById("post-btn").innerHTML="Update"
        // document.getElementById("post-id").value=post.id
        // document.getElementById("post-modal-title").innerHTML="Edit post"
        // document.getElementById("title-content").value=post.title
        // document.getElementById("post-content").value=post.body
    
        let postEdit= new bootstrap.Modal(document.getElementById("deletepost"),{})
        postEdit.toggle()
    }
    
    function confirmDelete(){
        const postId= document.getElementById("delete-post-input").value
        const token = localStorage.getItem("token");
    
        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
            headers:{
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`,
            }})
        .then(response=>{
            console.log(response)
            
           
            // console.log(response.data)
           
          
           const modal =document.getElementById('deletepost')
           const modalInstance=bootstrap.Modal.getInstance(modal)
           modalInstance.hide()
            getposts( )
        
           afterlogin("Deleted successfully")
        }).catch(function (error) {
            // handle error
            console.log(error)
            document.getElementById("error").innerHTML= error.response.data.message
        })
    }    




    
function createPost() {
    // console.log("Inside createPost");
        let postId=document.getElementById("post-id").value
        let isCreate=postId == null|| postId ==""
        let title = document.getElementById("title-content").value;
        let body = document.getElementById("post-content").value;
        let image = document.getElementById("img-post").files[0];
        const token = localStorage.getItem("token");
        let formdata = new FormData();
        formdata.append("image", image);
        formdata.append("body", body);
        formdata.append("title", title);
        let url=''
        if(isCreate){
            
        url=`https://tarmeezacademy.com/api/v1/posts`
        
        }else{
            formdata.append("_method", "put")
            url=`https://tarmeezacademy.com/api/v1/posts/${postId}`
        }
        toggleLoader(true)
        axios.post(url, formdata, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log("Post created successfully")
            const hideCreateModal = document.getElementById("createpost");
            const modalCreateInstance = bootstrap.Modal.getInstance(hideCreateModal);
            modalCreateInstance.hide();
            afterlogin("Created A new Post successfully");
            // Call getposts after successfully creating a post
        
            getposts()
        })
        .catch(function (error) {
            // handle error
            console.log(error.response.data.message);
            document.getElementById("error-post").innerHTML =error.response.data.message;
        }).finally(()=>{
            toggleLoader(false)
        })
    
    }
    

    function profileclicked(){
        const user= getCurrentUser()
        const userId=user.id
        window.location=`profile.html?userid=${userId}`
        toggleLoader(false)

    }

    function toggleLoader(show=true){
        if(show){
            document.getElementById("loader").style.visibility="visible"
        }else{
            document.getElementById("loader").style.visibility="hidden"
    
        }
    
    }