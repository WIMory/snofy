/* ============================================
   足迹地球 App JavaScript (地图版)
   ============================================ */

// -------- 数据 --------
const DEMO_USER = {
  name: '用户的卢', city: '武汉', level: 2,
  footprints: 27, posts: 8, likes: 156, reviews: 42,
  cities: [
    { name: '武汉', progress: 8, total: 10 },
    { name: '洪湖', progress: 2, total: 10 },
    { name: '荆州', progress: 1, total: 10 },
  ]
};

// 武汉推文数据
const DEMO_POSTS = [
  { id:1, title:'汉口老街那家热干面绝了', category:'美食', location:'武汉市江汉区 吉庆街', lat:30.572, lng:114.287, body:'开了二十年的老店，辣椒油特别香。芝麻酱正宗，面条筋道。强烈推荐加一份豆皮，配热干面绝了。', author:'过早猎人', footprints:23, likes:156, timestamp:'2小时前', tags:['过早','老店'], reviews:[{user:'小明',text:'确实好吃，但周末排队要1小时',rating:'good'},{user:'小红',text:'和推文描述基本符合',rating:'good'},{user:'张三',text:'一般般，面有点硬',rating:'bad'}], wishlisted:false, icon:'🍜' },
  { id:2, title:'东湖听涛边看日落绝了', category:'风景', location:'武汉市武昌区 东湖路', lat:30.553, lng:114.318, body:'东湖绿道骑行到听涛区，正好赶上日落。湖面波光粼粼，夕阳把水面染成金色，太美了。', author:'风光摄影', footprints:18, likes:89, timestamp:'5小时前', tags:['东湖','日落'], reviews:[{user:'李四',text:'确实很美，周末人多',rating:'good'}], wishlisted:true, icon:'🌅' },
  { id:3, title:'粮道街小众烧烤店', category:'美食', location:'武汉市武昌区 粮道街', lat:30.547, lng:114.308, body:'本地人才知道的烧烤店，烤串种类多，羊肉串特别嫩。老板人很热情，价格公道。晚上营业到凌晨2点。', author:'宵夜达人', footprints:12, likes:67, timestamp:'1天前', tags:['夜宵','小众'], reviews:[{user:'赵六',text:'烤串确实不错',rating:'good'}], wishlisted:false, icon:'🍖' },
  { id:4, title:'光谷年轻人夜生活', category:'娱乐', location:'武汉市洪山区 光谷', lat:30.499, lng:114.415, body:'光谷步行街晚上很热闹，各种小店、酒吧不断。年轻人聚集地，周末尤其热闹。适合逛街、吃饭。', author:'都市漫游', footprints:31, likes:134, timestamp:'2天前', tags:['娱乐','夜生活'], reviews:[], wishlisted:false, icon:'🎮' },
  { id:5, title:'汉阳归元寺祈福', category:'风景', location:'武汉市汉阳区 归元寺路', lat:30.549, lng:114.264, body:'归元寺是武汉最著名的寺庙之一，建筑很有特色，香火旺盛。寺内罗汉堂据说很灵验。', author:'城市探索', footprints:8, likes:45, timestamp:'3天前', tags:['寺庙','文化'], reviews:[{user:'周七',text:'寺庙很安静，适合散心',rating:'good'},{user:'吴八',text:'门票有点贵',rating:'neutral'}], wishlisted:false, icon:'🏛️' },
  { id:6, title:'武汉长江大桥', category:'风景', location:'武汉市武昌区 武汉长江大桥', lat:30.543, lng:114.293, body:'武汉标志性建筑，桥上可以看到武汉三镇全景。建议傍晚去，可以同时看到日落和夜景亮灯。', author:'摄影爱好者', footprints:45, likes:203, timestamp:'4天前', tags:['大桥','拍照点'], reviews:[{user:'郑九',text:'拍照效果很震撼',rating:'good'}], wishlisted:false, icon:'🌉' },
];

const DEMO_MESSAGES = [
  { id:1, type:'review', from:'小明', avatar:'🍜', post:'东湖听涛边看日落绝了', text:'确实很美，但周末人多，建议工作日去', time:'3分钟前', action:'回复' },
  { id:2, type:'like', from:'小红的卢', avatar:'❤️', post:'汉口老街热干面绝了', text:'', time:'10分钟前', action:'' },
  { id:3, type:'follow', from:'用户的卢', avatar:'👤', post:'', text:'关注了你', time:'30分钟前', action:'' },
  { id:4, type:'system', from:'🏙️', avatar:'🏙️', post:'', text:'城市点亮升级！你在武汉打卡满3次，解锁「光晕」效果', time:'1小时前', action:'' },
  { id:5, type:'review', from:'李四', avatar:'🌅', post:'东湖日落', text:'确实很美，强烈推荐', time:'2小时前', action:'回复' },
];

