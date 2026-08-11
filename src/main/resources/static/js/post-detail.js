function getPostId() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadPost() {
  const id = getPostId();
  const el = document.getElementById('post-detail');
  try {
    const post = await apiRequest('/posts/' + id);
    const isOwner = isLoggedIn() && getUsername() === post.authorUsername;

    el.innerHTML = `
      <div class="card">
        <h2>${escapeHtml(post.title)}</h2>
        <div class="meta">by ${escapeHtml(post.authorUsername)} &middot; ${timeAgo(post.createdAt)}</div>
        <p style="white-space:pre-wrap;">${escapeHtml(post.content)}</p>
        ${isOwner ? `
        <div class="post-actions">
          <button class="delete-btn" onclick="deletePost(${post.id})">Delete Post</button>
        </div>` : ''}
      </div>
    `;
    loadComments(id);
  } catch (err) {
    el.innerHTML = `<div class="error">Could not load post: ${err.message}</div>`;
  }
}

async function loadComments(postId) {
  const el = document.getElementById('comments-container');
  try {
    const comments = await apiRequest(`/posts/${postId}/comments`);
    if (comments.length === 0) {
      el.innerHTML = '<div class="empty-state">No comments yet.</div>';
      return;
    }
    el.innerHTML = comments.map(c => `
      <div class="comment">
        <p>${escapeHtml(c.content)}</p>
        <div class="meta">${escapeHtml(c.authorUsername)} &middot; ${timeAgo(c.createdAt)}
          ${isLoggedIn() && getUsername() === c.authorUsername ? ` &middot; <a href="#" onclick="deleteComment(${postId}, ${c.id}); return false;">delete</a>` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) {
    el.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

async function handleAddComment(e) {
  e.preventDefault();
  const postId = getPostId();
  const content = document.getElementById('comment-content').value.trim();
  const errorEl = document.getElementById('comment-error');
  errorEl.textContent = '';
  if (!content) return;

  try {
    await apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    document.getElementById('comment-content').value = '';
    loadComments(postId);
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

async function deleteComment(postId, commentId) {
  if (!confirm('Delete this comment?')) return;
  try {
    await apiRequest(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
    loadComments(postId);
  } catch (err) {
    alert(err.message);
  }
}

async function deletePost(postId) {
  if (!confirm('Delete this post? This cannot be undone.')) return;
  try {
    await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message);
  }
}
