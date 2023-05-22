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
          console.log("clgt");
          if (stopObservingConditionCallback()) {
            return observer.unobserve(observeElement);
          }

          action();
        }
      },
      { threshold: 1 }
    );

    if (observeElement) {
      console.log("ahihi");
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