let currentPostId = null;
let publishedPhotos = [];

// -------- 全局地图实例 --------
let mainMap = null;
let cityMap = null;
let currentMapMode = 'footprint';

// -------- 页面切换 --------
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    if (page === 'footprint' && mainMap) {
      setTimeout(() => mainMap.invalidateSize(), 50);
    }
    if (page === 'community') renderPosts();
    if (page === 'messages') renderMessages();
    if (page === 'me') renderMe();
    if (page === 'wishlist') renderWishlist();
    if (page === 'my-posts') renderMyPosts();
    if (page === 'post-detail' && currentPostId) renderPostDetail(currentPostId);
  }
  updateNavActive(page);
}

function updateNavActive(page) {
  const map = { footprint:0, community:1, messages:3, me:4 };
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    const label = item.querySelector('.nav-label')?.textContent;
    if (label === '足迹') item.classList.toggle('active', page === 'footprint');
    else if (label === '社区') item.classList.toggle('active', page === 'community');
    else if (label === '消息') item.classList.toggle('active', page === 'messages');
    else if (label === '我的') item.classList.toggle('active', page === 'me');
  });
}

function switchTab(tab) {
  if (tab === 'publish') { showPage('publish'); }
  else if (tab === 'footprint') { showPage('footprint'); }
  else { showPage(tab); }
}

// -------- 地图初始化 --------
function initMainMap() {
  if (mainMap) { mainMap.remove(); mainMap = null; }

  mainMap = L.map('map', {
    center: [30.52, 114.31], zoom: 10, zoomControl: false,
    attributionControl: true,
  });

  // 高德街道图层
  const streetLayer = L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234', attribution: '© 高德地图', maxZoom: 18,
  });

  // 高德卫星图层
  const satelliteLayer = L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234', attribution: '© 高德地图', maxZoom: 18,
  });

  streetLayer.addTo(mainMap);
  mainMap.streetLayer = streetLayer;
  mainMap.satelliteLayer = satelliteLayer;

  // 缩放控件
  L.control.zoom({ position: 'topright' }).addTo(mainMap);

  // 添加推文标记
  addPostMarkers();

  // 双击放大进入城市地图
  mainMap.on('dblclick', function(e) {
    const lat = e.latlng.lat, lng = e.latlng.lng;
    showCityMap(lat, lng);
  });
}

