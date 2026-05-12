document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const connectBtn = document.getElementById('connectBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const statusIndicator = connectionStatus.querySelector('.status-indicator');
    const serverItems = document.querySelectorAll('.server-item');
    const mainServer = document.getElementById('mainServer');
    const serverName = mainServer.querySelector('.server-name');
    const serverPing = mainServer.querySelector('.server-ping');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    function initServerSearch() {
        const serverSearchInput = document.createElement('input');
        serverSearchInput.type = 'text';
        serverSearchInput.placeholder = '搜索服务器...';
        serverSearchInput.className = 'server-search';
        const serversSection = document.getElementById('servers');
        const serversGrid = serversSection.querySelector('.servers-grid');
        if (serversGrid) {
            serversSection.insertBefore(serverSearchInput, serversGrid);
        }

        serverSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            serverItems.forEach(function(item) {
                const location = item.dataset.location.toLowerCase();
                if (location.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    function initModalHandlers() {
        loginBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
            setTimeout(function() {
                document.getElementById('loginEmail').focus();
            }, 100);
        });

        signupBtn.addEventListener('click', function() {
            signupModal.classList.add('active');
            setTimeout(function() {
                document.getElementById('signupUsername').focus();
            }, 100);
        });

        closeLoginModal.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });

        closeSignupModal.addEventListener('click', function() {
            signupModal.classList.remove('active');
        });

        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('active');
            setTimeout(function() {
                signupModal.classList.add('active');
                document.getElementById('signupUsername').focus();
            }, 200);
        });

        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.classList.remove('active');
            setTimeout(function() {
                loginModal.classList.add('active');
                document.getElementById('loginEmail').focus();
            }, 200);
        });

        document.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
            if (e.target === signupModal) {
                signupModal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                loginModal.classList.remove('active');
                signupModal.classList.remove('active');
            }
        });
    }

    function initConnectButton() {
        let isConnected = false;
        let connectTimeout = null;

        connectBtn.addEventListener('click', function() {
            if (connectTimeout) return;

            if (!isConnected) {
                connectBtn.disabled = true;
                connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>连接中...</span>';

                connectTimeout = setTimeout(function() {
                    isConnected = true;
                    connectBtn.innerHTML = '<i class="fas fa-power-off"></i><span>断开</span>';
                    connectBtn.classList.add('connected');
                    statusIndicator.classList.add('online');
                    statusIndicator.classList.remove('offline');
                    connectionStatus.querySelector('span').textContent = '已连接 - ' + serverName.textContent;
                    connectBtn.disabled = false;
                    connectTimeout = null;
                }, 2000);
            } else {
                connectBtn.disabled = true;
                connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>断开中...</span>';

                connectTimeout = setTimeout(function() {
                    isConnected = false;
                    connectBtn.innerHTML = '<i class="fas fa-power-off"></i><span>连接</span>';
                    connectBtn.classList.remove('connected');
                    statusIndicator.classList.remove('online');
                    statusIndicator.classList.add('offline');
                    connectionStatus.querySelector('span').textContent = '未连接';
                    connectBtn.disabled = false;
                    connectTimeout = null;
                }, 1000);
            }
        });
    }

    function initServerSelection() {
        serverItems.forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(function() {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);

            item.addEventListener('click', function() {
                const location = item.dataset.location;
                const ping = item.querySelector('.ping').textContent;

                serverName.style.opacity = '0';
                serverPing.style.opacity = '0';

                setTimeout(function() {
                    serverName.textContent = location;
                    serverPing.textContent = ping;
                    serverName.style.opacity = '1';
                    serverPing.style.opacity = '1';
                }, 200);

                serverItems.forEach(function(i) {
                    i.classList.remove('selected');
                });
                item.classList.add('selected');
            });
        });
    }

    function initFormValidation() {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!validateEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('密码至少需要6个字符', 'error');
                return;
            }

            showNotification('登录成功！', 'success');
            loginModal.classList.remove('active');
            document.getElementById('loginForm').reset();
        });

        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            if (username.length < 3) {
                showNotification('用户名至少需要3个字符', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('密码至少需要6个字符', 'error');
                return;
            }
            if (!agreeTerms) {
                showNotification('请同意服务条款和隐私政策', 'error');
                return;
            }

            showNotification('注册成功！欢迎使用SecureVPN', 'success');
            signupModal.classList.remove('active');
            document.getElementById('signupForm').reset();
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.classList.add('show');
        }, 10);

        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function initMobileMenu() {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    function initNavigation() {
        const navLinkItems = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section');

        navLinkItems.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    const section = document.querySelector(href);
                    if (section) {
                        const offsetTop = section.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        window.addEventListener('scroll', function() {
            sections.forEach(function(section) {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const scrollY = window.scrollY;

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    const sectionId = section.getAttribute('id');
                    navLinkItems.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    function initScrollAnimations() {
        const heroStats = document.querySelectorAll('.stat');
        const featureCards = document.querySelectorAll('.feature-card');
        const pricingCards = document.querySelectorAll('.pricing-card');

        heroStats.forEach(function(stat) {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(30px)';
            stat.style.transition = 'all 0.6s ease';
        });

        featureCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });

        pricingCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });

        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.85;
        }

        window.addEventListener('scroll', function() {
            heroStats.forEach(function(stat, index) {
                if (isInViewport(stat)) {
                    setTimeout(function() {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });

            featureCards.forEach(function(card, index) {
                if (isInViewport(card)) {
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });

            pricingCards.forEach(function(card, index) {
                if (isInViewport(card)) {
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        });
    }

    function initPricingButtons() {
        const pricingButtons = document.querySelectorAll('.pricing-card button');
        pricingButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const card = button.parentElement;
                const planName = card.querySelector('h3').textContent;
                showNotification('您选择了' + planName + '，正在跳转到支付页面...', 'success');
            });
        });
    }

    function initFooterLinks() {
        const footerLinks = document.querySelectorAll('footer a');
        footerLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('该功能即将上线', 'info');
            });
        });
    }

    function initHeroButtons() {
        document.getElementById('getStartedBtn').addEventListener('click', function() {
            signupModal.classList.add('active');
            setTimeout(function() {
                document.getElementById('signupUsername').focus();
            }, 100);
        });

        document.getElementById('learnMoreBtn').addEventListener('click', function() {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        });
    }

    function initNavbarScroll() {
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    initServerSearch();
    initModalHandlers();
    initConnectButton();
    initServerSelection();
    initFormValidation();
    initMobileMenu();
    initNavigation();
    initScrollAnimations();
    initPricingButtons();
    initFooterLinks();
    initHeroButtons();
    initNavbarScroll();

    window.dispatchEvent(new Event('scroll'));
});