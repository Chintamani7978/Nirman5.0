import React, { useRef, useEffect, useState } from 'react';

const ScrollReveal = ({
    children,
    className = '',
    width = '100%',
    delay = 0,
    direction = 'up',
    distance = 30,
    duration = 800 // Slightly faster default for snappier feel
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Safety fallback: Force visibility check after mount
        const safetyTimer = setTimeout(() => {
            if (element) {
                const rect = element.getBoundingClientRect();
                // If element is roughly in view but isVisible is false, force it
                if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                    setIsVisible(true);
                }
            }
        }, 500);

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Use a state update to trigger re-render with new styles
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '50px 0px 50px 0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
            clearTimeout(safetyTimer);
        };
    }, []);

    const getTransform = () => {
        if (isVisible) return 'translate3d(0, 0, 0) scale(1)';

        switch (direction) {
            case 'up': return `translate3d(0, ${distance}px, 0) scale(0.98)`;
            case 'down': return `translate3d(0, -${distance}px, 0) scale(0.98)`;
            case 'left': return `translate3d(-${distance}px, 0, 0) scale(0.98)`;
            case 'right': return `translate3d(${distance}px, 0, 0) scale(0.98)`;
            default: return `translate3d(0, ${distance}px, 0) scale(0.98)`;
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                width,
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                filter: isVisible ? 'blur(0px)' : 'blur(4px)',
                // Premium Ease-Out-Quint / Expo curve
                transition: `
          opacity ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, 
          transform ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms,
          filter ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms
        `,
                willChange: 'opacity, transform, filter'
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
