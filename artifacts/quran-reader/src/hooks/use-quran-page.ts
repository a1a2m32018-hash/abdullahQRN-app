import { useCallback, useEffect, useState } from 'react';

export type QuranAyah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
  };
};

export type QuranPage = {
  number: number;
  ayahs: QuranAyah[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
};

type ApiResponse = { code: number; status: string; data: QuranPage };
type CacheState = Record<string, QuranPage>;
const CACHE_KEY = 'quran-reader-page-cache-v1';

function readCache(): CacheState {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as CacheState;
  } catch {
    return {};
  }
}

export function useQuranPage(pageNumber: number) {
  const [page, setPage] = useState<QuranPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const load = useCallback(async () => {
    const cached = readCache()[String(pageNumber)];
    setIsLoading(true);
    setError(null);
    setIsOffline(false);
    setPage(cached ?? null);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = (await response.json()) as ApiResponse;
      if (result.code !== 200 || !result.data?.ayahs) throw new Error('Invalid Quran response');
      setPage(result.data);
      const nextCache = { ...readCache(), [String(pageNumber)]: result.data };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(nextCache));
      } catch {
        // The reader remains usable when storage is unavailable.
      }
    } catch {
      if (cached) {
        setIsOffline(true);
      } else {
        setError('تعذر تحميل هذه الصفحة الآن. تحقق من الاتصال ثم حاول مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber]);

  useEffect(() => {
    void load();
  }, [load]);

  return { page, isLoading, error, isOffline, retry: load };
}

export type AyahTafsir = {
  number: number;
  text: string;
  surah: QuranAyah['surah'];
};

type TafsirApiResponse = { code: number; status: string; data: AyahTafsir };
type TafsirCacheState = Record<string, AyahTafsir>;
const TAFSIR_CACHE_KEY = 'quran-reader-tafsir-cache-v1';

function readTafsirCache(): TafsirCacheState {
  try {
    return JSON.parse(localStorage.getItem(TAFSIR_CACHE_KEY) ?? '{}') as TafsirCacheState;
  } catch {
    return {};
  }
}

export function useAyahTafsir(ayah: QuranAyah | null, enabled: boolean) {
  const [tafsir, setTafsir] = useState<AyahTafsir | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!ayah) return;
    const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
    const cached = readTafsirCache()[key];
    setIsLoading(true);
    setError(null);
    setTafsir(cached ?? null);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${key}/ar.muyassar`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = (await response.json()) as TafsirApiResponse;
      if (result.code !== 200 || !result.data?.text) throw new Error('Invalid tafsir response');
      setTafsir(result.data);
      try {
        localStorage.setItem(TAFSIR_CACHE_KEY, JSON.stringify({ ...readTafsirCache(), [key]: result.data }));
      } catch {
        // The explanation remains available in memory if storage is unavailable.
      }
    } catch {
      if (!cached) setError('تعذر تحميل التفسير الآن. تحقق من الاتصال ثم حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [ayah]);

  useEffect(() => {
    if (enabled && ayah) void load();
    else {
      setTafsir(null);
      setError(null);
      setIsLoading(false);
    }
  }, [ayah, enabled, load]);

  return { tafsir, isLoading, error, retry: load };
}

export type Bookmark = {
  id: string;
  page: number;
  createdAt: number;
  label: string;
};

const BOOKMARKS_KEY = 'quran-reader-bookmarks-v1';
export const LAST_PAGE_KEY = 'quran-reader-last-page-v1';

function readBookmarks(): Bookmark[] {
  try {
    const value = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]');
    return Array.isArray(value) ? (value as Bookmark[]) : [];
  } catch {
    return [];
  }
}

export function getInitialReaderPage(): number {
  const savedBookmarks = readBookmarks();
  const bookmarkPage = savedBookmarks[0]?.page;
  if (bookmarkPage && bookmarkPage >= 1 && bookmarkPage <= 604) return bookmarkPage;
  try {
    const lastPage = Number(localStorage.getItem(LAST_PAGE_KEY));
    return lastPage >= 1 && lastPage <= 604 ? lastPage : 1;
  } catch {
    return 1;
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(readBookmarks);

  const persist = useCallback((next: Bookmark[]) => {
    setBookmarks(next);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    } catch {
      // Keep state in memory if private browsing blocks localStorage.
    }
  }, []);

  const addBookmark = useCallback((page: number) => {
    const existing = readBookmarks().find((bookmark) => bookmark.page === page);
    if (existing) return;
    const next: Bookmark = {
      id: `${page}-${Date.now()}`,
      page,
      createdAt: Date.now(),
      label: 'موضع قراءة محفوظ',
    };
    persist([next, ...readBookmarks()]);
  }, [persist]);

  const removeBookmark = useCallback((id: string) => {
    persist(readBookmarks().filter((bookmark) => bookmark.id !== id));
  }, [persist]);

  const isBookmarked = useCallback((page: number) => bookmarks.some((bookmark) => bookmark.page === page), [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
