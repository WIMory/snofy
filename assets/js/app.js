/* ============================================
   足迹地球 App JavaScript
   ============================================ */

// -------- 模拟数据 --------
const DEMO_USER = {
  name: '用户的卢',
  city: '武汉',
  level: 2,
  footprints: 27,
  posts: 8,
  likes: 156,
  reviews: 42,
  cities: [
    { name: '武汉', progress: 8, total: 10 },
    { name: '洪湖', progress: 2, total: 10 },
    { name: '荆州', progress: 1, total: 10 },
  ]
};

const DEMO_POSTS = [
  {
    id: 1,
    title: '汉口老街那家热干面绝了',
    category: '美食',
    location: '武汉市江汉区 吉庆街',
    body: '开了二十年的老店，辣椒油特别香，每天早上排队的人络绎不绝。芝麻酱是正宗的本地做法，面条筋道有嚼劲。强烈推荐加一份豆皮，配热干面绝了。',
    author: '过早猎人',
    footprints: 23,
    likes: 156,
    timestamp: '2小时前',
    tags: ['过早', '老店'],
    reviews: [
      { user: '小明', text: '确实好吃，但周末排队要1小时，建议工作日去', rating: 'good' },
      { user: '小红', text: '和推文描述基本符合，推荐！', rating: 'good' },
      { user: '张三', text: '一般般，面有点硬', rating: 'bad' },
    ],
    wishlisted: false,
    icon: '🍜'
  },
  {
    id: 2,
    title: '东湖听涛边看日落绝了',
    category: '风景',
    location: '武汉市武昌区 东湖路',
    body: '东湖绿道骑行到听涛区，正好赶上日落。湖面波光粼粼，夕阳把水面染成金色，太美了。推荐下午4点半到6点之间去，光线最好。',
    author: '风光摄影',
    footprints: 18,
    likes: 89,
    timestamp: '5小时前',
    tags: ['东湖', '日落'],
    reviews: [
      { user: '李四', text: '确实很美，但周末人多，建议工作日去', rating: 'good' },
      { user: '王五', text: '和推文描述差不多，推荐！', rating: 'good' },
    ],
    wishlisted: true,
    icon:'🌅'
  },
  {
    id: 3,
    title: '粮道街小众烧烤店',
    category: '美食',
    location: '武汉市武昌区 粮道街',
    body: '本地人才知道的烧烤店，烤串种类多，羊肉串特别嫩。老板人很热情，价格也公道。晚上营业到凌晨2点，适合宵夜。',
    author: '宵夜达人',
    footprints: 12,
    likes: 67,
    timestamp: '1天前',
    tags: ['夜宵', '小众'],
    reviews: [
      { user: '赵六', text: '烤串确实不错，孜然味很香', rating: 'good' },
    ],
    wishlisted: false,
    icon: '🍖'
  },
  {
    id: 4,
    title: '光谷年轻人夜生活',
    category: '娱乐',
    location: '武汉市洪山区 光谷',
    body: '光谷步行街晚上很热闹，各种小店、酒吧、演唱会不断。年轻人聚集地，周末尤其热闹。适合逛街、吃饭、看表演。',
    author: '都市漫游',
    footprints: 31,
    likes: 134,
    timestamp: '2天前',
    tags: ['娱乐', '夜生活'],
    reviews: [],
    wishlisted: false,
    icon: '🎮'
  },
  {
    id: 5,
    title: '汉阳归元寺祈福',
    category: '风景',
    location: '武汉市汉阳区 归元寺路',
    body: '归元寺是武汉最著名的寺庙之一，建筑很有特色，香火旺盛。寺内罗汉堂据说很灵验。适合周末去祈福、散步、拍照。',
    author: '城市探索',
    footprints: 8,
    likes: 45,
    timestamp: '3天前',
    tags: ['寺庙', '文化'],
    reviews: [
      { user: '周七', text: '寺庙很安静，适合散心', rating: 'good' },
      { user: '吴八', text: '门票有点贵', rating: 'neutral' },
    ],
    wishlisted: false,
    icon: '🏛️'
  },
  {
    id: 6,
    title: '武汉长江大桥拍照点',
    category: '风景',
    location: '武汉市武昌区 武汉长江大桥',
    body: '武汉标志性建筑，桥上可以看到武汉三镇全景。建议傍晚去，可以同时看到日落和夜景亮灯。大桥二层有观景平台。',
    author: '摄影爱好者',
    footprints: 45,
    likes: 203,
    timestamp: '4天前',
    tags: ['大桥', '拍照点'],
    reviews: [
      { user: '郑九', text: '拍照效果很震撼，推荐！', rating: 'good' },
    ],
    wishlisted: false,
    icon:'🌉'
  },
];

