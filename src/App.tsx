import React, { useEffect, useState, useRef } from 'react';
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

interface MousePosition {
  x: number;
  y: number;
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [mouseInWindow, setMouseInWindow] = useState(true);
  const [debugInfo, setDebugInfo] = useState({ 
    x: 0, 
    y: 0, 
    visible: true, 
    inWindow: true, 
    elementUnder: '' 
  });
  const chaosZoneRef = useRef<HTMLDivElement>(null);
  
  const [cards, setCards] = useState<Card[]>([
    { 
      id: 1, 
      name: 'Паулин', 
      desc: 'Главная героиня, носитель древней силы "Безымянной". Её история охватывает столетия.', 
      x: 50, 
      y: 50, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 2, 
      name: 'Готье', 
      desc: 'Алхимик и старший сын Мордрагона. Создатель химической формулы "Паурель".', 
      x: 350, 
      y: 150, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
    { 
      id: 3, 
      name: 'Лирхт', 
      desc: 'Муж Паулин, военный стратег. Его преданность проходит через множество испытаний.', 
      x: 200, 
      y: 320, 
      rotation: Math.random() * 20 - 10,
      isDragging: false
    },
  ]);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setMouseInWindow(true);
    
    // Более точная проверка интерактивных элементов
    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    
    let isOverInteractive = false;
    if (elementUnderMouse) {
      // Проверяем только прямые интерактивные элементы без учета родителей
      const tagName = elementUnderMouse.tagName.toLowerCase();
      const hasClass = (className: string) => elementUnderMouse.classList.contains(className);
      
      isOverInteractive = (
        tagName === 'button' ||
        tagName === 'a' ||
        tagName === 'input' ||
        hasClass('btn') ||
        hasClass('nav-link') ||
        hasClass('footer-link') ||
        hasClass('chaotic-card') ||
        elementUnderMouse.hasAttribute('draggable')
      );
    }
    
    setCursorVisible(!isOverInteractive);
    
    // Debug info
    setDebugInfo({ 
      x: e.clientX, 
      y: e.clientY, 
      visible: !isOverInteractive, 
      inWindow: true,
      elementUnder: elementUnderMouse ? 
        `${elementUnderMouse.tagName}${elementUnderMouse.className ? '.' + elementUnderMouse.className.split(' ').slice(0,2).join('.') : ''}${isOverInteractive ? ' [INTERACTIVE]' : ''}` 
        : 'null'
    });
  };
  
  const handleMouseLeave = () => {
    setMouseInWindow(false);
    setDebugInfo(prev => ({ ...prev, inWindow: false, elementUnder: 'outside' }));
  };
  
  const handleMouseEnter = () => {
    setMouseInWindow(true);
    setDebugInfo(prev => ({ ...prev, inWindow: true }));
  };
  
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  
  // Загрузка анимация
  setTimeout(() => setIsLoaded(true), 100);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('mouseenter', handleMouseEnter);
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
    
    // Размеры карточки
    const cardWidth = 300;
    const cardHeight = 200;
    
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
    const positions = [
      { x: 50, y: 50 },
      { x: 350, y: 150 },
      { x: 200, y: 320 }
    ];
    
    setCards(prev => prev.map((card) => {
      let positionIndex;
      if (card.id === 1) positionIndex = 0;
      else if (card.id === 2) positionIndex = 1;
      else if (card.id === 3) positionIndex = 2;
      else positionIndex = 0;
      
      return {
        ...card,
        x: positions[positionIndex].x,
        y: positions[positionIndex].y,
        rotation: Math.random() * 20 - 10
      };
    }));
  };

  return (
  <div className={`app ${isLoaded ? 'loaded' : ''}`}>
    {/* Debug info (убрать в продакшене) */}
    <div style={{
  Mouse: {debugInfo.x}, {debugInfo.y}<br/>
  Cursor: {cursorVisible ? 'VISIBLE' : 'HIDDEN'}<br/>
  Element: {debugInfo.elementUnder}<br/>
  Should show: {(cursorVisible && mouseInWindow) ? 'YES' : 'NO'}
</div>
        Real Mouse: {debugInfo.x}, {debugInfo.y}<br/>
        Cursor Pos: {mousePosition.x - 12}, {mousePosition.y - 12}<br/>
        Visible: {debugInfo.visible ? 'YES' : 'NO'}<br/>
        In Window: {debugInfo.inWindow ? 'YES' : 'NO'}<br/>
        Should Show: {(cursorVisible && mouseInWindow) ? 'YES' : 'NO'}<br/>
        Element: {debugInfo.elementUnder}<br/>
        Cursor State: {cursorVisible ? 'VISIBLE' : 'HIDDEN'}
      </div>

{/* Интерактивный курсор */}
<div 
  className="custom-cursor"
  style={{
    left: mousePosition.x - 12,
    top: mousePosition.y - 12,
    opacity: (cursorVisible && mouseInWindow) ? 1 : 0,
    pointerEvents: 'none'
  }}
/>

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
              <button className="btn btn-primary pulse-on-hover">
                Начать чтение
              </button>
              <button className="btn btn-secondary shake-on-hover">
                Купить книгу
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <div className="container">
          <h2 className="section-title">О вселенной</h2>
          <div className="about-grid">
            <div className="about-card" data-aos="fade-up" data-aos-delay="100">
              <div className="card-icon">I</div>
              <h3>Том I</h3>
              <p>Семейная сага, война и материнство в хаосе. Паулин проходит путь от жрицы-матери до сломленной женщины.</p>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-delay="200">
              <div className="card-icon">II</div>
              <h3>Том II</h3>
              <p>2024 год, Берлин. Современный психологический триллер в стенах Академии Асквевальд.</p>
            </div>
            <div className="about-card" data-aos="fade-up" data-aos-delay="300">
              <div className="card-icon">III</div>
              <h3>Том III</h3>
              <p>Циклы перерождений через века. Готье и Паулин встречаются в разных ролях и эпохах.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="quote">
            <div className="quote-marks">"</div>
            <p>Пусть истина разожжёт в тебе огонь, но не говори — потому что мир ещё спит, и не готов услышать.</p>
            <cite>— Из первого тома AURÉNTAL</cite>
          </blockquote>
        </div>
      </section>

      {/* Characters Section */}
      <section id="chapters" className="section characters">
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

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-number counter" data-target="323">323</div>
              <div className="stat-label">Просмотров на ЛитРес</div>
            </div>
            <div className="stat" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-number counter" data-target="12">12</div>
              <div className="stat-label">Продаж</div>
            </div>
            <div className="stat" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-number counter" data-target="3">3</div>
              <div className="stat-label">Тома</div>
            </div>
            <div className="stat" data-aos="fade-up" data-aos-delay="400">
              <div className="stat-number counter" data-target="1500">1500+</div>
              <div className="stat-label">Страниц</div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" className="section author">
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
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Не пропустите продолжение</h2>
            <p>Подписывайтесь на уведомления о выходе новых томов</p>
            <div className="newsletter">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="email-input"
              />
              <button className="btn btn-primary">
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
              <a href="#" className="footer-link">
                ЛитРес
              </a>
              <a href="#" className="footer-link">
                Telegram
              </a>
              <a href="#" className="footer-link">
                VK
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