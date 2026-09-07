let feedArray = []; // Global feed which stores all posts

/**
 * * Class with its post constructor
 */
class Post{
    constructor(id, username, content, likes, timestamp){
        this.id = id,
        this.username = username,
        this.content = content,
        this.likes = likes,
        this.timestamp = timestamp;
    }

    createPostMethod(userName, content){
        let randomIdNumber = [Math.floor(Math.random()*100), Math.floor(Math.random()*100), Math.floor(Math.random()*100), Math.floor(Math.random()*100)];
        let id = '';
        randomIdNumber.forEach((n) => {
            for(const digit of n.toString()){
                id += digit;
            }
        });

        this.id = id;
        this.username = userName;
        this.content = content;
        this.likes = 0;
        this.timestamp = Date.now();
    }

    likePostMethod(){
        this.likes += 1; 
    }

};

/**
 * * Create a post by username and content 
 */
const createPost = (username, content) => {
    let post = new Post();
    post.createPostMethod(username, content);
    feedArray.push(post);
};

/**
 * * Function to delete a post by its id
 * * Returns the array without the element
 */
const deletePost = (id) => {
    let allPosts = getFeed();    
    let postWithId = allPosts.filter( post => post.id === id);    
    let getIndexOfItem = allPosts.indexOf(postWithId[0]);
    if (getIndexOfItem !== -1) {
        feedArray.splice(getIndexOfItem,1)[0];
    }
} 

/**
 * * Like a post by its ID
 */
const likePost = (postId) => {
    feedArray.forEach((post) => {
        postId === post.id ? post.likePostMethod() : null;
    });
};

/**
 * * Get all posts feed
 */
const getFeed = () => {
    let postN = feedArray.map((post) => {
        return post;
    });
    return postN;
};

/**
 * * Get actual picked filter
 */
const getFilter = () => {
    const selectedSort = document.querySelector('input[name="btnradio"]:checked');
    return selectedSort.id;
}

/**
 * * Sort All posts by Oldest to Newest 
 */
const sortByOldest = () => {
    let allPosts = getFeed();
    return allPosts.toSorted((a,b) => a.timestamp - b.timestamp); // From oldest to latest
};

/**
 * * Sort All posts by Newest to Oldest
 */
const sortByNewest = () => {
    let allPosts = getFeed();
    return allPosts.toSorted((a,b) => b.timestamp - a.timestamp); // From latest to oldest
};

/** 
 * * Sort posts by likes, from the most to the least.
 */
const sortByLikes = () => { 
    let allPosts = getFeed();
    return allPosts.toSorted((a,b) => a.likes - b.likes); // erase the backward function it is just making it b.likes - a.likes
};

/**
 * * Return only the posts created by the specific user
*/
const getPostsByUser = usernameSearch => {
    let user = usernameSearch.toLowerCase();
    let allPosts = getFeed();
    let userPosts = allPosts.filter((post) => post.username.toLowerCase().includes(user));
    let actualFilter = getFilter();
    
    if (actualFilter === 'newest-sort') {
        return [userPosts.toSorted((a,b) => b.timestamp - a.timestamp), actualFilter];
    } else if (actualFilter === 'oldest-sort') {                
        return [userPosts.toSorted((a,b) => a.timestamp - b.timestamp), actualFilter];
    } else {
        return [userPosts.toSorted((a,b) => a.likes - b.likes), actualFilter];
    }
};

/**
 * * Helper function to erase posts
 */
const erasePosts = () => {
    const posts = document.querySelectorAll('#posts-area > .col');
    posts.forEach(post => post.remove());
}

/**
 * * Generating posts sorted by newest
 */
const renderFeedByNewest = () => {
    erasePosts();
    let postsSortedByNewest = sortByNewest();
    postsCreation(postsSortedByNewest, 'newest');
}

/**
 * * Generating posts sorted by oldest
 */
const renderFeedByOldest = () => {
    erasePosts();
    let postsSortedByOldest = sortByOldest();
    postsCreation(postsSortedByOldest, 'oldest');
}

/**
 * * Generating posts sorted by likes
 */
const renderFeedByLikes = () => {
    erasePosts();
    let postsSortedByLikes = sortByLikes();
    postsCreation(postsSortedByLikes, 'liked');
}

/**
 * * Component for message when there are no posts.
 */
const noPostsMessage = () => {
    const message = document.querySelector('.no-posts-msg');
    let actualFeed = getFeed();
    actualFeed.length >= 1 ? message.style.display = "none" : message.style.display = "block";
}

/**
 * * Posts cards creation function according to the filter
 */
const postsCreation = (postsObject, sortType) => {

    if (sortType === 'oldest' || sortType === 'newest' ) {
        for (let index = 0; index < postsObject.length; index++) {
            cardComponent(postsObject, index);
        } 
    } else {
        for (let index = postsObject.length-1; index >= 0; index--) {
            cardComponent(postsObject, index);       
        }
    }
}

/**
 * * Card component creation
 */
const cardComponent = (postsObject, index) => {
    // Creating Bootstrap card element for the post
    let columnWhichContainstheCard = document.createElement("div");
    columnWhichContainstheCard.className = "col d-flex justify-content-center";

    let cardComponent = document.createElement("div");
    cardComponent.className = "card h-100";

        let cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column justify-content-between";

            let cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.textContent = `@${postsObject[index].username}`;

            let cardText = document.createElement("p");
            cardText.className = "card-text";
            cardText.textContent = postsObject[index].content;

            let cardLikeButton = document.createElement("a");
            cardLikeButton.href = '#';
            // Post ID assigned to a class
            cardLikeButton.className = `btn btn-primary like-button ${postsObject[index].id}`;
            cardLikeButton.textContent = "Like";

        let cardLikesFooter = document.createElement("div");
        cardLikesFooter.className = "card-footer text-body-secondary d-flex justify-content-between p-1";

            let footerLikeText = document.createElement("span");
                footerLikeText.className = "my-auto ms-1 like-count";
                let likeText = postsObject[index].likes !== 1 ? 'Likes' : 'Like';
                footerLikeText.textContent = `${postsObject[index].likes} ${likeText}`;

            let deleteButton = document.createElement("button")
            deleteButton.type = "button";
            deleteButton.className = "btn btn-link link-danger p-0 delete-button";

            const svgNamespace = "http://www.w3.org/2000/svg";
            const trashIcon = document.createElementNS(svgNamespace, "svg");
            trashIcon.setAttribute("width", "16");
            trashIcon.setAttribute("height", "16");
            trashIcon.setAttribute("fill", "currentColor");
            trashIcon.setAttribute("class", "bi bi-trash3");
            trashIcon.setAttribute("viewBox", "0 0 16 16");

            const path = document.createElementNS(svgNamespace, "path");
            path.setAttribute(
            "d",
            "M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
            );
            trashIcon.appendChild(path);
            deleteButton.appendChild(trashIcon)

                cardLikesFooter.appendChild(footerLikeText);
                cardLikesFooter.appendChild(deleteButton);                    
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardLikeButton);
        cardComponent.appendChild(cardBody);
        cardComponent.appendChild(cardLikesFooter);
    columnWhichContainstheCard.appendChild(cardComponent);
    
    // Append the post inside the 'posts-area'    
    postsArea.appendChild(columnWhichContainstheCard); 
}

