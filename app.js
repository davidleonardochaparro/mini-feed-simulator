/**
 * * Function to create initial posts with a delay, so the posts have different timestamp
 */
async function createPostsWithDelay() {
    createPost('Theo', 'Olá mundo');
    noPostsMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    createPost('Jade', 'Bonjour le monde');
    noPostsMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    createPost('John', 'Helloo World');
    noPostsMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    createPost('David', 'Hola mundo');
    noPostsMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    createPost('Claudia', 'Hallo Welt');
    noPostsMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    createPost('Lorenzo', 'Ciao mondo');
    noPostsMessage();
};

/**
 * * Grab the form content to create a post
 * * Validate the form
 */
const form = document.querySelector(".needs-validation")
form.addEventListener("submit", evt => {
    evt.preventDefault();
    
    if (!form.checkValidity()) {
        evt.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const usernameInput = document.querySelector("#username-input");
    const contentInput = document.querySelector("#content-input");

    createPost(usernameInput.value, contentInput.value);

    const selectedSort = document.querySelector( 'input[name="btnradio"]:checked' );
    
    if (selectedSort.id === 'newest-sort') {
        renderFeedByNewest();
        postsArea.scrollLeft = 0;
    } else if (selectedSort.id === 'oldest-sort') {
        renderFeedByOldest();
        postsArea.scrollTo({
            left: postsArea.scrollWidth,
            behavior: "smooth"
        });
    } else {
        renderFeedByLikes();
    }

    form.reset();
    form.classList.remove('was-validated');
    noPostsMessage();
});

/**
 * * Event listener for the like button in a post
 */
const postsArea = document.querySelector("#posts-area");
postsArea.addEventListener("click", evt => {
    evt.preventDefault();
    let likeButton = evt.target.closest(".like-button");
    
    if (likeButton) {

        const userSearchInputA = document.querySelector('#user-search');
        if (!userSearchInputA.value) {
            
            let pickedPost = likeButton.closest(".col");
            let spanElement = pickedPost.querySelector(".like-count");

            let classListLength = likeButton.classList.length - 1;
            let postId = likeButton.classList[classListLength]; 
            likePost(postId);  
            
            let actualFeed = getFeed();
            let postWithId = actualFeed.filter( post => post.id === postId);
            
            if (postWithId.length) {
                let likesCount = postWithId[0].likes;
                let likeText = likesCount !== 1 ? 'Likes' : 'Like';
                spanElement.textContent = `${likesCount} ${likeText}`;

                let filter = getFilter();
                
                if (filter === 'newest-sort') {
                    renderFeedByNewest();
                } else if (filter === 'oldest-sort') {                
                    renderFeedByOldest();
                } else {
                    renderFeedByLikes();
                }
            } else {
                renderFeedByNewest();
            }
        } else {
            let pickedPost = likeButton.closest(".col");
            let spanElement = pickedPost.querySelector(".like-count");

            let classListLength = likeButton.classList.length - 1;
            let postId = likeButton.classList[classListLength]; 
            likePost(postId);  
            
            let actualFeed = getFeed();
            let postWithId = actualFeed.filter( post => post.id === postId);
            
            if (postWithId.length) {
                let likesCount = postWithId[0].likes;
                let likeText = likesCount !== 1 ? 'Likes' : 'Like';
                spanElement.textContent = `${likesCount} ${likeText}`;

                let [postsBySpecificUserA, actualFilterA] = getPostsByUser(userSearchInputA.value);
                if (actualFilterA === 'newest-sort') {
                    erasePosts();
                    postsCreation(postsBySpecificUserA, 'newest');
                } else if (actualFilterA === 'oldest-sort') {                
                    erasePosts();
                    postsCreation(postsBySpecificUserA, 'oldest');
                } else {
                    erasePosts();
                    postsCreation(postsBySpecificUserA, 'liked');
                }
            }                
        }
    }
});

/**
 * * Event listener to delete a post
 */
postsArea.addEventListener("click", evt => {
    let deleteButton = evt.target.closest(".delete-button");
    if (deleteButton) {
        let pickedPost = deleteButton.closest(".col");
        let idGetFromLikeButtonClass = pickedPost.querySelector(".like-button");
        let classListLength = idGetFromLikeButtonClass.classList.length -1;
        let postId = idGetFromLikeButtonClass.classList[classListLength];
        
        pickedPost.remove();      
        deletePost(postId);  
        noPostsMessage();
    }
});

/**
 * * Event listener for 'Oldest' button to sort posts by oldest
 */
const oldestButton = document.querySelector('#oldest-sort');
oldestButton.addEventListener("click", evt => {
    const userSearchInputA = document.querySelector('#user-search');
    if (!userSearchInputA.value) {
        renderFeedByOldest();
        postsArea.scrollLeft = 0;
        noPostsMessage();
    } else {
        let userToSearch = userSearchInput.value;
        let [postsBySpecificUser, actualFilter] = getPostsByUser(userToSearch);
        
        if (postsBySpecificUser.length) {

            if (actualFilter === 'newest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'newest');
                postsArea.scrollLeft = 0;
            } else if (actualFilter === 'oldest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'oldest');
                postsArea.scrollLeft = 0;
                
            } else {
                erasePosts();
                postsCreation(postsBySpecificUser, 'liked');
                postsArea.scrollLeft = 0;
            }

        } else {
            erasePosts(); // Maybe delete this
        }
    }
});

/**
 * * Event listener for 'Newest' button to sort posts by newest
 */
const newestButton = document.querySelector('#newest-sort');
newestButton.addEventListener("click", evt => {
    const userSearchInputA = document.querySelector('#user-search');
    if (!userSearchInputA.value) {
        erasePosts();
        let postsSortedByNewest = sortByNewest();
        postsCreation(postsSortedByNewest, 'newest');
        postsArea.scrollLeft = 0;
        noPostsMessage();
    } else {
        let userToSearch = userSearchInput.value;
        let [postsBySpecificUser, actualFilter] = getPostsByUser(userToSearch);
        
        if (postsBySpecificUser.length) {

            if (actualFilter === 'newest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'newest');
                postsArea.scrollLeft = 0;
            } else if (actualFilter === 'oldest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'oldest');
                postsArea.scrollLeft = 0;
                
            } else {
                erasePosts();
                postsCreation(postsBySpecificUser, 'liked');
                postsArea.scrollLeft = 0;
            }

        } else {
            erasePosts(); // Maybe delete this
            
        }
    }
});

/**
 * * Event listener for 'Most Liked' button to sort posts by likes.
 */
const mostLikedButton = document.querySelector('#liked-sort');
mostLikedButton.addEventListener("click", evt => {
    const userSearchInputA = document.querySelector('#user-search');
    if (!userSearchInputA.value) {
        renderFeedByLikes();
        noPostsMessage();
    } else {
        let userToSearch = userSearchInput.value;
        let [postsBySpecificUser, actualFilter] = getPostsByUser(userToSearch);
        
        if (postsBySpecificUser.length) {

            if (actualFilter === 'newest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'newest');
                postsArea.scrollLeft = 0;
            } else if (actualFilter === 'oldest-sort') {
                erasePosts();
                postsCreation(postsBySpecificUser, 'oldest');
                postsArea.scrollLeft = 0;
                
            } else {
                erasePosts();
                postsCreation(postsBySpecificUser, 'liked');
                postsArea.scrollLeft = 0;
            }

        } else {
            erasePosts(); // Maybe delete this
        }
    }
});

/**
 * * Event listener for the 'user-search'
 */
const userSearchInput = document.querySelector('#user-search');
userSearchInput.addEventListener("input", evt => { 
    let userToSearch = userSearchInput.value;
    let [postsBySpecificUser, actualFilter] = getPostsByUser(userToSearch);
    
    if (postsBySpecificUser.length) {

        if (actualFilter === 'newest-sort') {
            erasePosts();
            postsCreation(postsBySpecificUser, 'newest');
            postsArea.scrollLeft = 0;
        } else if (actualFilter === 'oldest-sort') {
            erasePosts();
            postsCreation(postsBySpecificUser, 'oldest');
            postsArea.scrollLeft = 0;
            
        } else {
            erasePosts();
            postsCreation(postsBySpecificUser, 'liked');
            postsArea.scrollLeft = 0;
        }

    } else if (getFeed().length >= 1) {
        erasePosts(); 

        const svgNamespace = "http://www.w3.org/2000/svg";
        const sadIcon = document.createElementNS(svgNamespace, "svg");

        sadIcon.setAttribute("width", "56");
        sadIcon.setAttribute("height", "56");
        sadIcon.setAttribute("fill", "currentColor");
        sadIcon.setAttribute("class", "bi bi-emoji-frown mt-5 text-body-tertiary");
        sadIcon.setAttribute("viewBox", "0 0 16 16");

        const outerPath = document.createElementNS(svgNamespace, "path");
        outerPath.setAttribute(
            "d",
            "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
        );

        const facePath = document.createElementNS(svgNamespace, "path");
        facePath.setAttribute(
            "d",
            "M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"
        );

        sadIcon.appendChild(outerPath);
        sadIcon.appendChild(facePath);

        let userNotFoundText = document.createElement('p');
        userNotFoundText.textContent = "User not found";
        userNotFoundText.className = "mt-3 mb-5 text-body-tertiary";

        let columnWhichContainstheEmoji = document.createElement("div");
        columnWhichContainstheEmoji.className = "col";
        columnWhichContainstheEmoji.appendChild(sadIcon);
        columnWhichContainstheEmoji.appendChild(userNotFoundText);
        postsArea.appendChild(columnWhichContainstheEmoji);
    }
});


/**
 * * This section executes after the users are created with the respective delay
 */
createPostsWithDelay().then(() => {
    likePost(feedArray[0].id);
    likePost(feedArray[0].id);
    likePost(feedArray[0].id);
    likePost(feedArray[1].id); 
    likePost(feedArray[1].id); 
    likePost(feedArray[1].id); 
    likePost(feedArray[1].id); 
    likePost(feedArray[2].id); 
    likePost(feedArray[2].id); 
    likePost(feedArray[2].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[3].id); 
    likePost(feedArray[4].id); 
    likePost(feedArray[4].id); 
    likePost(feedArray[5].id); 
    likePost(feedArray[5].id); 
    likePost(feedArray[5].id); 
    likePost(feedArray[5].id); 
    likePost(feedArray[5].id); 
});
