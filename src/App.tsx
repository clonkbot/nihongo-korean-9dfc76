import { useState, useEffect } from 'react';
import './styles.css';

interface LessonCard {
  id: number;
  japanese: string;
  reading: string;
  korean: string;
  category: string;
}

interface QuizQuestion {
  japanese: string;
  reading: string;
  correct: string;
  options: string[];
}

const vocabulary: LessonCard[] = [
  { id: 1, japanese: '愛', reading: 'あい', korean: '사랑', category: '감정' },
  { id: 2, japanese: '桜', reading: 'さくら', korean: '벚꽃', category: '자연' },
  { id: 3, japanese: '月', reading: 'つき', korean: '달', category: '자연' },
  { id: 4, japanese: '夢', reading: 'ゆめ', korean: '꿈', category: '감정' },
  { id: 5, japanese: '風', reading: 'かぜ', korean: '바람', category: '자연' },
  { id: 6, japanese: '友達', reading: 'ともだち', korean: '친구', category: '관계' },
  { id: 7, japanese: '海', reading: 'うみ', korean: '바다', category: '자연' },
  { id: 8, japanese: '花', reading: 'はな', korean: '꽃', category: '자연' },
  { id: 9, japanese: '心', reading: 'こころ', korean: '마음', category: '감정' },
  { id: 10, japanese: '空', reading: 'そら', korean: '하늘', category: '자연' },
  { id: 11, japanese: '本', reading: 'ほん', korean: '책', category: '물건' },
  { id: 12, japanese: '時間', reading: 'じかん', korean: '시간', category: '개념' },
];

const grammarPoints = [
  { pattern: '~です', korean: '~입니다', example: '学生です', exampleKr: '학생입니다' },
  { pattern: '~ます', korean: '~합니다', example: '食べます', exampleKr: '먹습니다' },
  { pattern: '~たい', korean: '~고 싶다', example: '行きたい', exampleKr: '가고 싶다' },
  { pattern: '~ている', korean: '~하고 있다', example: '読んでいる', exampleKr: '읽고 있다' },
];

