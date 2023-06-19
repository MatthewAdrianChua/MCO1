const submitBtn = document.getElementById("submit-comment");
const formElement = document.forms.commentform;
const commentSection = document.getElementById('comment-section');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(formElement);
    const commenttext = formData.get("comment-input");

    const item = `<div class="comment-thread">
    <div class="comment-instance">
        <div class="comment-header">
            <img class="comment-profile" src="../MCO1/profile.jpg">
            <div class="comment-name">Placeholder</div>
        </div>
        <div class="comment-body">
            ${commenttext}
        </div>
        <div>
            <button class="reply-button">Reply</button>
        </div>
    </div>
    </div>`;

    commentSection.innerHTML += item;
});

commentSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('reply-button')) {
        console.log("Button was pressed");

        const commentInstance = e.target.closest('.comment-instance');

        const replyFormExists = commentInstance.querySelector('.reply-form');
        if (replyFormExists) return; // Prevent creating multiple reply forms

        const item = `<form class="reply-form">
            <input class="reply-input" type="text" value="reply"></input>
            <input class="submit-reply" type="submit" value="Submit">
        </form>`;

        commentInstance.innerHTML += item;

        const replyForm = commentInstance.querySelector('.reply-form');
        replyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const replyInput = replyForm.querySelector('.reply-input');
            const replyText = replyInput.value;

            const replyItem = `<div class="comment-thread">
                <div class="comment-instance">
                    <div class="comment-header">
                        <img class="comment-profile" src="../MCO1/profile.jpg">
                        <div class="comment-name">Placeholder</div>
                    </div>
                    <div class="comment-body">
                        ${replyText}
                    </div>
                    <div>
                        <button class="reply-button">Reply</button>
                    </div>
                </div>
            </div>`;

            const replyContainer = commentInstance.querySelector('.comment-body + div');
            replyContainer.innerHTML += replyItem;
            replyForm.remove();

            
        });
    }
});
