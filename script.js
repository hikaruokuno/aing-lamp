// ハンバーガーメニューの制御
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.getElementById('header');

// メニューの開閉
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuToggle.querySelector('i');
    
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// メニューリンククリック時の自動閉じ
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// スクロール時のヘッダー背景変更
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// スムーズスクロール（ブラウザのデフォルト動作を使用しているため、追加のJSは不要）

// ページロード時のアニメーション
document.addEventListener('DOMContentLoaded', () => {
    // フェードインアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 監視対象の要素を選択
    const animateElements = document.querySelectorAll('section > div > *');
    animateElements.forEach(element => {
        observer.observe(element);
    });
});

// ギャラリーの簡易ライトボックス機能
const galleryImages = document.querySelectorAll('#gallery .grid > div');

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        // ライトボックスの作成
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        `;
        
        // 画像コンテナ
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            background: white;
            padding: 20px;
            border-radius: 8px;
        `;
        imageContainer.innerHTML = image.innerHTML;
        
        // 閉じるボタン
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        lightbox.appendChild(imageContainer);
        lightbox.appendChild(closeButton);
        document.body.appendChild(lightbox);
        
        // クリックで閉じる
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === closeButton || e.target.parentElement === closeButton) {
                lightbox.remove();
            }
        });
        
        // ESCキーで閉じる
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
});

// お問い合わせフォーム処理
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formMessage = document.getElementById('form-message');
        
        // ここで実際のフォーム送信処理を行う
        // 今回はデモのため、成功メッセージを表示
        formMessage.textContent = 'お問い合わせありがとうございます。内容を確認後、ご連絡させていただきます。';
        formMessage.className = 'mt-4 text-center text-green-600 font-bold';
        formMessage.classList.remove('hidden');
        
        // フォームをリセット
        this.reset();
        
        // メッセージを5秒後に非表示
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    });
}