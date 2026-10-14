import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function usePageContent<T>(pageName: string, defaultData: T) {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    try {
      const docRef = doc(db, "website_content", pageName);
      
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (!isMounted) return;
          
          if (snapshot.exists()) {
            const firestoreData = snapshot.data() as Partial<T>;
            setData({ ...defaultData, ...firestoreData });
          } else {
            console.warn(`[usePageContent] Firestore doc "website_content/${pageName}" not found. Using defaults.`);
            setData(defaultData);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isMounted) return;
          if (err.code === "permission-denied") {
            console.error(`[usePageContent] Permission Denied for "${pageName}". Check Firestore Rules:`, err);
          } else {
            console.error(`[usePageContent] Firestore error for "${pageName}":`, err);
          }
          setError(err);
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
