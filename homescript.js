let currentpage=1
let lastPage=1

// infinite scroll//
window.addEventListener("scroll", ()=>{
    console.log("scroling")
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    console.log(lastPage,currentpage)
        if (endOfPage && currentpage < lastPage) {
            currentpage=currentpage+1
            getposts(false,currentpage)
         }

});
//===========// infinite scroll//========//



//all posts

function getposts(reload=true,page=1){
    toggleLoader(true) 
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=3&page=${page}`)
    .then( (response)=> {
        toggleLoader(false) 
        // handle success
        let allPosts=response.data.data
        lastPage=response.data.meta.last_page 
        if(reload){
        document.getElementById("posts").innerHTML=""

    }
    // show or hide Edit Btn
    
   
    for(post of allPosts){
        let authorr= post.author
        let user=getCurrentUser()
        let isMyPost= user!=null&& post.author.id==user.id
        let editButtonContent=""
        if(isMyPost){
            editButtonContent=`
            <button class="btn btn-danger" style="float:right;margin-left:5px;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button> 

            <button class="btn btn-secondary" style="float:right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button> 
            `
        }
        let content=
        `  <!-- post -->
        <div class="card  bg-success bg-gradient shadow rounded-5 my-4 ">
            <div class="card-header">
            <span onclick="userClick(${authorr.id})" style="cursor:pointer;">
                 <img class="rounded-5 border " src="${authorr.profile_image}" alt="" style="width: 40px;height:40px;">
                 <b>@${authorr.username}</b>
            </span>   
                 ${editButtonContent}
            </div>
            <div class="card-body"  onclick="postClicked(${post.id})" style="cursor:pointer;">
                <img class="w-100 img-fluid "  src="${post.image}" alt="">

                <h6 style="font-size: 13px; margin-top: 2px; margin-left: 15px;">${post.created_at}</h6>

                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <hr>
                <div style="display: inline;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                      </svg>
                    <span>${post.comments_count} Comments</span>
                    <span id="post-tags-${post.id}">

                    
                    </span>
                </div>
            </div>
        </div>

        `
        document.getElementById("posts").innerHTML+=content
        // document.getElementById("logout-btn").innerHTML=profileandUser

        let currentpost=`post-tags-${post.id}`
        document.getElementById(currentpost).innerHTML=""
        for(tag of post.tags){
            let tagsContent=
            `
            <button style="margin-left: 9px; padding: 0px 6px;" type="button" class="btn btn-secondary">
                 ${tag.name}
            </button>

            `
            document.getElementById(currentpost).innerHTML+=tagsContent

        }

    }

})
.catch(function (error) {
    // handle error
    console.log(error);
})

}

getposts()


function postClicked(postId){
    

window.location=`postDetails.html?postId=${postId}`

}


//create Post


function addBtnClicked(){
   
 
    document.getElementById("post-btn").innerHTML="Create"
    document.getElementById("post-id").value=""
    document.getElementById("post-modal-title").innerHTML="Create A New Post"
    document.getElementById("title-content").value=""
    document.getElementById("post-content").value=""

    let postEdit= new bootstrap.Modal(document.getElementById("createpost"),{})
    postEdit.toggle()
}



function userClick(userId){
   
    
    window.location=`profile.html?userid=${userId}`
    toggleLoader(false)

}


