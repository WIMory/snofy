/* ============================================
   足迹地球 App JavaScript - iOS 风格
   ============================================ */

// -------- 数据 --------
const USER = {
  name: '用户的卢', city: '武汉', level: 2,
  footprints: 27, posts: 8, likes: 156,
  cities: [
    { name: '武汉', progress: 8, total: 10 },
    { name: '洪湖', progress: 2, total: 10 },
    { name: '荆州', progress: 1, total: 10 },
  ]
};

const POSTS = [
  { id:1, title:'汉口老街那家热干面绝了', category:'美食', location:'江汉区 吉庆街', lat:30.572, lng:114.287, body:'开了二十年的老店，辣椒油特别香，芝麻酱正宗，面条筋道。强烈推荐加一份豆皮。', author:'过早猎人', footprints:23, likes:156, timestamp:'2小时前', tags:['过早','老店'], reviews:[{user:'小明',text:'确实好吃，但周末排队要1小时',rating:'good'},{user:'小红',text:'和推文描述基本符合',rating:'good'},{user:'张三',text:'一般般，面有点硬',rating:'bad'}], wishlisted:false, icon:'🍜' },
  { id:2, title:'东湖听涛边看日落绝了', category:'风景', location:'武昌区 东湖路', lat:30.553, lng:114.318, body:'东湖绿道骑行到听涛区，正好赶上日落。湖面波光粼粼，夕阳把水面染成金色，太美了。', author:'风光摄影', footprints:18, likes:89, timestamp:'5小时前', tags:['东湖','日落'], reviews:[{user:'李四',text:'确实很美，周末人多',rating:'good'}], wishlisted:true, icon:'🌅' },
  { id:3, title:'粮道街小众烧烤店', category:'美食', location:'武昌区 粮道街', lat:30.547, lng:114.308, body:'本地人才知道的烧烤店，烤串种类多，羊肉串特别嫩。老板人很热情，价格公道。', author:'宵夜达人', footprints:12, likes:67, timestamp:'1天前', tags:['夜宵','小众'], reviews:[{user:'赵六',text:'烤串确实不错',rating:'good'}], wishlisted:false, icon:'🍖' },
  { id:4, title:'光谷年轻人夜生活', category:'娱乐', location:'洪山区 光谷', lat:30.499, lng:114.415, body:'光谷步行街晚上很热闹，各种小店、酒吧不断。年轻人聚集地，周末尤其热闹。', author:'都市漫游', footprints:31, likes:134, timestamp:'2天前', tags:['娱乐','夜生活'], reviews:[], wishlisted:false, icon:'🎮' },
  { id:5, title:'汉阳归元寺祈福', category:'风景', location:'汉阳区 归元寺路', lat:30.549, lng:114.264, body:'归元寺是武汉最著名的寺庙之一，建筑很有特色，香火旺盛。寺内罗汉堂据说很灵验。', author:'城市探索', footprints:8, likes:45, timestamp:'3天前', tags:['寺庙','文化'], reviews:[{user:'周七',text:'寺庙很安静，适合散心',rating:'good'},{user:'吴八',text:'门票有点贵',rating:'neutral'}], wishlisted:false, icon:'🏛️' },
  { id:6, title:'武汉长江大桥', category:'风景', location:'武昌区 武汉长江大桥', lat:30.543, lng:114.293, body:'武汉标志性建筑，桥上可以看到武汉三镇全景。建议傍晚去，可以同时看到日落和夜景亮灯。', author:'摄影爱好者', footprints:45, likes:203, timestamp:'4天前', tags:['大桥','拍照点'], reviews:[{user:'郑九',text:'拍照效果很震撼',rating:'good'}], wishlisted:false, icon:'🌉' },
];

const MESSAGES = [
  { id:1, type:'review', from:'小明', avatar:'🍜', post:'东湖听涛边', text:'确实很美，但周末人多，建议工作日去', time:'3分钟前', action:'回复' },
  { id:2, type:'like', from:'小红的卢', avatar:'❤️', post:'汉口老街热干面绝了', text:'', time:'10分钟前', action:'' },
  { id:3, type:'follow', from:'用户的卢', avatar:'👤', post:'', text:'关注了你', time:'30分钟前', action:'' },
  { id:4, type:'system', from:'🏙', avatar:'🏙', post:'', text:'城市点亮升级！你在武汉打卡满3次', time:'1小时前', action:'' },
  { id:5, type:'review', from:'李四', avatar:'🌅', post:'东湖日落', text:'确实很美，强烈推荐', time:'2小时前', action:'回复' },
];