const DEMO_MESSAGES = [
  { id: 1, type: 'review', from: '小明', avatar: '🍜', post: '东湖听涛边看日落绝了', text: '确实很美，但周末人多，建议工作日去', time: '3分钟前', action: '回复' },
  { id: 2, type: 'like', from: '小红的卢', avatar: '❤️', post: '汉口老街热干面绝了', text: '', time: '10分钟前', action: '' },
  { id: 3, type: 'follow', from: '用户的卢', avatar: '👤', post: '', text: '关注了你', time: '30分钟前', action: '' },
  { id: 4, type: 'system', from: '🏙️', avatar: '🏙️', post: '', text: '城市点亮升级！你在武汉打卡满3次，解锁「光晕」效果', time: '1小时前', action: '' },
  { id: 5, type: 'review', from: '李四', avatar: '🌅', post: '东湖日落', text: '确实很美，强烈推荐', time: '2小时前', action: '回复' },
];

let currentPage = 'footprint';
let currentPostId = null;
let selectedCategory = '全部';
let publishedPhotos = [];

// -------- 页面切换 --------
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;

  // 更新底部导航
  const navMap = { footprint: 0, community: 1, publish: -1, messages: 3, me: 4, 'post-detail': -1, wishlist: -1, 'my-posts': -1 };
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    item.classList.toggle('active', i === navMap[page]);
  });

  if (page === 'community') renderPosts();
  if (page === 'messages') renderMessages();
  if (page === 'me') renderMe();
  if (page === 'wishlist') renderWishlist();
  if (page === 'my-posts') renderMyPosts();
  if (page === 'post-detail' && currentPostId) renderPostDetail(currentPostId);
}

function switchTab(tab) {
  if (tab === 'publish') {
    showPage('publish');
  } else {
    showPage(tab);
  }
}

// -------- 足迹页 --------
function hideCityMap() {
  document.getElementById('city-map').style.display = 'none';
  document.getElementById('globe').style.display = 'flex';
}

document.getElementById('globe') && document.getElementById('globe').addEventListener('dblclick', function() {
  document.getElementById('globe').style.display = 'none';
  document.getElementById('city-map').style.display = 'block';
});