function addPostMarkers() {
  if (!mainMap) return;
  // 清除旧标记
  mainMap.eachLayer(layer => {
    if (layer instanceof L.Marker && !(layer instanceof L.TileLayer)) {
      mainMap.removeLayer(layer);
    }
  });

  // 推文标记
  DEMO_POSTS.forEach(post => {
    const color = post.category === '美食' ? '#EF4444' : post.category === '风景' ? '#10B981' : '#8B5CF6';
    const icon = L.divIcon({
      html: `<div style="
        width:32px;height:32px;border-radius:50%50% 50% 0;
        background:${color};border:2px solid #fff;
        transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.25);
        display:flex;align-items:center;justify-content:center;
      "><span style="transform:rotate(45deg);color:#fff;font-size:14px">${post.icon ==='🌉' ? '🌉' : post.icon}</span></div>`,
      className: '', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
    });

    const marker = L.marker([post.lat, post.lng], { icon }).addTo(mainMap);
    marker.on('click', () => { currentPostId = post.id; showPage('post-detail'); });
  });

  // 足迹点（模拟用户打卡位置，微小偏移避免遮挡）
  const footprintPositions = [
    [30.575, 114.289], [30.553, 114.318], [30.572, 114.287],
    [30.548, 114.307], [30.500, 114.415], [30.549, 114.264],
    [30.543, 114.293], [30.570, 114.290], [30.560, 114.305],
    [30.554, 114.312],
  ];
  footprintPositions.forEach((pos, i) => {
    const grade = i < 5 ? 'copper' : i < 9 ? 'silver' : 'gold';
    const color = grade === 'copper' ? '#CD7F32' : grade === 'silver' ? '#C0C0C0' : '#FFD700';
    const icon = L.divIcon({
      html: `<div style="
        width:14px;height:14px;border-radius:50%;
        background:${color};border:2px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      className: '', iconSize: [14, 14], iconAnchor: [7, 7],
    });
    L.marker([pos[0] + (Math.random()-0.5)*0.002, pos[1] + (Math.random()-0.5)*0.002], { icon }).addTo(mainMap);
  });
}

function addHeatMarkers() {
  if (!mainMap) return;
  mainMap.eachLayer(layer => {
    if (layer instanceof L.Circle) mainMap.removeLayer(layer);
  });
  // 推荐热力：推文密集区域用圆表示
  const hotspots = [
    { lat:30.553, lng:114.318, r:2000, label:'东湖热门' },
    { lat:30.572, lng:114.287, r:1500, label:'吉庆街热门' },
    { lat:30.547, lng:114.308, r:1200, label:'粮道街' },
  ];
  hotspots.forEach(h => {
    L.circle([h.lat, h.lng], { radius: h.r, color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.15, weight: 1, dashArray: '4,4' }).addTo(mainMap);
  });
}

function addZoneMarkers() {
  if (!mainMap) return;
  mainMap.eachLayer(layer => {
    if (layer instanceof L.Circle || (layer instanceof L.Marker && layer._isZone)) mainMap.removeLayer(layer);
  });
  // 功能区：用户想去城市的功能标记
  DEMO_POSTS.forEach(post => {
    const icon = L.divIcon({
      html: `<div style="
        padding:4px 8px;background:#1E3A5F;color:#fff;border-radius:8px;
        font-size:11px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);
      ">📍 ${post.category}</div>`,
      className: '', iconSize: [80, 28], iconAnchor: [40, 14],
    });
    const m = L.marker([post.lat +0.003, post.lng + 0.003], { icon });
    m._isZone = true;
    m.addTo(mainMap);
  });
}

// -------- 地图模式切换 --------
document.querySelectorAll('.mode-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.mode-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentMapMode = this.dataset.mode;
    if (currentMapMode === 'footprint') addPostMarkers();
    else if (currentMapMode === 'heat') addHeatMarkers();
    else if (currentMapMode === 'zone') addZoneMarkers();
  });
});

// -------- 2D/卫星切换 --------
function toggleMapStyle(style) {
  document.querySelectorAll('.page-header .btn-2d3d').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (!mainMap) return;
  if (style === '2d') {
    mainMap.removeLayer(mainMap.satelliteLayer);
    if (!mainMap.hasLayer(mainMap.streetLayer)) mainMap.streetLayer.addTo(mainMap);
  } else {
    mainMap.removeLayer(mainMap.streetLayer);
    if (!mainMap.hasLayer(mainMap.satelliteLayer)) mainMap.satelliteLayer.addTo(mainMap);
  }
}

// -------- 城市地图 --------
function showCityMap(lat, lng) {
  document.getElementById('map').style.display = 'none';
  const cityView = document.getElementById('city-map-view');
  cityView.style.display = 'flex';

  setTimeout(() => {
    if (cityMap) { cityMap.remove(); cityMap = null; }
    cityMap = L.map('city-map', { center: [lat, lng], zoom: 14, zoomControl: true });
    L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
      subdomains: '1234', maxZoom: 18,
    }).addTo(cityMap);

    // 城市内推文标记
    DEMO_POSTS.forEach(post => {
      const color = post.category === '美食' ? '#EF4444' : post.category === '风景' ? '#10B981' : '#8B5CF6';
      const icon = L.divIcon({
        html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${color};border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:#fff;font-size:15px">${post.icon}</span></div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
      });
      const m = L.marker([post.lat, post.lng], { icon }).addTo(cityMap);
      m.on('click', () => { currentPostId = post.id; showPage('post-detail'); });
    });

    // 足迹点
    const fpPos = [[30.575,114.289],[30.553,114.318],[30.572,114.287],[30.548,114.307],[30.570,114.290],[30.560,114.305]];
    fpPos.forEach((pos, i) => {
      const colors = ['#CD7F32','#CD7F32','#C0C0C0','#FFD700','#C0C0C0','#FFD700'];
      const icon = L.divIcon({
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${colors[i]};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        className:'', iconSize:[16,16], iconAnchor:[8,8],
      });
      L.marker([pos[0], pos[1]], { icon }).addTo(cityMap);
    });
  }, 100);
}