let currentPostId = null;
let publishedPhotos = [];
let mainMap = null, cityMap = null;
let mapMode = 'footprint';

// -------- 页面切换 --------
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  if (page === 'footprint') setTimeout(() => mainMap && mainMap.invalidateSize(), 50);
  if (page === 'community') renderPosts();
  if (page === 'messages') renderMessages();
  if (page === 'me') renderMe();
  if (page === 'wishlist') renderWishlist();
  if (page === 'my-posts') renderMyPosts();
  if (page === 'post-detail' && currentPostId) renderPostDetail(currentPostId);
  updateNav(page);
}

function updateNav(page) {
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    const labels = ['足迹','社区',null,'消息','我的'];
    const lbl = item.querySelector('.nav-label')?.textContent;
    item.classList.toggle('active', lbl === labels[i] && page !== 'publish');
  });
}

function switchTab(tab) {
  if (tab === 'publish') showPage('publish');
  else showPage(tab);
}

// -------- 地图初始化 --------
function initMainMap() {
  if (mainMap) { mainMap.remove(); mainMap = null; }

  mainMap = L.map('map', {
    center: [30.52, 114.31], zoom: 11, zoomControl: false,
    attributionControl: true,
  });

  const street = L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', { subdomains:'1234', maxZoom:18 });
  street.addTo(mainMap);
  mainMap.streetLayer = street;

  L.control.zoom({ position: 'topright' }).addTo(mainMap);
  addPostMarkersToMap();

  mainMap.on('dblclick', function(e) {
    showCityMap(e.latlng.lat, e.latlng.lng);
  });
}

function addPostMarkersToMap() {
  if (!mainMap) return;
  mainMap.eachLayer(l => {
    if (l instanceof L.Marker && !(l instanceof L.TileLayer)) mainMap.removeLayer(l);
  });

  POSTS.forEach(post => {
    const colors = { '美食':'#FF3B30', '风景':'#34C759', '娱乐':'#5856D6' };
    const color = colors[post.category];
    const icon = L.divIcon({
      html: `<div class="fp-pin ${post.category==='美食'?'food':post.category==='风景'?'spot':'fun'}" style="position:relative"><span>${post.icon}</span></div>`,
      className: '', iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -40],
    });
    const m = L.marker([post.lat, post.lng], { icon }).addTo(mainMap);
    m.on('click', () => { currentPostId = post.id; showPage('post-detail'); });
  });

  // 足迹点
  const fpColors = ['#CD7F32','#CD7F32','#A8A8A8','#CD7F32','#A8A8A8','#D4A017','#CD7F32','#A8A8A8','#D4A017'];
  const fps = [[30.575,114.289],[30.553,114.318],[30.572,114.287],[30.548,114.307],[30.570,114.290],[30.560,114.305],[30.554,114.312],[30.545,114.295],[30.565,114.320]];
  fps.forEach((p, i) => {
    const fi = L.divIcon({
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${fpColors[i]};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      className:'', iconSize:[12,12], iconAnchor:[6,6],
    });
    L.marker([p[0], p[1]], { icon: fi }).addTo(mainMap);
  });
}

function addHeatMarkersToMap() {
  if (!mainMap) return;
  mainMap.eachLayer(l => { if (l instanceof L.Circle) mainMap.removeLayer(l); });
  [[30.553,114.318,2500,'🔥 东湖热门'],[30.572,114.287,1800,'🍜 吉庆街热门'],[30.547,114.308,1400,'🍖 粮道街']].forEach(h => {
    L.circle([h[0],h[1]], { radius:h[2], color:'#FF9500', fillColor:'#FF9500', fillOpacity:0.12, weight:1.5, dashArray:'6,4', popup: h[3] }).addTo(mainMap);
  });
}

