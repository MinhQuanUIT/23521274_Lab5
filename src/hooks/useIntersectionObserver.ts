import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [(node: Element | null) => void, boolean, IntersectionObserverEntry | null] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
  
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);
  const frozen = useRef(false);

  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (!node || frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (freezeOnceVisible && entry.isIntersecting) {
          frozen.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, threshold, root, rootMargin, freezeOnceVisible]);

  return [setNode, isVisible, entry];
}