function hideCityMap() {
  if (cityMap) { cityMap.remove(); cityMap = null; }
  document.getElementById('city-map-view').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  setTimeout(() => { if (mainMap) mainMap.invalidateSize(); }, 50);
}

function toggleCityMapStyle(style) {
  // 城市地图暂用同一图层
}

// -------- 定位按钮 --------
function goToLocation() {
  if (!mainMap) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      mainMap.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1 });
    }, () => {
      // fallback 到武汉中心
      mainMap.flyTo([30.52, 114.31], 12, { duration: 1 });
    });
  } else {
    mainMap.flyTo([30.52, 114.31], 12, { duration: 1 });
  }
}

// -------- 社区页 --------
function renderPosts(filter) {
  const grid = document.getElementById('post-grid');
  if (!grid) return;
  const filtered = filter && filter !== '全部' && filter !== '我的'
    ? DEMO_POSTS.filter(p => p.category === filter)
    : filter === '我的' ? DEMO_POSTS.filter(p => p.author === DEMO_USER.name) : DEMO_POSTS;
  grid.innerHTML = filtered.map(post => `
    <div class="post-card" onclick="openPostDetail(${post.id})">
      <div class="post-card-img">${post.icon}</div>
      <div class="post-card-body">
        <div class="post-card-title">${post.title}</div>
        <div class="post-card-meta">
          <span>❤️ ${post.likes}</span>
          <span>👣 ${post.footprints}</span>
         <span>📍 ${post.location.split(' ').pop()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openPostDetail(postId) { currentPostId = postId; showPage('post-detail'); }

function renderPostDetail(postId) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  const container = document.getElementById('post-detail-content');
  const ratingIcon = r => r === 'good' ? '✅' : r === 'bad' ? '⚠️' : '😐';
  container.innerHTML = `
    <div class="post-detail-img">${post.icon}</div>
    <div class="post-detail-body">
      <div class="post-detail-title">${post.title}</div>
      <div class="post-detail-meta">
        <span>📍 ${post.location}</span>
        <span>🏷 ${post.category}</span>
        <span>👣 ${post.footprints}人打卡</span>
      </div>
      <div class="post-detail-text">${post.body}</div>
      <div class="post-detail-tags">
        ${post.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('')}
      </div>
    </div>
    <div class="post-checkins" style="padding:0 16px12px;">
      <div class="checkins-title">👣 已有 ${post.footprints} 人打卡</div>
      <div class="checkins-avatars">
        ${Array.from({length: Math.min(post.footprints, 6)}, (_, i) =>
          `<div class="checkin-avatar">${['🍜','🌅','🍖','🎮','🏛️','🌉'][i]}</div>`
        ).join('')}
        ${post.footprints > 6 ? `<span class="checkin-count">+${post.footprints - 6}</span>` : ''}
      </div>
    </div>
    <div class="reviews-title">真实评价（${post.reviews.length}条）</div>
    <div class="reviews-container">
      ${post.reviews.length === 0
        ? '<div class="no-reviews">暂无评价，成为第一个打卡者？</div>'
        : post.reviews.map(r => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-user">${r.user}</span>
              <span class="review-rating">${ratingIcon(r.rating)}</span>
            </div>
            <div class="review-text">"${r.text}"</div>
          </div>
        `).join('')
      }
    </div>
    <div class="post-actions">
      <div class="action-btn" onclick="toggleLike(${post.id}, this)">❤️ ${post.likes}</div>
      <div class="action-btn" onclick="toggleWishlist(${post.id},this)">🔖 ${post.wishlisted ? '取消' : '想去'}</div>
      <div class="action-btn" onclick="showPage('publish')">📍 打卡</div>
      <div class="action-btn" onclick="sharePost()">🔗</div>
    </div>
  `;
}

function toggleLike(postId, el) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  if (post.liked) { post.likes--; post.liked = false; el.classList.remove('liked'); }
  else { post.likes++; post.liked = true; el.classList.add('liked'); }
  el.innerHTML = '❤️ ' + post.likes;
}

function toggleWishlist(postId, el) {
  const post = DEMO_POSTS.find(p => p.id === postId);
  if (!post) return;
  post.wishlisted = !post.wishlisted;
  el.innerHTML = post.wishlisted ? '🔖 取消' : '🔖 想去';
  if (post.wishlisted) alert('已添加到想去清单');
}

function sharePost() { alert('分享链接已复制'); }

// 社区分类切换
document.querySelectorAll('.community-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.community-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderPosts(this.dataset.cat);
  });
});