function addZoneMarkersToMap() {
  if (!mainMap) return;
  mainMap.eachLayer(l => {
    if (l instanceof L.Circle || (l._isZone)) mainMap.removeLayer(l);
  });
  POSTS.forEach(post => {
    const icon = L.divIcon({
      html: `<div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);padding:5px 10px;border-radius:10px;font-size:12px;font-weight:600;color:#1E3A5F;box-shadow:0 2px 10px rgba(0,0,0,0.15);white-space:nowrap">📍 ${post.category}</div>`,
      className:'', iconSize:[90,32], iconAnchor:[45,16],
    });
    const m = L.marker([post.lat+0.004, post.lng+0.004], { icon });
    m._isZone = true;
    m.addTo(mainMap);
  });
}

// -------- 地图模式切换 --------
document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    mapMode = this.dataset.mode;
    if (mapMode === 'footprint') addPostMarkersToMap();
    else if (mapMode === 'heat') addHeatMarkersToMap();
    else if (mapMode === 'zone') addZoneMarkersToMap();
  });
});

// -------- 地图样式切换 --------
function switchStreet() {
  document.querySelectorAll('.map-style-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.map-style-btn')[0].classList.add('active');
  if (!mainMap) return;
  if (!mainMap.satelliteLayer) return;
  if (mainMap.hasLayer(mainMap.satelliteLayer)) mainMap.removeLayer(mainMap.satelliteLayer);
  mainMap.streetLayer.addTo(mainMap);
}
function switchSatellite() {
  document.querySelectorAll('.map-style-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.map-style-btn')[1].classList.add('active');
  if (!mainMap || !mainMap.satelliteLayer) return;
  if (mainMap.hasLayer(mainMap.streetLayer)) mainMap.removeLayer(mainMap.streetLayer);
  mainMap.satelliteLayer.addTo(mainMap);
}
function goToMe() {
  if (!mainMap) return;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => mainMap.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1 }),
      () => mainMap.flyTo([30.52, 114.31], 12, { duration: 1 })
    );
  } else {
    mainMap.flyTo([30.52, 114.31], 12, { duration: 1 });
  }
}

// -------- 城市地图 --------
function showCityMap(lat, lng) {
  document.getElementById('map').style.display = 'none';
  const cityView = document.getElementById('city-map-view');
  cityView.style.display = 'flex';
  setTimeout(() => {
    if (cityMap) { cityMap.remove(); cityMap = null; }
    cityMap = L.map('city-map', { center:[lat,lng], zoom:14, zoomControl:true });
    L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', { subdomains:'1234', maxZoom:18 }).addTo(cityMap);
    const colors = { '美食':'#FF3B30', '风景':'#34C759', '娱乐':'#5856D6' };
    POSTS.forEach(post => {
      const icon = L.divIcon({
        html: `<div style="width:34px;height:42px;position:relative"><div style="width:34px;height:34px;border-radius:50%50%50%4px;background:${colors[post.category]};transform:rotate(-45deg);box-shadow:02px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);color:#fff;font-size:14px">${post.icon}</span></div></div>`,
        className:'', iconSize:[34,42], iconAnchor:[17,42], popupAnchor:[0,-42],
      });
      const m = L.marker([post.lat,post.lng],{icon}).addTo(cityMap);
      m.on('click', () => { currentPostId = post.id; showPage('post-detail'); });
    });
    const fpColors = ['#CD7F32','#CD7F32','#A8A8A8','#CD7F32','#A8A8A8','#D4A017'];
    const fps = [[30.575,114.289],[30.553,114.318],[30.572,114.287],[30.548,114.307],[30.570,114.290],[30.560,114.305]];
    fps.forEach((p,i) => {
      const fi = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${fpColors[i]};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        className:'', iconSize:[14,14], iconAnchor:[7,7],
      });
      L.marker([p[0],p[1]],{icon:fi}).addTo(cityMap);
    });
  }, 100);
}

function hideCityMap() {
  if (cityMap) { cityMap.remove(); cityMap = null; }
  document.getElementById('city-map-view').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  setTimeout(() => { if (mainMap) mainMap.invalidateSize(); }, 50);
}