function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'vocab' | 'grammar' | 'quiz'>('home');
  const [selectedCard, setSelectedCard] = useState<LessonCard | null>(null);
  const [quizState, setQuizState] = useState<{
    question: QuizQuestion | null;
    answered: boolean;
    correct: boolean;
    score: number;
    total: number;
  }>({ question: null, answered: false, correct: false, score: 0, total: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const generateQuiz = () => {
    const randomVocab = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const wrongOptions = vocabulary
      .filter(v => v.id !== randomVocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.korean);

    const options = [...wrongOptions, randomVocab.korean].sort(() => Math.random() - 0.5);

    setQuizState({
      question: {
        japanese: randomVocab.japanese,
        reading: randomVocab.reading,
        correct: randomVocab.korean,
        options,
      },
      answered: false,
      correct: false,
      score: quizState.score,
      total: quizState.total,
    });
  };

  const handleAnswer = (answer: string) => {
    if (quizState.answered || !quizState.question) return;
    const isCorrect = answer === quizState.question.correct;
    setQuizState({
      ...quizState,
      answered: true,
      correct: isCorrect,
      score: quizState.score + (isCorrect ? 1 : 0),
      total: quizState.total + 1,
    });
  };

  return (
    <div className={`app ${loaded ? 'loaded' : ''}`}>
      <div className="texture-overlay" />

      {/* Decorative Elements */}
      <div className="deco-stamp top-right">
        <span>学</span>
      </div>
      <div className="deco-line horizontal" />
      <div className="deco-line vertical" />

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-jp">日本語</span>
            <span className="logo-divider">/</span>
            <span className="logo-kr">일본어</span>
          </h1>
          <p className="tagline">한국인을 위한 일본어 학습</p>
        </div>

        <nav className="nav">
          {[
            { key: 'home', label: '홈', jp: 'ホーム' },
            { key: 'vocab', label: '단어', jp: '単語' },
            { key: 'grammar', label: '문법', jp: '文法' },
            { key: 'quiz', label: '퀴즈', jp: 'クイズ' },
          ].map((item) => (
            <button
              key={item.key}
              className={`nav-btn ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.key as typeof activeSection);
                if (item.key === 'quiz') generateQuiz();
                setSelectedCard(null);
              }}
            >
              <span className="nav-jp">{item.jp}</span>
              <span className="nav-kr">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        {activeSection === 'home' && (
          <section className="home-section">
            <div className="hero">
              <div className="hero-text">
                <h2 className="hero-title">
                  <span className="hero-char">始</span>
                  <span className="hero-sub">めましょう</span>
                </h2>
                <p className="hero-korean">시작합시다</p>
                <p className="hero-desc">
                  한국어와 일본어의 유사한 문법 구조를 활용하여<br />
                  더 효과적으로 일본어를 배워보세요.
                </p>
                <button
                  className="cta-btn"
                  onClick={() => setActiveSection('vocab')}
                >
                  <span>학습 시작</span>
                  <span className="cta-arrow">→</span>
                </button>
              </div>

              <div className="hero-visual">
                <div className="floating-chars">
                  {['あ', 'い', 'う', 'え', 'お'].map((char, i) => (
                    <span
                      key={char}
                      className="float-char"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">漢</div>
                <h3>한자 학습</h3>
                <p>한국어 한자어 지식을 활용한 효율적인 학습</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">文</div>
                <h3>문법 비교</h3>
                <p>유사한 어순과 문법 구조 비교 분석</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">話</div>
                <h3>실전 회화</h3>
                <p>일상에서 바로 쓸 수 있는 표현</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'vocab' && (
          <section className="vocab-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-jp">単語</span>
                <span className="title-kr">단어 학습</span>
              </h2>
              <p className="section-desc">카드를 클릭하여 발음과 뜻을 확인하세요</p>
            </div>

            <div className="vocab-grid">
              {vocabulary.map((card, index) => (
                <div
                  key={card.id}
                  className={`vocab-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                >
                  <span className="card-category">{card.category}</span>
                  <span className="card-japanese">{card.japanese}</span>
                  {selectedCard?.id === card.id && (
                    <div className="card-details">
                      <span className="card-reading">{card.reading}</span>
                      <span className="card-korean">{card.korean}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'grammar' && (
          <section className="grammar-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-jp">文法</span>
                <span className="title-kr">문법 패턴</span>
              </h2>
              <p className="section-desc">한국어와 비교하며 일본어 문법을 익혀보세요</p>
            </div>

            <div className="grammar-list">
              {grammarPoints.map((point, index) => (
                <div
                  key={point.pattern}
                  className="grammar-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grammar-pattern">
                    <span className="pattern-jp">{point.pattern}</span>
                    <span className="pattern-equals">=</span>
                    <span className="pattern-kr">{point.korean}</span>
                  </div>
                  <div className="grammar-example">
                    <div className="example-row">
                      <span className="example-label">日</span>
                      <span className="example-text">{point.example}</span>
                    </div>
                    <div className="example-row">
                      <span className="example-label">韓</span>
                      <span className="example-text">{point.exampleKr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'quiz' && (
          <section className="quiz-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-jp">クイズ</span>
                <span className="title-kr">단어 퀴즈</span>
              </h2>
              <div className="quiz-score">
                점수: <strong>{quizState.score}</strong> / {quizState.total}
              </div>
            </div>

            {quizState.question && (
              <div className="quiz-card">
                <div className="quiz-question">
                  <span className="quiz-japanese">{quizState.question.japanese}</span>
                  <span className="quiz-reading">{quizState.question.reading}</span>
                </div>

                <div className="quiz-options">
                  {quizState.question.options.map((option) => (
                    <button
                      key={option}
                      className={`quiz-option ${
                        quizState.answered
                          ? option === quizState.question?.correct
                            ? 'correct'
                            : 'wrong'
                          : ''
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={quizState.answered}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {quizState.answered && (
                  <div className={`quiz-result ${quizState.correct ? 'correct' : 'wrong'}`}>
                    {quizState.correct ? '정답입니다! 正解!' : `오답입니다. 정답: ${quizState.question.correct}`}
                  </div>
                )}

                <button
                  className="next-btn"
                  onClick={generateQuiz}
                >
                  {quizState.answered ? '다음 문제' : '문제 건너뛰기'}
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">Requested by @JolupCCTV · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
