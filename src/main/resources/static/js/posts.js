function timeAgo(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadPosts() {
  const container = document.getElementById('posts-container');
  const search = document.getElementById('search') ? document.getElementById('search').value : '';
  try {
    const params = new URLSearchParams({ page: 0, size: 20 });
    if (search) params.set('search', search);
    const data = await apiRequest('/posts?' + params.toString());

    if (!data.content || data.content.length === 0) {
      container.innerHTML = '<div class="empty-state">No posts yet. Be the first to write one!</div>';
      return;
    }

    container.innerHTML = data.content.map(post => `
      <div class="card">
        <h2>${escapeHtml(post.title)}</h2>
        <div class="meta">by ${escapeHtml(post.authorUsername)} &middot; ${timeAgo(post.createdAt)} &middot; ${post.commentCount} comment${post.commentCount === 1 ? '' : 's'}</div>
        <p>${escapeHtml(post.content.substring(0, 180))}${post.content.length > 180 ? '...' : ''}</p>
        <a class="read-more" href="post.html?id=${post.id}">Read more &amp; comment &rarr;</a>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="error">Failed to load posts: ${err.message}</div>`;
  }
}

async function handleCreatePost(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';

  try {
    const post = await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content })
    });
    window.location.href = 'post.html?id=' + post.id;
  } catch (err) {
    errorEl.textContent = err.message;
  }
}
