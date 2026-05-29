import { useEffect, useRef, useState } from 'react';

export default function FadeInParagraph({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -35% 0px',
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={`fade-in-paragraph ${visible ? 'fade-in-paragraph--visible' : ''} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
