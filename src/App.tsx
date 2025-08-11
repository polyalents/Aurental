import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

interface Card {
  id: number;
  name: string;
  desc: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chaosZoneRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  
  const [cards, setCards] = useState<Card[]>([
    { 
      id: 1, 
      name: 'Паулин Ленц (Паурель)', 
      desc: 'Жрица без имени. Короткая, хрупкая, с глазами-хамелеонами. Носительница древней силы.', 
      x: 20, 
      y: 20, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 2, 
      name: 'Лирхт Альвескард', 
      desc: 'Командир, тьма в человеческом облике. Высокий, чёрноволосый, беспощадный в бою.', 
      x: 180, 
      y: 50, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 3, 
      name: 'Готье Альвескард', 
      desc: 'Алхимик и манипулятор. Француз с опасной утончённостью. Лечит, отравляя.', 
      x: 340, 
      y: 30, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 4, 
      name: 'Мордрагон Альвескард', 
      desc: 'Отец, древний властитель. Олицетворение силы, старше империй и королевств.', 
      x: 500, 
      y: 60, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 5, 
      name: 'Ноктамерон Альвескард', 
      desc: 'Пробудившийся. Молчащий и пугающий, возвращённый из небытия.', 
      x: 660, 
      y: 40, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 6, 
      name: 'Безымянная', 
      desc: 'Аватар Паулин. Олицетворение воли и боли, неразрывно связанное с хозяйкой.', 
      x: 820, 
      y: 20, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 7, 
      name: 'Sorakel', 
      desc: 'Аватар Лирхта. Демоническая, холодная сущность, отражающая черты хозяина.', 
      x: 30, 
      y: 180, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 8, 
      name: 'Симба (Ноксилла)', 
      desc: 'Общий аватар Паулин и Лирхта. Хаотичное дитя двух противоположных сил.', 
      x: 190, 
      y: 210, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 9, 
      name: 'Вириэль', 
      desc: 'Предводительница Царства Глубин. Павшая правительница древнего подводного государства.', 
      x: 350, 
      y: 190, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 10, 
      name: 'Максвелл Арденс', 
      desc: 'Младший представитель дома Арденс. Добродушный и слегка наивный молодой человек.', 
      x: 510, 
      y: 220, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 11, 
      name: 'Шион', 
      desc: 'Опекун и стратег. Хладнокровная и дальновидная. Привыкла выживать политикой.', 
      x: 670, 
      y: 200, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 12, 
      name: 'Люси', 
      desc: 'Наследница и пешка в чужой игре. Молодая, внезапно оказавшаяся в сетях власти.', 
      x: 830, 
      y: 180, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 13, 
      name: 'Praevidus', 
      desc: 'Вечный наблюдатель. Тот, кто видит дальше всех, но вмешивается редко.', 
      x: 100, 
      y: 350, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 14, 
      name: 'Элара', 
      desc: 'Бывшая жрица света, мать Лирхта и Готье. Женщина, чьи решения изменили судьбы многих.', 
      x: 260, 
      y: 370, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    }
  ]);

  // Функция для добавления ref к секциям
  const addToRefs = useCallback((el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  }, []);

  // Intersection Observer для анимаций при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionsRef.current.indexOf(entry.target as HTMLElement);
            // Чередуем анимации: четные индексы слева, нечетные справа
            const animationClass = sectionIndex % 2 === 0 ? 'animate-from-left' : 'animate-from-right';
            entry.target.classList.add('visible', animationClass);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentSections = sectionsRef.current;
    currentSections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    
    // Загрузка анимация
    setTimeout(() => setIsLoaded(true), 100);
    
