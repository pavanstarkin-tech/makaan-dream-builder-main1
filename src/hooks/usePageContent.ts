import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb, RTDB_ROOT } from "@/lib/firebase";

export function usePageContent<T>(pageName: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    try {
      const contentRef = ref(rtdb, `${RTDB_ROOT}/website_content/${pageName}`);
      
      const unsubscribe = onValue(
        contentRef,
        (snapshot) => {
          if (!isMounted) return;
          
          if (snapshot.exists()) {
            const rtdbData = snapshot.val() as Partial<T>;
            setData({ ...defaultData, ...rtdbData });
          } else {
            setData(defaultData);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isMounted) return;
          console.error(`[usePageContent] Realtime Database error for "${pageName}":`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      console.error(`[usePageContent] Setup error for "${pageName}":`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [pageName]);

  return { data, loading, error };
}