// -------- 发布页 --------
function addPhoto() {
  if (publishedPhotos.length >= 9) { alert('最多9张图片'); return; }
  publishedPhotos.push('📷');
  const c = document.getElementById('photo-upload');
  c.innerHTML = `<span>✅ 已添加 ${publishedPhotos.length} 张</span><small>点击继续添加</small>`;
}

function publishPost() {
  const title = document.getElementById('input-title').value.trim();
  const body = document.getElementById('input-body').value.trim();
  const location = document.getElementById('input-location').value.trim();
  const category = document.getElementById('input-category').value;
  if (!title) { alert('请输入标题'); return; }
  if (!body) { alert('请输入正文'); return; }
  const icons = { '美食':'🍜', '风景':'🏞️', '娱乐':'🎮' };
  const newPost = {
    id: Date.now(), title, category, location: location || '武汉市',
    lat: 30.52 + (Math.random()-0.5)*0.05, lng: 114.31 + (Math.random()-0.5)*0.05,
    body, author: DEMO_USER.name, footprints: 0, likes: 0, timestamp: '刚刚',
    tags: [category], reviews: [], wishlisted: false, icon: icons[category],
  };
  DEMO_POSTS.unshift(newPost);
  alert('发布成功！推文已出现在地图上');
  ['input-title','input-body','input-location','input-price'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('input-category').value = '美食';
  publishedPhotos = [];
  document.getElementById('photo-upload').innerHTML = '<span>📷 点击添加图片</span><small>最多9张</small>';
  showPage('community');
  if (mainMap) addPostMarkers();
}

// -------- 消息页 --------
function renderMessages() {
  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = DEMO_MESSAGES.map(msg => `
    <div class="message-item">
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div class="msg-title">${msg.from} ${msg.type==='review'?'评价了你的打卡':msg.type==='like'?'点赞了你的推文':msg.type==='follow'?'关注了你':''}</div>
        <div class="msg-text">${msg.post?'"'+msg.post+'" ':''}${msg.text}</div>
        <div class="msg-time">${msg.time}</div>
      </div>
      ${msg.action ? `<span class="msg-action">${msg.action}</span>` : ''}
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
  DEMO_USER.cities.forEach((city, i) => {
    const map = { '武汉':'prog-wuhan', '洪湖':'prog-honghu', '荆州':'prog-jingzhou' };
    const el = document.getElementById(map[city.name]);
    if (el) el.style.width = (city.progress / city.total * 100) + '%';
  });
}

// -------- 想去清单 --------
function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;
  const wishlisted = DEMO_POSTS.filter(p => p.wishlisted);
  grid.innerHTML = wishlisted.length === 0
    ? '<p style="grid-column:1/-1;text-align:center;color:#94A3B8;padding:40px;font-size:0.9rem;">还没有收藏推文</p>'
    : wishlisted.map(post => `
      <div class="post-card" onclick="openPostDetail(${post.id})">
        <div class="post-card-img">${post.icon}</div>
        <div class="post-card-body">
          <div class="post-card-title">${post.title}</div>
          <div class="post-card-meta"><span>📍 ${post.location.split(' ').pop()}</span></div>
        </div>
      </div>
    `).join('');
}

// -------- 我的推文 --------
function renderMyPosts() {
  const list = document.getElementById('my-posts-list');
  if (!list) return;
  const myPosts = DEMO_POSTS.filter(p => p.author === DEMO_USER.name);
  list.innerHTML = myPosts.length === 0
    ? '<p style="text-align:center;color:#94A3B8;padding:40px;font-size:0.9rem;">还没有发布推文</p>'
    : myPosts.map(post => `
      <div class="my-post-item" onclick="openPostDetail(${post.id})">
        <div class="my-post-title">${post.icon} ${post.title}</div>
        <div class="my-post-meta">
          <span>❤️ ${post.likes}</span>
          <span>👣 ${post.footprints}打卡</span>
          <span>💬 ${post.reviews.length}评价</span>
        </div>
      </div>
    `).join('');
}

// -------- 初始化 --------
document.addEventListener('DOMContentLoaded', function() {
  renderPosts();
  renderMessages();
  renderMe();

  // 延迟初始化地图，等 DOM 渲染完成
  setTimeout(initMainMap, 300);
});