    // Таймер до 1 сентября 2025
    const targetDate = new Date('2025-09-01T00:00:00').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Исправляем проблему с прокруткой к hero секции при загрузке
    window.scrollTo(0, 0);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timerInterval);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    e.dataTransfer.setData('text/plain', cardId.toString());
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isDragging: true } : card
    ));
  };

  const handleDragEnd = (cardId: number) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isDragging: false } : card
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (!chaosZoneRef.current) return;
    
    const rect = chaosZoneRef.current.getBoundingClientRect();
    
    // Адаптивные размеры карточки в зависимости от размера экрана
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? 160 : 220;
    const cardHeight = isMobile ? 120 : 160;
    
    // Вычисляем позицию с учетом ограничений
    let x = e.clientX - rect.left - cardWidth / 2;
    let y = e.clientY - rect.top - cardHeight / 2;
    
    // Ограничиваем позицию границами контейнера
    const maxX = rect.width - cardWidth;
    const maxY = rect.height - cardHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { 
            ...card, 
            x, 
            y, 
            rotation: Math.random() * 20 - 10,
            isDragging: false
          }
        : card
    ));
  };

  const resetCards = () => {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    let positions: Array<{ x: number; y: number }>;
    
    if (isSmallMobile) {
      // Позиции для очень маленьких экранов (больше вертикального пространства)
      positions = [
        { x: 10, y: 10 }, { x: 150, y: 10 }, { x: 10, y: 120 }, { x: 150, y: 120 },
        { x: 10, y: 230 }, { x: 150, y: 230 }, { x: 10, y: 340 }, { x: 150, y: 340 },
        { x: 10, y: 450 }, { x: 150, y: 450 }, { x: 10, y: 560 }, { x: 150, y: 560 },
        { x: 10, y: 670 }, { x: 150, y: 670 }
      ];
    } else if (isMobile) {
      // Позиции для мобильных устройств
      positions = [
        { x: 20, y: 20 }, { x: 180, y: 20 }, { x: 20, y: 140 }, { x: 180, y: 140 },
        { x: 20, y: 260 }, { x: 180, y: 260 }, { x: 20, y: 380 }, { x: 180, y: 380 },
        { x: 20, y: 500 }, { x: 180, y: 500 }, { x: 20, y: 620 }, { x: 180, y: 620 },
        { x: 20, y: 740 }, { x: 180, y: 740 }
      ];
    } else {
      // Позиции для десктопа
      positions = [
        { x: 20, y: 20 }, { x: 180, y: 50 }, { x: 340, y: 30 }, { x: 500, y: 60 },
        { x: 660, y: 40 }, { x: 820, y: 20 }, { x: 30, y: 180 }, { x: 190, y: 210 },
        { x: 350, y: 190 }, { x: 510, y: 220 }, { x: 670, y: 200 }, { x: 830, y: 180 },
        { x: 100, y: 350 }, { x: 260, y: 370 }
      ];
    }
    
    setCards(prev => prev.map((card, index) => ({
      ...card,
      x: positions[index]?.x || 50,
      y: positions[index]?.y || 50,
      rotation: Math.random() * 20 - 10
    })));
  };

  // Touch события для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent, cardId: number) => {
    const touch = e.touches[0];
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const startX = touch.clientX - card.x;
    const startY = touch.clientY - card.y;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const moveTouch = moveEvent.touches[0];
      
      if (!chaosZoneRef.current) return;
      
      const rect = chaosZoneRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 160 : 220;
      const cardHeight = isMobile ? 120 : 160;
      
      let x = moveTouch.clientX - rect.left - startX;
      let y = moveTouch.clientY - rect.top - startY;
      
      const maxX = rect.width - cardWidth;
      const maxY = rect.height - cardHeight;
      
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
      
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, x, y, isDragging: true } : c
      ));
    };

    const handleTouchEnd = () => {
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isDragging: false, rotation: Math.random() * 20 - 10 } : c
      ));
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">AURÉNTAL</div>
          <nav className="nav">
            <a href="#about" className="nav-link">О книге</a>
            <a href="#chapters" className="nav-link">Главы</a>
            <a href="#author" className="nav-link">Автор</a>
            <a href="#contact" className="nav-link">Контакты</a>
          </nav>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>О книге</a>
          <a href="#chapters" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Главы</a>
          <a href="#author" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Автор</a>
          <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-animated"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animation = 'none';
                e.currentTarget.style.transform = 'scale(3)';
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.boxShadow = '0 0 20px #dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animation = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.background = '';
                e.currentTarget.style.boxShadow = '';
              }}
            />
          ))}
        </div>
        
        <div className="container">
          <div 
            className="hero-content" 
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <h1 className="hero-title">
              <span className="title-main glitch" data-text="AURÉNTAL">AURÉNTAL</span>
              <span className="title-sub">SAECULUM DOLORE</span>
            </h1>
            <p className="hero-description">
              Трилогия тёмного фэнтези о власти, предательстве и цене магии.<br/>
              Погрузитесь в мир, где каждое решение имеет последствия.
            </p>
            <div className="hero-buttons">
              <a 
                href="https://www.litres.ru/book/pauline-lents/aurental-volumen-i-saeculum-dolore-saeculum-natum-72175981/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary pulse-on-hover"
              >
                Начать чтение
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about section-animate" ref={addToRefs}>
        <div className="container">
          <h2 className="section-title">О вселенной</h2>
          <div className="about-grid">
            <div className="about-card" data-aos="fade-up" data-aos-delay="100">
              <div className="card-icon">I</div>
              <h3>Том I</h3>
              <p>Семейная сага, война и материнство в хаосе. Паулин проходит путь от жрицы-матери до сломленной женщины.</p>
              <a 
                href="https://www.litres.ru/book/pauline-lents/aurental-volumen-i-saeculum-dolore-saeculum-natum-72175981/"
                target="_blank"
                rel="noopener noreferrer"
                className="book-status available btn-link"
              >
                Доступен на ЛитРес
              </a>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-delay="200">
              <div className="card-icon">II</div>
              <h3>Том II</h3>
              <p>2024 год, Берлин. Современный психологический триллер в стенах Академии Асквевальд.</p>
              <div className="countdown-timer">
                <div className="timer-label">Выход через:</div>
                <div className="timer-display">
                  <div className="timer-unit">
                    <span className="timer-number">{timeLeft.days}</span>
                    <span className="timer-text">дней</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-number">{timeLeft.hours}</span>
                    <span className="timer-text">часов</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-number">{timeLeft.minutes}</span>
                    <span className="timer-text">минут</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-number">{timeLeft.seconds}</span>
                    <span className="timer-text">секунд</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-delay="300">
              <div className="card-icon">III</div>
              <h3>Том III</h3>
              <p>Циклы перерождений через века. Готье и Паулин встречаются в разных ролях и эпохах.</p>
              <div className="book-status in-progress">В работе</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section section-animate" ref={addToRefs}>
        <div className="container">
          <blockquote className="quote">
            <div className="quote-marks">"</div>
            <p>Пусть истина разожжёт в тебе огонь, но не говори — потому что мир ещё спит, и не готов услышать.</p>
            <cite>— Из первого тома AURÉNTAL</cite>
          </blockquote>
        </div>
      </section>

      {/* Characters Section */}
      <section id="chapters" className="section characters section-animate" ref={addToRefs}>
        <div className="container">
          <h2 className="section-title animated-title">Персонажи</h2>
          <p className="section-subtitle">Перетащите карточки, чтобы изменить их расположение</p>
          
          <div className="chaos-zone-controls">
            <button 
              className="btn btn-secondary reset-btn"
              onClick={resetCards}
            >
              🔄 Сбросить позиции
            </button>
          </div>
          
          <div 
            ref={chaosZoneRef}
            className="characters-chaos-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="chaos-zone-hint">
              <span>Зона хаоса</span>
              <p>Перетащите карточки персонажей сюда</p>
            </div>
            
            {cards.map((card) => (
              <div
                key={card.id}
                className={`character-card chaotic-card ${card.isDragging ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                onDragEnd={() => handleDragEnd(card.id)}
                onTouchStart={(e) => handleTouchStart(e, card.id)}
                style={{
                  transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`,
                  zIndex: card.isDragging ? 1000 : (card.x !== 0 || card.y !== 0 ? 10 : 1),
                }}
              >
                <div className="character-avatar floating">
                  <div className="avatar-glow"></div>
                </div>
                <h3>{card.name}</h3>
                <p>{card.desc}</p>
                <div className="drag-hint">📱 Перетащи меня</div>
                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" className="section author section-animate" ref={addToRefs}>
        <div className="container">
          <h2 className="section-title">Об авторе</h2>
          <div className="author-content">
            <div className="author-avatar">
              <div className="avatar-placeholder">
                <span>✍️</span>
              </div>
            </div>
            <div className="author-text">
              <p>
                AURÉNTAL создаётся как автобиографическое произведение, где каждый персонаж 
                представляет различные аспекты внутреннего мира автора. Магия в произведении 
                служит метафорой для внутренних психологических процессов и травм.
              </p>
              <p>
                Первый том уже доступен на ЛитРес, второй том запланирован к выходу 1 сентября 2024 года.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section-animate" ref={addToRefs}>
        <div className="container">
          <div className="cta-content">
            <h2>Не пропустите продолжение</h2>
            <p>Подписывайтесь на уведомления о выходе новых томов</p>
            <div className="newsletter">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="email-input"
                id="newsletter-email"
              />
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const email = (document.getElementById('newsletter-email') as HTMLInputElement)?.value;
                  if (email && email.includes('@')) {
                    alert(`Спасибо за подписку! Мы отправим уведомления на ${email}`);
                    // Перезагрузка страницы
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  } else {
                    alert('Пожалуйста, введите корректный email адрес');
                  }
                }}
              >
                Подписаться
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>AURÉNTAL</h3>
              <p>Вселенная тёмного фэнтези</p>
            </div>
            <div className="footer-section">
              <h4>Ссылки</h4>
              <a 
                href="https://www.litres.ru/book/pauline-lents/aurental-volumen-i-saeculum-dolore-saeculum-natum-72175981/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                ЛитРес
              </a>
              <a 
                href="https://vk.com/aurental"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                ВКонтакте
              </a>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <p>© 2024 AURÉNTAL</p>
              <p>Все права защищены</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button 
        className={`scroll-to-top ${scrollY > 500 ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}

export default App;