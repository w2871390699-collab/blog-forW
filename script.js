/* ============================================================
   网站主脚本
   等待 DOM 完全加载后执行所有初始化逻辑
   包含：导航栏、滚动动画、音乐播放器、留言功能等
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  // =============================================
  // 【导航栏滚动效果】
  // 监听页面滚动，当滚动超过 50px 时给导航栏添加 .scrolled 类
  // .scrolled 类在 CSS 中定义了毛玻璃背景和阴影效果
  // =============================================
  var navbar = document.getElementById("navbar");

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");     // 滚动超过 50px：显示毛玻璃背景
    } else {
      navbar.classList.remove("scrolled");  // 回到顶部：恢复透明背景
    }
  }

  // 绑定滚动事件 + 页面加载时立即检查一次
  window.addEventListener("scroll", updateNavbar);
  updateNavbar();

  // =============================================
  // 【导航高亮跟踪】
  // 根据当前滚动位置，自动高亮导航栏中对应的链接
  // 原理：检测当前视口内是哪个 section，给对应导航链接加 .active
  // =============================================
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;  // 偏移 120px（导航栏高度 + 缓冲）

    // 遍历所有 section，判断哪个在视口内
    sections.forEach(function (section) {
      var top = section.offsetTop;         // section 距页面顶部的距离
      var height = section.offsetHeight;   // section 的高度
      var id = section.getAttribute("id");

      // 如果当前滚动位置在该 section 范围内
      if (scrollPos >= top && scrollPos < top + height) {
        // 移除所有链接的 active，给匹配的链接添加 active
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // =============================================
  // 【移动端汉堡菜单】
  // 点击汉堡按钮 → 切换全屏菜单的显示/隐藏
  // 同时切换汉堡按钮的 X 形动画
  // =============================================
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  navToggle.addEventListener("click", function () {
    navToggle.classList.toggle("open");      // 汉堡按钮 → X 形
    mobileMenu.classList.toggle("open");     // 全屏菜单 → 显示/隐藏
    // 菜单打开时禁止页面滚动，关闭时恢复
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
  });

  // 点击移动端菜单中的链接后自动关闭菜单
  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // =============================================
  // 【平滑滚动】
  // 给所有 # 开头的锚点链接绑定平滑滚动
  // 点击导航链接时，页面会平滑过渡到目标 section
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();   // 阻止默认跳转（瞬间跳到目标位置）
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });  // 平滑滚动
      }
    });
  });

  // =============================================
  // 【滚动进入动画】
  // 使用 IntersectionObserver API 检测元素是否进入视口
  // 进入时添加 .visible 类，触发 CSS 中的淡入 + 上移动画
  // =============================================

  // 给需要动画的元素添加 .reveal 类（初始状态：透明 + 下移 30px）
  var revealElements = document.querySelectorAll(
    ".about-grid, .skills-section, .project-card, .award-item, .contact-card, .message-form, .section-header"
  );

  revealElements.forEach(function (el) {
    el.classList.add("reveal");
  });

  // 创建观察器：当元素进入视口 10% 时触发回调
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");  // 进入视口：显示动画
        }
      });
    },
    {
      threshold: 0.1,                    // 元素 10% 可见时触发
      rootMargin: "0px 0px -40px 0px"    // 底部提前 40px 触发（提前出现更自然）
    }
  );

  // 开始观察所有 .reveal 元素
  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  // =============================================
  // 【留言功能】
  // 点击发送按钮 → 将留言保存到 localStorage 并显示成功反馈
  // 使用 localStorage 实现持久化，刷新页面后留言仍然保留
  // =============================================
  var msgSubmit = document.getElementById("msgSubmit");
  var msgContent = document.getElementById("msgContent");
  var msgName = document.getElementById("msgName");

  if (msgSubmit) {
    msgSubmit.addEventListener("click", function () {
      var name = msgName.value.trim();       // 获取名字（可选）
      var content = msgContent.value.trim(); // 获取留言内容

      // 内容为空时不提交
      if (!content) return;

      // 从 localStorage 读取已有留言，不存在则返回空数组
      var comments = JSON.parse(localStorage.getItem("portfolioComments") || "[]");

      // 格式化当前时间为 "YYYY-MM-DD HH:MM"
      var now = new Date();
      var timeStr =
        now.getFullYear() +
        "-" +
        ("0" + (now.getMonth() + 1)).slice(-2) +   // 月份补零
        "-" +
        ("0" + now.getDate()).slice(-2) +            // 日期补零
        " " +
        ("0" + now.getHours()).slice(-2) +            // 小时补零
        ":" +
        ("0" + now.getMinutes()).slice(-2);           // 分钟补零

      // 追加新留言到数组
      comments.push({
        name: name || "匿名访客",   // 未填名字则显示"匿名访客"
        text: content,
        time: timeStr,
      });

      // 保存回 localStorage
      localStorage.setItem("portfolioComments", JSON.stringify(comments));

      // 清空输入框
      msgName.value = "";
      msgContent.value = "";

      // 显示成功反馈：按钮文字变"已发送!" + 背景变绿
      msgSubmit.textContent = "已发送!";
      msgSubmit.style.background = "linear-gradient(135deg, #10b981, #06b6d4)";
      // 2 秒后恢复原状
      setTimeout(function () {
        msgSubmit.textContent = "发送留言";
        msgSubmit.style.background = "";
      }, 2000);
    });
  }

  // =============================================
  // 【查看更多按钮】
  // 点击后显示"更多项目即将上线..."提示，2 秒后恢复
  // =============================================
  var viewMoreBtn = document.getElementById("viewMoreBtn");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function () {
      viewMoreBtn.textContent = "更多项目即将上线...";
      viewMoreBtn.disabled = true;
      viewMoreBtn.style.opacity = "0.5";
      setTimeout(function () {
        viewMoreBtn.textContent = "查看更多项目";
        viewMoreBtn.disabled = false;
        viewMoreBtn.style.opacity = "";
      }, 2000);
    });
  }

  // =============================================
  // 【音乐播放器】
  // 功能：自动播放、上/下一首、播放/暂停、进度条、音量控制、静音
  // 【放音乐】把 .mp3 文件放到 music/ 文件夹，修改下方 playlist 数组
  // 每次打开网页都会自动播放，不记住暂停状态
  // =============================================

  // ----- 播放列表配置 -----
  // 【改音乐】只改 src：把你的 .mp3 文件放到 music/ 文件夹，填写路径即可
  // 曲目名称自动从文件名提取（去掉路径和 .mp3 后缀）
  // 例如：src: "music/有幸遇见你.mp3" → 自动显示"有幸遇见你"
  var playlist = [
    { src: "music/有幸遇见你.mp3" },
    { src: "music/幸福.mp3" },
    { src: "music/bgm3.mp3" },
  ];

  // 从文件路径中提取歌名：
  // "music/bgm1有幸遇见你.mp3" → 取最后的文件名 → 去掉 .mp3 → "bgm1有幸遇见你"
  playlist.forEach(function (track) {
    var filename = track.src.split("/").pop();       // 取最后一个 / 后面的内容
    track.title = filename.replace(/\.mp3$/i, "");   // 去掉 .mp3 后缀
  });

  // ----- 获取 DOM 元素 -----
  var bgAudio = document.getElementById("bgAudio");               // 隐藏的 <audio> 元素
  var player = document.getElementById("player");                 // 播放器容器
  var playerToggle = document.getElementById("playerToggle");     // 播放/暂停按钮
  var playerPrev = document.getElementById("playerPrev");         // 上一首按钮
  var playerNext = document.getElementById("playerNext");         // 下一首按钮
  var playerTitle = document.getElementById("playerTitle");       // 曲目名称文字
  var playerArtist = document.getElementById("playerArtist");     // 副标题文字
  var playerProgress = document.getElementById("playerProgress"); // 进度条容器
  var playerProgressBar = document.getElementById("playerProgressBar"); // 已播放进度条
  var playerCurrentTime = document.getElementById("playerCurrentTime"); // 当前时间
  var playerDurationEl = document.getElementById("playerDuration");     // 总时长
  var playerVolume = document.getElementById("playerVolume");     // 音量滑块
  var playerMute = document.getElementById("playerMute");         // 静音按钮
  var playerCover = document.querySelector(".player-cover");      // 封面容器

  // 播放/暂停图标
  var iconPlay = playerToggle.querySelector(".icon-play");
  var iconPause = playerToggle.querySelector(".icon-pause");
  // 音量/静音图标
  var iconVol = playerMute.querySelector(".icon-vol");
  var iconMute = playerMute.querySelector(".icon-mute");

  // 播放器状态
  var currentTrack = 0;   // 当前曲目索引（从第 0 首开始）
  var isPlaying = false;   // 是否正在播放

  // ----- 辅助函数：秒数转 "分:秒" 格式 -----
  // 例如：125 秒 → "2:05"
  function formatTime(s) {
    if (isNaN(s)) return "0:00";
    var m = Math.floor(s / 60);           // 分钟
    var sec = Math.floor(s % 60);         // 秒
    return m + ":" + (sec < 10 ? "0" : "") + sec;  // 秒数补零
  }

  // ----- 加载指定索引的曲目 -----
  // 使用模运算实现循环：超出列表范围时自动回到首尾
  function loadTrack(index) {
    currentTrack = ((index % playlist.length) + playlist.length) % playlist.length;
    bgAudio.src = playlist[currentTrack].src;          // 设置音频源
    playerTitle.textContent = playlist[currentTrack].title;  // 更新曲目名称
    playerArtist.textContent = "王友的播放列表";             // 更新副标题
  }

  // ----- UI 状态切换：显示播放中 -----
  function showPlayingUI() {
    iconPlay.style.display = "none";         // 隐藏播放图标
    iconPause.style.display = "block";       // 显示暂停图标
    playerCover.classList.add("playing");    // 封面开始旋转
    isPlaying = true;
  }

  // ----- UI 状态切换：显示已暂停 -----
  function showPausedUI() {
    iconPlay.style.display = "block";        // 显示播放图标
    iconPause.style.display = "none";        // 隐藏暂停图标
    playerCover.classList.remove("playing"); // 封面停止旋转
    isPlaying = false;
  }

  // ----- 尝试自动播放 -----
  // 浏览器策略：大多数浏览器禁止音频自动播放（需要用户交互）
  // 如果被拦截 → 等待用户首次点击/按键后自动恢复播放
  function tryPlay() {
    // 先显示播放器（从底部滑入）
    player.classList.add("show");

    // 尝试播放，play() 返回 Promise
    var playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          // 播放成功
          showPlayingUI();
        })
        .catch(function () {
          // 自动播放被浏览器拦截（Chrome/Safari 等需要用户交互）
          showPausedUI();

          // 监听用户首次交互，一旦交互就恢复播放
          var resumeOnInteraction = function () {
            bgAudio.play().then(function () {
              showPlayingUI();
            });
            // 播放后移除监听器（只响应一次）
            document.removeEventListener("click", resumeOnInteraction);
            document.removeEventListener("keydown", resumeOnInteraction);
            document.removeEventListener("touchstart", resumeOnInteraction);
          };

          // 监听三种用户交互：点击、按键、触摸
          document.addEventListener("click", resumeOnInteraction);
          document.addEventListener("keydown", resumeOnInteraction);
          document.addEventListener("touchstart", resumeOnInteraction);
        });
    }
  }

  // ----- 初始化：加载第一首并尝试自动播放 -----
  loadTrack(0);
  tryPlay();

  // ----- 播放/暂停按钮点击事件 -----
  playerToggle.addEventListener("click", function () {
    if (isPlaying) {
      bgAudio.pause();       // 正在播放 → 暂停
      showPausedUI();
    } else {
      bgAudio.play().then(function () {
        showPlayingUI();     // 已暂停 → 播放
      });
    }
  });

  // ----- 上一首按钮点击事件 -----
  playerPrev.addEventListener("click", function () {
    loadTrack(currentTrack - 1);
    bgAudio.play().then(function () {
      showPlayingUI();
    });
  });

  // ----- 下一首按钮点击事件 -----
  playerNext.addEventListener("click", function () {
    loadTrack(currentTrack + 1);
    bgAudio.play().then(function () {
      showPlayingUI();
    });
  });

  // ----- 播放结束自动切下一首 -----
  // 音频播放完毕时触发 ended 事件，自动加载并播放下一首
  bgAudio.addEventListener("ended", function () {
    loadTrack(currentTrack + 1);
    bgAudio.play().then(function () {
      showPlayingUI();
    });
  });

  // ----- 音频加载失败 → 跳到下一首 -----
  // 如果某个音乐文件不存在或损坏，自动跳到下一首
  bgAudio.addEventListener("error", function () {
    if (playlist.length > 1) {
      loadTrack(currentTrack + 1);
      bgAudio.play().catch(function () {});
    }
  });

  // ----- 进度条更新 -----
  // 每次播放位置更新时触发（约每秒 4 次），更新进度条和时间显示
  bgAudio.addEventListener("timeupdate", function () {
    if (bgAudio.duration) {
      // 计算已播放百分比
      var pct = (bgAudio.currentTime / bgAudio.duration) * 100;
      playerProgressBar.style.width = pct + "%";              // 更新进度条宽度
      playerCurrentTime.textContent = formatTime(bgAudio.currentTime);  // 更新当前时间
    }
  });

  // ----- 音频元数据加载完成 → 显示总时长 -----
  bgAudio.addEventListener("loadedmetadata", function () {
    playerDurationEl.textContent = formatTime(bgAudio.duration);
  });

  // ----- 点击进度条跳转播放位置 -----
  playerProgress.addEventListener("click", function (e) {
    var rect = playerProgress.getBoundingClientRect();  // 获取进度条的位置和宽度
    var pct = (e.clientX - rect.left) / rect.width;    // 计算点击位置的百分比
    if (bgAudio.duration) {
      bgAudio.currentTime = pct * bgAudio.duration;     // 跳转到对应时间
    }
  });

  // ----- 音量滑块控制 -----
  // 拖动滑块时实时调整音量
  playerVolume.addEventListener("input", function () {
    bgAudio.volume = playerVolume.value;  // 滑块值 0~1 直接赋给音频音量
    // 根据音量值切换图标
    if (bgAudio.volume === 0) {
      iconVol.style.display = "none";
      iconMute.style.display = "block";
    } else {
      iconVol.style.display = "block";
      iconMute.style.display = "none";
    }
  });

  // ----- 静音按钮切换 -----
  // 点击静音：保存当前音量 → 设为 0
  // 再次点击：恢复之前保存的音量
  var prevVolume = 0.7;  // 默认音量（与 HTML 中滑块的 value 一致）

  playerMute.addEventListener("click", function () {
    if (bgAudio.volume > 0) {
      // 有音量 → 静音
      prevVolume = bgAudio.volume;     // 保存当前音量
      bgAudio.volume = 0;              // 设为静音
      playerVolume.value = 0;          // 滑块归零
      iconVol.style.display = "none";
      iconMute.style.display = "block";
    } else {
      // 静音中 → 恢复音量
      bgAudio.volume = prevVolume;     // 恢复之前保存的音量
      playerVolume.value = prevVolume;
      iconVol.style.display = "block";
      iconMute.style.display = "none";
    }
  });

  // =============================================
  // 【项目照片加载检测】
  // 用 JS 预加载每张项目照片，加载失败时显示占位图标
  // 原理：创建临时 Image 对象尝试加载 url，失败则给 placeholder 加 .show
  // =============================================
  document.querySelectorAll(".project-image").forEach(function (el) {
    // 从 inline style 中提取 background-image 的 url
    var bg = el.style.backgroundImage;
    var match = bg.match(/url\(['"]?(.*?)['"]?\)/);  // 正则提取 url 路径
    if (match && match[1]) {
      var img = new Image();               // 创建临时图片对象
      var placeholder = el.querySelector(".project-placeholder");
      img.onerror = function () {
        // 图片加载失败 → 显示占位图标
        if (placeholder) placeholder.classList.add("show");
      };
      img.src = match[1];                  // 开始加载，成功则什么都不做
    } else {
      // 没有设置 url → 直接显示占位图标
      var placeholder = el.querySelector(".project-placeholder");
      if (placeholder) placeholder.classList.add("show");
    }
  });

  // =============================================
  // 【所有功能初始化完毕】
  // =============================================
});
