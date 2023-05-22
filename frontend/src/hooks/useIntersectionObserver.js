import { useEffect } from "react";

const useIntersectionObserver = (
  stopObservingConditionCallback,
  observeElement,
  action
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (stopObservingConditionCallback()) {
            return observer.unobserve(observeElement);
          }

          action();
        }
      },
      { threshold: 1 }
    );

    if (observeElement) {
      observer.observe(observeElement);
    }

    return () => {
      if (observeElement) {
        observer.unobserve(observeElement);
      }
    };
  }, [observeElement, stopObservingConditionCallback, action]);
};

export default useIntersectionObserver;