// -------- 社区 --------
function renderPosts(filter) {
  const grid = document.getElementById('post-grid');
  if (!grid) return;
  let data = POSTS;
  if (filter === '我的') data = POSTS.filter(p => p.author === USER.name);
  else if (filter && filter !== '全部') data = POSTS.filter(p => p.category === filter);

  grid.innerHTML = data.length === 0
    ? '<div class="empty-state">还没有推文，去发布第一条吧</div>'
    : data.map(post => `
      <div class="card" onclick="openPostDetail(${post.id})">
        <div class="card-img">${post.icon}</div>
        <div class="card-body">
          <div class="card-title">${post.title}</div>
          <div class="card-meta">
            <span>❤️ ${post.likes}</span>
            <span>👣 ${post.footprints}</span>
            <span>📍 ${post.location.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    `).join('');
}

function openPostDetail(id) { currentPostId = id; showPage('post-detail'); }

function renderPostDetail(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;
  const rIcon = r => r === 'good' ? '👍' : r === 'bad' ? '👎' : '😐';
  const container = document.getElementById('post-detail-content');
  container.innerHTML = `
    <div class="post-detail-img">${post.icon}</div>
    <div class="post-detail-body">
      <div class="post-detail-title">${post.title}</div>
      <div class="post-detail-meta">
        <span class="meta-chip">📍 ${post.location}</span>
        <span class="meta-chip">🏷 ${post.category}</span>
        <span class="meta-chip">👣 ${post.footprints}人打卡</span>
      </div>
      <div class="post-detail-text">${post.body}</div>
      <div class="post-tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
    </div>
    <div class="divider"></div>
    <div class="section-pad">
      <div class="section-title">打卡</div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="checkin-avatars">
          ${Array.from({length: Math.min(post.footprints,6)}, (_,i) => `<div class="checkin-avatar">${['🍜','🌅','🍖','🎮','🏛','🌉'][i]}</div>`).join('')}
        </div>
        ${post.footprints >6 ? `<span class="checkin-count">+${post.footprints-6}人</span>` : ''}
      </div>
    </div>
    <div class="divider"></div>
    <div class="section-pad">
      <div class="section-title">真实评价（${post.reviews.length}条）</div>
      ${post.reviews.length === 0
        ? '<div style="font-size:0.85rem;color:var(--ios-text-tertiary);padding:8px 0">暂无评价，成为第一个打卡者</div>'
        : post.reviews.map(r => `
          <div class="review-item">
            <div class="review-header">
              <div class="review-avatar">${r.user[0]}</div>
              <span class="review-name">${r.user}</span>
              <span style="font-size:0.75rem;color:var(--ios-text-tertiary)">${rIcon(r.rating)}</span>
            </div>
            <div class="review-text">"${r.text}"</div>
          </div>
        `).join('')
      }
    </div>
    <div class="post-action-bar">
      <div class="action-btn" onclick="toggleLike(${post.id},this)">
        <span class="action-icon">❤️</span>
        <span>${post.likes}</span>
      </div>
      <div class="action-btn" onclick="toggleWishlist(${post.id},this)">
        <span class="action-icon">${post.wishlisted ? '🔖' : '📑'}</span>
        <span>${post.wishlisted ? '想去' : '想去'}</span>
      </div>
      <div class="action-btn" onclick="showPage('publish')">
        <span class="action-icon">📍</span>
        <span>打卡</span>
      </div>
      <div class="action-btn" onclick="sharePost()">
        <span class="action-icon">↗️</span>
        <span>分享</span>
      </div>
    </div>
  `;
}

function toggleLike(id, el) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  el.classList.toggle('liked', post.liked);
  el.querySelector('span:last-child').textContent = post.likes;
}

function toggleWishlist(id, el) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;
  post.wishlisted = !post.wishlisted;
  el.querySelector('.action-icon').textContent = post.wishlisted ? '🔖' : '📑';
  el.querySelector('span:last-child').textContent = post.wishlisted ? '已收藏' : '想去';
  if (post.wishlisted) showToast('已添加到想去清单');
}

function sharePost() { showToast('分享链接已复制'); }

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#fff;padding:10px 20px;border-radius:20px;font-size:0.85rem;z-index:9999;white-space:nowrap';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// 社区分类
document.querySelectorAll('.community-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.community-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderPosts(this.dataset.cat);
  });
});

