# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: Use `localStorage` to save the current state in the browser that persists when the browser is refreshed ✅
- **Bonus**: Use timestamps and dynamically track the time since the comment or reply was posted ✅

### Links

- Solution URL: [GitHub Repository](https://github.com/noob-coder6/interactive-comments-section.git)
- Live Site URL: [Live Demo](https://noob-coder6.github.io/interactive-comments-section/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- CSS Grid and Flexbox
- Vanilla JavaScript (ES6+)
- Mobile-first responsive design
- LocalStorage API for data persistence
- Dynamic DOM manipulation

### What I learned

This project significantly improved my JavaScript skills, particularly in:

#### 1. Working with LocalStorage
I learned how to persist data across browser sessions:

```js
const saveData = () => {
    localStorage.setItem('interactive-comments-data', JSON.stringify(data));
};
```

#### 2. Recursive Functions
Understanding how to search through nested data structures (comments with nested replies):

```js
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
```

#### 3. Event Delegation
Instead of adding event listeners to every button, I used a single listener on the parent container:

```js
commentsContainer.addEventListener('click', handleCommentActions);
```

#### 4. Dynamic Time Calculation
Converting timestamps to relative time strings:

```js
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    // ... more time calculations
};
```

#### 5. Template Literals for Dynamic HTML
Creating complex HTML structures with embedded JavaScript:

```js
commentCard.innerHTML = `
    <div class="score-counter">
        <button class="plus-btn">+</button>
        <span class="score">${comment.score}</span>
        <button class="minus-btn">-</button>
    </div>
    ${isCurrentUser ? '<span class="you-badge">you</span>' : ''}
`;
```

#### 6. Array Manipulation Methods
- `.sort()` for ordering comments by score
- `.findIndex()` for locating items
- `.splice()` for removing items
- `.some()` for checking conditions

#### 7. CSS Grid Layout
Using `grid-template-columns: auto 1fr;` to create a flexible two-column layout where the score counter takes minimal space and the comment content expands to fill remaining space.

### Continued development

Areas I want to improve in future projects:

- **State Management**: Explore using a more structured state management approach for complex applications
- **Accessibility**: Add ARIA labels and keyboard navigation support
- **Performance**: Implement virtual scrolling for large comment threads
- **Testing**: Add unit and integration tests
- **Code Organization**: Refactor into modules or consider using a framework like React for better component structure
- **Error Handling**: Add more robust error handling and user feedback
- **Animations**: Add smooth transitions when adding/removing comments
- **Real-time Updates**: Implement WebSocket for multi-user real-time commenting

## Author

- GitHub - [@noob-coder6](https://github.com/noob-coder6)
- Frontend Mentor - [@noob-coder6](https://www.frontendmentor.io/profile/noob-coder6)

---

## Features Implemented

✅ Full CRUD operations (Create, Read, Update, Delete)  
✅ Nested comment replies  
✅ Upvote/downvote functionality  
✅ Edit mode for user's own comments  
✅ Delete confirmation modal  
✅ LocalStorage persistence  
✅ Dynamic timestamp calculation  
✅ Responsive design (mobile & desktop)  
✅ Hover states for interactive elements  
✅ Current user identification ("you" badge)  

## Acknowledgments

Special thanks to Frontend Mentor for providing this challenging project that pushed my JavaScript skills to the next level. The nested comment structure and state management requirements were particularly valuable learning experiences.