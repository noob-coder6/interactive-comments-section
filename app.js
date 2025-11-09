document.addEventListener('DOMContentLoaded', () => {
    const commentsContainer = document.getElementById('comments-container');
    const modalOverlay = document.getElementById('delete-modal-overlay');
    const modalCancelBtn = document.getElementById('modal-cancel');
    const modalConfirmBtn = document.getElementById('modal-confirm');

    let data = {};
    let commentToDelete = null;

    // --- Data Handling ---

    const fetchData = async () => {
        try {
            const storedData = localStorage.getItem('interactive-comments-data');
            if (storedData) {
                data = JSON.parse(storedData);
            } else {
                const response = await fetch('data.json');
                if (!response.ok) throw new Error('Network response was not ok');
                data = await response.json();
                // Convert 'createdAt' to timestamps for easier sorting and relative time calculation
                data.comments.forEach(comment => {
                    comment.createdAt = Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000); // Random time in last 30 days
                    if (comment.replies) {
                        comment.replies.forEach(reply => {
                            reply.createdAt = Date.now() - (Math.random() * 14 * 24 * 60 * 60 * 1000); // Random time in last 14 days
                        });
                    }
                });
                saveData();
            }
            renderApp();
        } catch (error) {
            console.error('Error fetching data:', error);
            commentsContainer.innerHTML = '<p>Error loading comments. Please try again later.</p>';
        }
    };

    const saveData = () => {
        localStorage.setItem('interactive-comments-data', JSON.stringify(data));
    };

    const findComment = (id, comments = data.comments) => {
        for (const comment of comments) {
            if (comment.id === id) return comment;
            if (comment.replies && comment.replies.length > 0) {
                const foundInReply = findComment(id, comment.replies);
                if (foundInReply) return foundInReply;
            }
        }
        return null;
    };

    const findParentComment = (replyId) => {
        for (const comment of data.comments) {
            if (comment.replies.some(reply => reply.id === replyId)) {
                return comment;
            }
        }
        return null;
    }

    // --- Rendering ---

    const renderApp = () => {
        commentsContainer.innerHTML = '';
        data.comments.sort((a, b) => b.score - a.score);
        data.comments.forEach(comment => {
            commentsContainer.appendChild(createCommentElement(comment));
        });
        renderNewCommentForm();
    };

    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };

    const createCommentElement = (comment) => {
        const isCurrentUser = comment.user.username === data.currentUser.username;
        const wrapper = document.createElement('div');
        wrapper.classList.add('comment-wrapper');

        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');
        commentCard.dataset.id = comment.id;

        commentCard.innerHTML = `
            <div class="score-counter">
                <button class="plus-btn" aria-label="Upvote"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.42a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.35H1.096a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v1.23c0 .136.05.254.149.354.1.099.217.148.354.148h3.315v3.35c0 .136.05.254.149.354.1.1.217.149.354.149h1.415Z"/></svg></button>
                <span class="score">${comment.score}</span>
                <button class="minus-btn" aria-label="Downvote"><svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V.822c0-.136-.05-.254-.148-.354a.483.483 0 0 0-.354-.149H1.744A.483.483 0 0 0 1.39.32c-.1.1-.149.217-.149.354v1.334c0 .136.05.254.149.354.1.1.217.149.354.149h7.512Z"/></svg></button>
            </div>
            <div class="comment-main">
                <div class="comment-header">
                    <div class="user-info">
                        <img src="${comment.user.image.png}" alt="${comment.user.username}" class="user-avatar">
                        <span class="username">${comment.user.username}</span>
                        ${isCurrentUser ? '<span class="you-badge">you</span>' : ''}
                        <span class="comment-date">${timeSince(comment.createdAt)}</span>
                    </div>
                    <div class="comment-actions">
                        ${isCurrentUser ? `
                            <div class="user-actions">
                                <button class="delete-btn"><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.88H1.167v8.568Zm10.045-9.702h-3.11V1.166a1.163 1.163 0 0 0-1.166-1.167H5.056a1.163 1.163 0 0 0-1.166 1.167v1.58h-3.11a.583.583 0 0 0-.583.583V3.3h11.667v-.584a.583.583 0 0 0-.583-.583Z"/></svg> Delete</button>
                                <button class="edit-btn"><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a.75.75 0 0 0-.202.34L0 12.87l4.46-1.076a.75.75 0 0 0 .339-.202l8.68-8.68a1.75 1.75 0 0 0 .001-2.328Zm-2.327-1.31L12.44 2.85 3.82 11.47 1.54 12.05l.58-2.28 8.62-8.62Z"/></svg> Edit</button>
                            </div>
                        ` : `
                            <button class="reply-btn"><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875 3.474 7.875 7.875 0 .273-.028.54-.08.796A.657.657 0 0 1 13.04 11.8c-1.83-.896-4.75-1.9-7.951-1.9H6.125v2.187a.656.656 0 0 1-1.085.497L.227 8.31a.657.657 0 0 1 0-.993Z"/></svg> Reply</button>
                        `}
                    </div>
                </div>
                <div class="comment-content">
                    ${comment.replyingTo ? `<span class="replying-to">@${comment.replyingTo}</span>` : ''}
                    ${comment.content}
                </div>
            </div>
        `;

        wrapper.appendChild(commentCard);

        if (comment.replies && comment.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.classList.add('replies-container');
            comment.replies.forEach(reply => {
                repliesContainer.appendChild(createCommentElement(reply));
            });
            wrapper.appendChild(repliesContainer);
        }

        return wrapper;
    };

    const createForm = (formId, buttonText, placeholder, avatarSrc, parentId = null, replyingTo = null) => {
        const form = document.createElement('form');
        form.id = formId;
        form.classList.add('comment-form');
        form.dataset.parentId = parentId || '';
        form.dataset.replyingTo = replyingTo || '';

        form.innerHTML = `
            <img src="${avatarSrc}" alt="Your avatar" class="user-avatar">
            <textarea name="comment" placeholder="${placeholder}" required></textarea>
            <button type="submit" class="btn">${buttonText}</button>
        `;
        return form;
    };

    const renderNewCommentForm = () => {
        // Remove old form if it exists
        const oldForm = document.getElementById('new-comment-form');
        if (oldForm) oldForm.remove();

        const form = createForm('new-comment-form', 'Send', 'Add a comment...', data.currentUser.image.png);
        commentsContainer.insertAdjacentElement('afterend', form);
        form.addEventListener('submit', handleNewCommentSubmit);
    };

    // --- Event Handlers ---

    const handleNewCommentSubmit = (e) => {
        e.preventDefault();
        const textarea = e.target.querySelector('textarea');
        const content = textarea.value.trim();
        if (!content) return;

        const newComment = {
            id: Date.now(),
            content: content,
            createdAt: Date.now(),
            score: 0,
            user: data.currentUser,
            replies: []
        };

        data.comments.push(newComment);
        saveData();
        renderApp();
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const textarea = form.querySelector('textarea');
        const content = textarea.value.trim();
        if (!content) return;

        const parentId = parseInt(form.dataset.parentId);
        const replyingTo = form.dataset.replyingTo;

        const newReply = {
            id: Date.now(),
            content: content,
            createdAt: Date.now(),
            score: 0,
            replyingTo: replyingTo,
            user: data.currentUser
        };

        const parentComment = findComment(parentId);
        if (parentComment) {
            if (!parentComment.replies) {
                parentComment.replies = [];
            }
            parentComment.replies.push(newReply);
            saveData();
            renderApp();
        }
    };

    const handleUpdateSubmit = (e, comment) => {
        e.preventDefault();
        const textarea = e.target.querySelector('.edit-textarea');
        const newContent = textarea.value.trim();
        if (newContent && newContent !== comment.content) {
            comment.content = newContent;
            saveData();
        }
        renderApp(); // Re-render to show updated comment
    };

    const handleCommentActions = (e) => {
        const target = e.target;
        const commentCard = target.closest('.comment-card');
        if (!commentCard) return;

        const commentId = parseInt(commentCard.dataset.id);
        const comment = findComment(commentId);

        // Score update
        if (target.closest('.plus-btn')) {
            comment.score++;
            saveData();
            commentCard.querySelector('.score').textContent = comment.score;
        }

        if (target.closest('.minus-btn')) {
            comment.score = Math.max(0, comment.score - 1);
            saveData();
            commentCard.querySelector('.score').textContent = comment.score;
        }

        // Reply
        if (target.closest('.reply-btn')) {
            // Remove any existing reply forms
            const existingReplyForm = document.querySelector('.reply-form-wrapper');
            if (existingReplyForm) existingReplyForm.remove();

            const replyFormWrapper = document.createElement('div');
            replyFormWrapper.classList.add('reply-form-wrapper');

            const parentCommentId = comment.replyingTo ? findParentComment(comment.id).id : comment.id;

            const replyForm = createForm('reply-form', 'Reply', 'Add a reply...', data.currentUser.image.png, parentCommentId, comment.user.username);
            replyForm.addEventListener('submit', handleReplySubmit);

            replyFormWrapper.appendChild(replyForm);
            commentCard.closest('.comment-wrapper').insertAdjacentElement('afterend', replyFormWrapper);
            replyForm.querySelector('textarea').focus();
        }

        // Delete
        if (target.closest('.delete-btn')) {
            commentToDelete = commentId;
            modalOverlay.classList.remove('hidden');
        }

        // Edit
        if (target.closest('.edit-btn')) {
            const contentDiv = commentCard.querySelector('.comment-content');
            const currentContent = comment.content;

            const editForm = document.createElement('form');
            editForm.classList.add('edit-form');
            editForm.innerHTML = `
                <textarea class="edit-textarea" required>${currentContent}</textarea>
                <button type="submit" class="btn update-btn">Update</button>
            `;

            contentDiv.innerHTML = '';
            contentDiv.appendChild(editForm);
            editForm.querySelector('textarea').focus();

            editForm.addEventListener('submit', (event) => handleUpdateSubmit(event, comment));

            // Hide action buttons while editing
            commentCard.querySelector('.comment-actions').classList.add('hidden');
        }
    };

    const deleteComment = (id) => {
        // Check top-level comments
        const commentIndex = data.comments.findIndex(c => c.id === id);
        if (commentIndex > -1) {
            data.comments.splice(commentIndex, 1);
            return;
        }

        // Check replies
        for (const comment of data.comments) {
            if (comment.replies) {
                const replyIndex = comment.replies.findIndex(r => r.id === id);
                if (replyIndex > -1) {
                    comment.replies.splice(replyIndex, 1);
                    return;
                }
            }
        }
    };

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        commentToDelete = null;
    };

    // --- Event Listeners ---

    commentsContainer.addEventListener('click', handleCommentActions);

    modalCancelBtn.addEventListener('click', closeModal);

    modalConfirmBtn.addEventListener('click', () => {
        if (commentToDelete !== null) {
            deleteComment(commentToDelete);
            saveData();
            renderApp();
        }
        closeModal();
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // --- Initial Load ---
    fetchData();
});