// -------- 发布 --------
function addPhoto() {
  if (publishedPhotos.length >= 9) { showToast('最多9张图片'); return; }
  publishedPhotos.push('📷');
  const c = document.getElementById('photo-upload');
  c.innerHTML = `<span>✅ 已添加 ${publishedPhotos.length} 张（继续点击添加）</span><small>最多9张</small>`;
}

function publishPost() {
  const title = document.getElementById('input-title').value.trim();
  const body = document.getElementById('input-body').value.trim();
  const location = document.getElementById('input-location').value.trim();
  const category = document.getElementById('input-category').value;
  if (!title) { showToast('请输入标题'); return; }
  if (!body) { showToast('请输入正文'); return; }
  const icons = {'美食':'🍜', '风景':'🏞','娱乐':'🎮' };
  const newPost = {
    id: Date.now(), title, category, location: location || '武汉市',
    lat: 30.52 + (Math.random()-0.5)*0.06, lng: 114.31 + (Math.random()-0.5)*0.06,
    body, author: USER.name, footprints: 0, likes: 0, timestamp: '刚刚',
    tags: [category], reviews: [], wishlisted: false, icon: icons[category],
  };
  POSTS.unshift(newPost);
  showToast('发布成功！推文已出现在地图上');
  ['input-title','input-body','input-location'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('input-category').value = '美食';
  publishedPhotos = [];
  document.getElementById('photo-upload').innerHTML = '<span>📷 点击添加图片</span><small>最多9张</small>';
  showPage('community');
  if (mainMap) addPostMarkersToMap();
}

// -------- 消息 --------
function renderMessages() {
  const list = document.getElementById('message-list');
  if (!list) return;
  list.innerHTML = MESSAGES.map(msg => `
    <div class="message-item">
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="msg-title">${msg.from} <span class="msg-sub">${
            msg.type==='review'?'评价了你的打卡':msg.type==='like'?'点赞了你的推文':msg.type==='follow'?'关注了你':'系统通知'
          }</span></span>
          <span class="msg-time">${msg.time}</span>
        </div>
        ${msg.post || msg.text ? `<div class="msg-preview">${msg.post?'"'+msg.post+'" ':''}${msg.text}</div>` : ''}
      </div>
      ${msg.action ? `<span class="msg-action-btn">${msg.action}</span>` : ''}
    </div>
  `).join('');
}

document.querySelectorAll('.message-tabs .tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.message-tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// -------- 我的 --------
function renderMe() {
  document.querySelector('.profile-name').textContent = USER.name;
  document.querySelector('.profile-subtitle').textContent = '📍 ' + USER.city + ' · 点亮阶段' + USER.level;
  document.getElementById('stat-cities').textContent = USER.cities.length;
  document.getElementById('stat-footprints').textContent = USER.footprints;
  document.getElementById('stat-posts').textContent = USER.posts;
  document.getElementById('stat-likes').textContent = USER.likes;
  const progMap = { '武汉':'prog-wuhan','洪湖':'prog-honghu','荆州':'prog-jingzhou' };
  USER.cities.forEach(c => {
    const el = document.getElementById(progMap[c.name]);
    if (el) el.style.width = (c.progress/c.total*100)+'%';
  });
}

// -------- 想去清单 --------
function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;
  const wishlisted = POSTS.filter(p => p.wishlisted);
  grid.innerHTML = wishlisted.length === 0
    ? '<div class="empty-state" style="grid-column:1/-1">还没有收藏推文</div>'
    : wishlisted.map(post => `
      <div class="card" onclick="openPostDetail(${post.id})">
        <div class="card-img">${post.icon}</div>
        <div class="card-body">
          <div class="card-title">${post.title}</div>
          <div class="card-meta"><span>📍 ${post.location.split(' ')[0]}</span></div>
        </div>
      </div>
    `).join('');
}

// -------- 我的推文 --------
function renderMyPosts() {
  const list = document.getElementById('my-posts-list');
  if (!list) return;
  const mine = POSTS.filter(p => p.author === USER.name);
  list.innerHTML = mine.length === 0
    ? '<div class="empty-state">还没有发布推文</div>'
    : mine.map(post => `
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
  setTimeout(initMainMap, 300);
});