document.querySelectorAll('.mode-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.mode-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// -------- 社区页 --------
function renderPosts(filter) {
  const grid = document.getElementById('post-grid');
  if (!grid) return;
  const filtered = filter && filter !== '全部'
    ? DEMO_POSTS.filter(p => p.category === filter)
    : DEMO_POSTS;
  grid.innerHTML = filtered.map(post => `
    <div class="post-card" onclick="openPostDetail(${post.id})">
      <div class="post-card-img">${post.icon}</div>
      <div class="post-card-body">
        <div class="post-card-title">${post.title}</div>
        <div class="post-card-meta">
          <span>❤️ ${post.likes}</span>
          <span>👣 ${post.footprints}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openPostDetail(postId) {
  currentPostId = postId;
  showPage('post-detail');
}

function renderPostDetail(postId) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  const container = document.getElementById('post-detail-content');
  container.innerHTML = `
    <div class="post-detail-img">${post.icon}</div>
    <div class="post-detail-body">
      <div class="post-detail-title">${post.title}</div>
      <div class="post-detail-meta">
        <span>📍 ${post.location}</span>
        <span>🏷 ${post.category}</span>
      </div>
      <div class="post-detail-text">${post.body}</div>
      <div class="post-detail-tags" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        ${post.tags.map(t => '<span style="background:#EFF6FF;color:#1E3A5F;padding:4px10px;border-radius:12px;font-size:0.75rem;">#' + t + '</span>').join('')}
      </div>
    </div>
    <div style="padding:0 16px;">
      <div class="post-checkins">
        <div class="checkins-title">👣 已有 ${post.footprints} 人打卡</div>
        <div class="checkins-avatars">
          ${Array.from({length: Math.min(post.footprints, 8)}, (_, i) =>
            '<div class="checkin-avatar">' + ['🍜','🌅','🍖','🎮','🏛️','🌉','📷','🗺️'][i] + '</div>'
          ).join('')}
          ${post.footprints > 8 ? '<span class="checkin-count">+' + (post.footprints - 8) + '</span>' : ''}
        </div>
      </div>
      <div class="post-reviews">
        <div class="reviews-title">真实评价（${post.reviews.length}条）</div>
        ${post.reviews.length === 0 ? '<p style="font-size:0.85rem;color:#94A3B8;">暂无评价，成为第一个打卡者？</p>' :
          post.reviews.map(r => `
            <div class="review-item">
              <div class="review-user">${r.user} ${r.rating === 'good' ? '✅' : r.rating === 'bad' ? '⚠️' :'😐'}</div>
              <div class="review-text">"${r.text}"</div>
            </div>
          `).join('')
        }
      </div>
    </div>
    <div class="post-actions">
      <div class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id}, this)">
        ❤️ ${post.likes}
      </div>
      <div class="action-btn" onclick="toggleWishlist(${post.id}, this)">
        🔖 ${post.wishlisted ? '取消想去' : '想去'}
      </div>
      <div class="action-btn" onclick="showPage('publish')">
        📍 去打卡
      </div>
      <div class="action-btn" onclick="sharePost(${post.id})">
        🔗分享
      </div>
    </div>
  `;
}

function toggleLike(postId, el) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  if (post.liked) {
    post.likes--;
    post.liked = false;
  } else {
    post.likes++;
    post.liked = true;
  }
  el.classList.toggle('liked', post.liked);
  el.innerHTML = '❤️ ' + post.likes;
}

function toggleWishlist(postId, el) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  post.wishlisted = !post.wishlisted;
  el.innerHTML = post.wishlisted ? '🔖取消想去' : '🔖 想去';
  DEMO_USER.wishlist = DEMO_POSTS.filter(p => p.wishlisted);
  if (post.wishlisted) {
    alert('已添加到想去清单');
  }
}

function sharePost(postId) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (navigator.share) {
    navigator.share({ title: post.title, text: post.body, url: location.href });
  } else {
    alert('链接已复制，快去分享给好友吧！');
  }
}

document.querySelectorAll('.community-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.community-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderPosts(this.textContent);
  });
});

// -------- 发布页 --------
function addPhoto() {
  const container = document.getElementById('photo-upload');
  if (publishedPhotos.length >= 9) {
    alert('最多上传9张图片'); return;
  }
  publishedPhotos.push('📷');
  renderPhotos();
}

function renderPhotos() {
  const container = document.getElementById('photo-upload');
  if (publishedPhotos.length === 0) {
    container.innerHTML = '<span>📷 点击添加图片</span><small>最多9张</small>';
  } else {
    container.innerHTML = '<span>✅ 已添加 ' + publishedPhotos.length + ' 张（点击继续添加）</span><small>最多9张</small>';
  }
}

function publishPost() {
  const title = document.getElementById('input-title').value.trim();
  const body = document.getElementById('input-body').value.trim();
  const location = document.getElementById('input-location').value.trim();
  const category = document.getElementById('input-category').value;
  const price = document.getElementById('input-price').value;

  if (!title) { alert('请输入标题'); return; }
  if (!body) { alert('请输入正文'); return; }

  const newPost = {
    id: Date.now(),
    title,
    category,
    location: location || '武汉市',
    body,
    author: DEMO_USER.name,
    footprints: 0,
    likes: 0,
    timestamp: '刚刚',
    tags: [category],
    reviews: [],
    wishlisted: false,
    icon: category === '美食' ? '🍜' : category === '风景' ? '🏞️' : '🎮'
  };
  DEMO_POSTS.unshift(newPost);
  alert('发布成功！你的推文已出现在地球仪上');
  document.getElementById('input-title').value = '';
  document.getElementById('input-body').value = '';
  document.getElementById('input-location').value = '';
  document.getElementById('input-price').value = '';
  publishedPhotos = [];
  renderPhotos();
  showPage('community');
}

// -------- 消息页 --------
function renderMessages() {
  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = DEMO_MESSAGES.map(msg => `
    <div class="message-item">
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div class="msg-title">${msg.from} ${msg.type === 'review' ? '评价了你的打卡' : msg.type === 'like' ? '点赞了你的推文' : msg.type === 'follow' ? '关注了你' : ''}</div>
        <div class="msg-text">${msg.post ? '"' + msg.post + '" ' : ''}${msg.text}</div>
        <div class="msg-time">${msg.time}</div>
      </div>
      ${msg.action ? '<span class="msg-action" onclick="alert(\'功能开发中...\')">${msg.action}</span>' : ''}
    </div>
  `).join('');
}

document.querySelectorAll('.message-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.message-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// -------- 我的页 --------
function renderMe() {
  document.querySelector('.profile-name').textContent = DEMO_USER.name;
  document.querySelector('.profile-city').textContent = '📍 ' + DEMO_USER.city + ' · 点亮阶段' + DEMO_USER.level;
  document.querySelectorAll('.stat-num')[0].textContent = DEMO_USER.cities.length;
  document.querySelectorAll('.stat-num')[1].textContent = DEMO_USER.footprints;
  document.querySelectorAll('.stat-num')[2].textContent = DEMO_USER.posts;
  document.querySelectorAll('.stat-num')[3].textContent = DEMO_USER.likes;

  const progressItems = document.querySelectorAll('.progress-item');
  DEMO_USER.cities.forEach((city, i) => {
    if (progressItems[i]) {
      const pct = (city.progress / city.total) * 100;
      progressItems[i].querySelector('.progress-fill').style.width = pct + '%';
      progressItems[i].querySelector('.progress-count').textContent = city.progress + '/' + city.total;
    }
  });
}

// -------- 想去清单 --------
function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;
  const wishlisted = DEMO_POSTS.filter(p => p.wishlisted);
  if (wishlisted.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#94A3B8;padding:40px;font-size:0.9rem;">还没有收藏推文，去社区看看吧</p>';
    return;
  }
  grid.innerHTML = wishlisted.map(post => `
    <div class="post-card" onclick="openPostDetail(${post.id})">
      <div class="post-card-img">${post.icon}</div>
      <div class="post-card-body">
        <div class="post-card-title">${post.title}</div>
        <div class="post-card-meta">
          <span>📍 ${post.location}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// -------- 我的推文 --------
function renderMyPosts() {
  const list = document.getElementById('my-posts-list');
  if (!list) return;
  const myPosts = DEMO_POSTS.filter(p => p.author === DEMO_USER.name);
  list.innerHTML = myPosts.map(post => `
    <div class="my-post-item" onclick="openPostDetail(${post.id})">
      <div class="my-post-title">${post.icon} ${post.title}</div>
      <div class="my-post-meta">
        <span>❤️ ${post.likes}</span>
        <span>👣 ${post.footprints}打卡</span>
        <span>💬 ${post.reviews.length}评价</span>
      </div>
    </div>
  `).join('');
  if (myPosts.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#94A3B8;padding:40px;font-size:0.9rem;">你还没有发布推文，去发布第一条吧</p>';
  }
}

// -------- 初始化 --------
document.addEventListener('DOMContentLoaded', function() {
  // 渲染初始数据
  renderPosts();
  renderMe();
  renderMessages();

  // 底部导航点击
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const page = this.getAttribute('data-page') || this.querySelector('.nav-label')?.textContent;
    });
  });
});