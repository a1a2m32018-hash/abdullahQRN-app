import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleGauge,
  Compass,
  Hash,
  Menu,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  WifiOff,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getInitialReaderPage, useAyahTafsir, useBookmarks, useQuranPage, LAST_PAGE_KEY, type Bookmark as BookmarkItem, type QuranAyah } from '@/hooks/use-quran-page';

type Surah = { number: number; name: string; page: number; type: string; ayahs: number };
const surahs: Surah[] = [
  ['الفاتحة',1,'مكية',7],['البقرة',2,'مدنية',286],['آل عمران',50,'مدنية',200],['النساء',77,'مدنية',176],['المائدة',106,'مدنية',120],['الأنعام',128,'مكية',165],['الأعراف',151,'مكية',206],['الأنفال',177,'مدنية',75],['التوبة',187,'مدنية',129],['يونس',208,'مكية',109],['هود',221,'مكية',123],['يوسف',235,'مكية',111],['الرعد',249,'مدنية',43],['إبراهيم',255,'مكية',52],['الحجر',262,'مكية',99],['النحل',267,'مكية',128],['الإسراء',282,'مكية',111],['الكهف',293,'مكية',110],['مريم',305,'مكية',98],['طه',312,'مكية',135],['الأنبيائ',322,'مكية',112],['الحج',332,'مدنية',78],['المؤمنون',342,'مكية',118],['النور',350,'مدنية',64],['الفرقان',359,'مكية',77],['الشعراء',367,'مكية',227],['النمل',377,'مكية',93],['القصص',385,'مكية',88],['العنكبوت',396,'مكية',69],['الروم',404,'مكية',60],['لقمان',411,'مكية',34],['السجدة',415,'مكية',30],['الأحزاب',418,'مدنية',73],['سبأ',428,'مكية',54],['فاطر',434,'مكية',45],['يس',440,'مكية',83],['الصافات',446,'مكية',182],['ص',453,'مكية',88],['الزمر',458,'مكية',75],['غافر',467,'مكية',85],['فصلت',477,'مكية',54],['الشورى',483,'مكية',53],['الزخرف',489,'مكية',89],['الدخان',496,'مكية',59],['الجاثية',499,'مكية',37],['الأحقاف',502,'مكية',35],['محمد',507,'مدنية',38],['الفتح',511,'مدنية',29],['الحجرات',515,'مدنية',18],['ق',518,'مكية',45],['الذاريات',520,'مكية',60],['الطور',523,'مكية',49],['النجم',526,'مكية',62],['القمر',528,'مكية',55],['الرحمن',531,'مدنية',78],['الواقعة',534,'مكية',96],['الحديد',537,'مدنية',29],['المجادلة',542,'مدنية',22],['الحشر',545,'مدنية',24],['الممتحنة',549,'مدنية',13],['الصف',551,'مدنية',14],['الجمعة',553,'مدنية',11],['المنافقون',554,'مدنية',11],['التغابن',556,'مدنية',18],['الطلاق',558,'مدنية',12],['التحريم',560,'مدنية',12],['الملك',562,'مكية',30],['القلم',564,'مكية',52],['الحاقة',566,'مكية',52],['المعارج',568,'مكية',44],['نوح',570,'مكية',28],['الجن',572,'مكية',28],['المزمل',574,'مكية',20],['المدثر',575,'مكية',56],['القيامة',577,'مكية',40],['الإنسان',578,'مدنية',31],['المرسلات',580,'مكية',50],['النبأ',582,'مكية',40],['النازعات',583,'مكية',46],['عبس',585,'مكية',42],['التكوير',586,'مكية',29],['الانفطار',587,'مكية',19],['المطففين',587,'مكية',36],['الانشقاق',589,'مكية',25],['البروج',590,'مكية',22],['الطارق',591,'مكية',17],['الأعلى',591,'مكية',19],['الغاشية',592,'مكية',26],['الفجر',593,'مكية',30],['البلد',594,'مكية',20],['الشمس',595,'مكية',15],['الليل',595,'مكية',21],['الضحى',596,'مكية',11],['الشرح',596,'مكية',8],['التين',597,'مكية',8],['العلق',597,'مكية',19],['القدر',598,'مكية',5],['البينة',599,'مدنية',8],['الزلزلة',599,'مدنية',8],['العاديات',600,'مكية',11],['القارعة',600,'مكية',11],['التكاثر',601,'مكية',8],['العصر',601,'مكية',3],['الهمزة',601,'مكية',9],['الفيل',601,'مكية',5],['قريش',602,'مكية',4],['الماعون',602,'مكية',7],['الكوثر',602,'مكية',3],['الكافرون',603,'مكية',6],['النصر',603,'مدنية',3],['المسد',603,'مكية',5],['الإخلاص',604,'مكية',4],['الفلق',604,'مكية',5],['الناس',604,'مكية',6],
].map(([name, page, type, ayahs], index) => ({ number: index + 1, name: name as string, page: page as number, type: type as string, ayahs: ayahs as number }));

const toArabicNumber = (value: number | string) => String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
const fromArabicNumber = (value: string) => value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
const pageSurah = (page: number) => surahs.reduce((current, surah) => (surah.page <= page ? surah : current), surahs[0]);
const TAFSIR_MODE_KEY = 'quran-reader-tafsir-mode-v1';
const DARK_MODE_KEY = 'quran-reader-dark-mode-v1';
const DHIKR_KEY = 'quran-reader-dhikr-v1';

type DhikrCounter = { id: string; label: string; phrase: string; count: number };
const defaultDhikr: DhikrCounter[] = [
  { id: 'istighfar', label: 'الاستغفار', phrase: 'أستغفر الله', count: 0 },
  { id: 'tasbeeh', label: 'التسبيح', phrase: 'سبحان الله', count: 0 },
  { id: 'adhkar', label: 'الأذكار', phrase: 'لا إله إلا الله', count: 0 },
  { id: 'salawat', label: 'الصلاة على النبي ﷺ', phrase: 'اللهم صل وسلم على نبينا محمد', count: 0 },
  { id: 'hawqala', label: 'الحوقلة', phrase: 'لا حول ولا قوة إلا بالله', count: 0 },
  { id: 'tahlil', label: 'التهليل', phrase: 'لا إله إلا الله وحده لا شريك له', count: 0 },
];

function readPreference(key: string) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function readDhikr(): DhikrCounter[] {
  try {
    const saved = JSON.parse(localStorage.getItem(DHIKR_KEY) ?? 'null') as Partial<DhikrCounter>[] | null;
    if (!Array.isArray(saved)) return defaultDhikr;
    return defaultDhikr.map((item) => ({ ...item, count: Math.max(0, Number(saved.find((savedItem) => savedItem.id === item.id)?.count) || 0) }));
  } catch {
    return defaultDhikr;
  }
}

function IconButton({ label, onClick, children, active = false, testId }: { label: string; onClick: () => void; children: ReactNode; active?: boolean; testId: string }) {
  return (
    <button aria-label={label} data-testid={testId} onClick={onClick} className={`group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition-all duration-200 ${active ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.18)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] text-[hsl(var(--muted-foreground))] hover:-translate-y-0.5 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]'}`}>
      {children}
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[hsl(var(--foreground))] px-2 py-1 text-[9px] text-[hsl(var(--background))] group-hover:block">{label}</span>
    </button>
  );
}

function Drawer({ kind, onClose, children }: { kind: 'bookmarks' | 'surahs'; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-40 bg-[hsl(var(--foreground)/.22)] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.aside role="dialog" aria-label={kind === 'bookmarks' ? 'المواضع المحفوظة' : 'فهرس السور'} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-[min(91vw,390px)] flex-col bg-[hsl(var(--card))] shadow-[-16px_0_40px_hsl(var(--foreground)/.15)]">
          {children}
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

function DrawerHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return <div className="flex items-start justify-between border-b border-[hsl(var(--border))] px-5 py-5"><div><p className="mb-1 text-[10px] font-semibold tracking-[.22em] text-[hsl(var(--accent))]">مصحف QRN</p><h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h2><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{subtitle}</p></div><button data-testid="button-close-drawer" aria-label="إغلاق" onClick={onClose} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"><X size={19} /></button></div>;
}

function BookmarkDrawer({ bookmarks, onClose, onGo, onRemove }: { bookmarks: BookmarkItem[]; onClose: () => void; onGo: (page: number) => void; onRemove: (id: string) => void }) {
  return <Drawer kind="bookmarks" onClose={onClose}><DrawerHeader title="مواضعي المحفوظة" subtitle={`${toArabicNumber(bookmarks.length)} مواضع في هذا الجهاز`} onClose={onClose} /><div className="custom-scrollbar flex-1 overflow-y-auto p-4">{bookmarks.length === 0 ? <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[hsl(var(--muted-foreground))]"><Bookmark size={28} strokeWidth={1.3} className="mb-4 text-[hsl(var(--accent))]" /><p className="text-sm">لم تحفظ موضعاً بعد</p><p className="mt-2 text-[10px] leading-6">اضغط علامة الحفظ أثناء القراءة لتعود إلى موضعك بسهولة.</p></div> : <div className="space-y-2">{bookmarks.map((bookmark) => <BookmarkRow key={bookmark.id} bookmark={bookmark} onGo={onGo} onRemove={onRemove} />)}</div>}</div></Drawer>;
}

function BookmarkRow({ bookmark, onGo, onRemove }: { bookmark: BookmarkItem; onGo: (page: number) => void; onRemove: (id: string) => void }) {
  return <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.46)] p-3"><button data-testid={`button-bookmark-page-${bookmark.page}`} onClick={() => onGo(bookmark.page)} className="flex min-w-0 flex-1 items-center gap-3 text-right hover:text-[hsl(var(--primary))]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--accent)/.16)] text-sm text-[hsl(var(--primary))] arabic-number">{toArabicNumber(bookmark.page)}</span><span className="min-w-0"><span className="block truncate text-xs font-semibold">{bookmark.label}</span><span className="mt-1 block text-[10px] text-[hsl(var(--muted-foreground))]">الصفحة {toArabicNumber(bookmark.page)}</span></span></button><button data-testid={`button-remove-bookmark-${bookmark.page}`} aria-label="حذف الموضع" onClick={() => onRemove(bookmark.id)} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--destructive))]"><X size={15} /></button></div>;
}

function SurahDrawer({ onClose, onGo, currentPage }: { onClose: () => void; onGo: (page: number) => void; currentPage: number }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => surahs.filter((surah) => surah.name.includes(query) || String(surah.number).includes(query)), [query]);
  return <Drawer kind="surahs" onClose={onClose}><DrawerHeader title="فهرس السور" subtitle="١١٤ سورة · مصحف المدينة" onClose={onClose} /><div className="border-b border-[hsl(var(--border))] p-4"><label className="relative block"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-search-surah" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن سورة" className="h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.65)] pr-10 pl-3 text-xs outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/.16)]" /></label></div><div className="custom-scrollbar flex-1 overflow-y-auto p-3">{filtered.length === 0 ? <div className="py-14 text-center text-xs text-[hsl(var(--muted-foreground))]">لا توجد سورة بهذا الاسم</div> : <div className="space-y-1">{filtered.map((surah) => <button key={surah.number} data-testid={`button-surah-${surah.number}`} onClick={() => onGo(surah.page)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right transition-colors hover:bg-[hsl(var(--muted))] ${pageSurah(currentPage).number === surah.number ? 'bg-[hsl(var(--accent)/.13)]' : ''}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[hsl(var(--accent)/.45)] text-[10px] text-[hsl(var(--primary))] [clip-path:polygon(50%_0,90%_25%,90%_75%,50%_100%,10%_75%,10%_25%)]">{toArabicNumber(surah.number)}</span><span className="min-w-0 flex-1"><span className="block font-serif text-lg leading-none text-[hsl(var(--foreground))]">{surah.name}</span><span className="mt-1 block text-[9px] text-[hsl(var(--muted-foreground))]">{surah.type} · {toArabicNumber(surah.ayahs)} آية</span></span><span className="text-[10px] text-[hsl(var(--muted-foreground))]">ص {toArabicNumber(surah.page)}</span></button>)}</div>}</div></Drawer>;
}

function SkeletonPage() {
  return <div className="space-y-6 px-4 py-12" aria-label="جاري تحميل الصفحة" data-testid="status-loading"><div className="mx-auto h-7 w-36 animate-pulse rounded bg-[hsl(var(--muted))]" /><div className="mx-auto h-px w-3/4 bg-[hsl(var(--border))]" />{[80, 95, 72, 88, 64, 91, 76].map((width, index) => <div key={index} className="flex justify-center"><div style={{ width: `${width}%` }} className="h-7 animate-pulse rounded bg-[hsl(var(--muted))]" /></div>)}</div>;
}

function cleanAyahText(text: string, isFirstAyahOfSurah: boolean): string {
  if (!isFirstAyahOfSurah) return text;
  return text
    .replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/u, '')
    .replace(/^بِسْمِ\s+اللهِ\s+الرَّحْمٰنِ\s+الرَّحِيمِ\s*/u, '')
    .replace(/^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/u, '');
}

function AyahText({ ayah, startsSurah, onSelect, tafsirMode }: { ayah: QuranAyah; startsSurah: boolean; onSelect: (ayah: QuranAyah) => void; tafsirMode: boolean }) {
  const handleClick = () => {
    if (tafsirMode) {
      onSelect(ayah);
    }
  };

  const showBasmala = startsSurah && ayah.surah.number !== 1 && ayah.surah.number !== 9;
  const isFirstOfSurah = ayah.numberInSurah === 1;
  const cleanedText = cleanAyahText(ayah.text, isFirstOfSurah);

  return (
    <span 
      onClick={handleClick}
      className={`${tafsirMode ? 'cursor-pointer hover:bg-[hsl(var(--accent)/.2)] hover:rounded transition-colors duration-150' : ''} ${startsSurah ? 'surah-break' : ''}`}
      title={tafsirMode ? 'اضغط لعرض التفسير' : undefined}
    >
      {startsSurah && (
        <span className="block text-center w-full" aria-label={`بداية سورة ${ayah.surah.name}`}>
          <span className="surah-title-frame surah-title-frame-inline my-6" aria-label={`عنوان سورة ${ayah.surah.name}`}>
            <span className="surah-title-rule" />
            <span className="font-serif text-xl text-[hsl(var(--primary))]">{ayah.surah.name}</span>
            <span className="surah-title-rule" />
          </span>
          {showBasmala && (
            <span className="block font-serif text-xl text-[hsl(var(--foreground))] my-4 text-center">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
          )}
        </span>
      )}
      {cleanedText}
      <span className="ayah-marker mx-1.5 inline-block text-[.62em] text-[hsl(var(--primary))]">
        {toArabicNumber(ayah.numberInSurah)}
      </span>{' '}
    </span>
  );
}

function PageContent({ page, isBookmarked, onBookmark, onAyahSelect, tafsirMode }: { page: NonNullable<ReturnType<typeof useQuranPage>['page']>; isBookmarked: boolean; onBookmark: () => void; onAyahSelect: (ayah: QuranAyah) => void; tafsirMode: boolean }) {
  const firstSurah = page.ayahs[0]?.surah;
  const surahBreaks = page.ayahs.reduce<number[]>((acc, ayah, index) => (index === 0 || ayah.surah.number !== page.ayahs[index - 1].surah.number ? [...acc, index] : acc), []);
  
  const isSurahStartPage = firstSurah && page.ayahs[0]?.numberInSurah === 1;

  return (
    <div className="page-in px-2 py-4 sm:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
          <span className="h-px w-6 bg-[hsl(var(--accent)/.6)]" />
          <span className="text-[11px]">الجزء {toArabicNumber(page.ayahs[0]?.juz ?? 1)}</span>
        </div>
        <button data-testid="button-bookmark-current" aria-label={isBookmarked ? 'إزالة حفظ الصفحة' : 'حفظ الصفحة'} onClick={onBookmark} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] transition-colors ${isBookmarked ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.15)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))]'}`}>
          {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {isBookmarked ? 'محفوظ' : 'حفظ الموضع'}
        </button>
      </div>

      {isSurahStartPage && firstSurah && (
        <div className="surah-title-frame mb-6">
          <div className="surah-title-rule" />
          <h1 className="font-serif text-2xl text-[hsl(var(--primary))] sm:text-3xl">{firstSurah.name}</h1>
          <div className="surah-title-rule" />
        </div>
      )}

      {isSurahStartPage && firstSurah && firstSurah.number !== 1 && firstSurah.number !== 9 && (
        <div className="block font-serif text-xl text-[hsl(var(--foreground))] mb-6 text-center">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      <div className="quran-text quran-script text-right font-serif text-xl leading-[2.8] tracking-wide text-[hsl(var(--foreground))] sm:text-2xl sm:leading-[3.0]">
        {page.ayahs.map((ayah, index) => (
          <AyahText 
            key={ayah.number} 
            ayah={ayah} 
            startsSurah={surahBreaks.includes(index) && index !== 0} 
            onSelect={onAyahSelect} 
            tafsirMode={tafsirMode} 
          />
        ))}
      </div>
    </div>
  );
}

function EmptyPage() {
  return <div className="flex min-h-[410px] flex-col items-center justify-center px-6 text-center" data-testid="status-empty"><Hash size={27} strokeWidth={1.3} className="mb-4 text-[hsl(var(--accent))]" /><p className="text-sm">لا توجد آيات في هذه الصفحة</p><p className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">حاول الانتقال إلى صفحة أخرى من المصحف.</p></div>;
}

function ErrorPage({ message, retry }: { message: string; retry: () => void }) {
  return <div className="flex min-h-[410px] flex-col items-center justify-center px-6 text-center" data-testid="status-error"><CircleAlert size={28} strokeWidth={1.3} className="mb-4 text-[hsl(var(--destructive))]" /><p className="max-w-[250px] text-sm leading-7">{message}</p><button data-testid="button-retry-page" onClick={retry} className="mt-5 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-[10px] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5">إعادة المحاولة</button></div>;
}

function DhikrPanel() {
  const [counters, setCounters] = useState<DhikrCounter[]>(readDhikr);
  const total = counters.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    try {
      localStorage.setItem(DHIKR_KEY, JSON.stringify(counters));
    } catch {
      // Keep available in memory
    }
  }, [counters]);

  const increment = (id: string) => {
    setCounters((current) => current.map((item) => item.id === id ? { ...item, count: item.count + 1 } : item));
  };
  const reset = () => setCounters(defaultDhikr);

  return <section className="adhkar-panel mx-auto mt-2 max-w-xl rounded-[1.35rem] border border-[hsl(var(--border))] p-4 sm:p-6" dir="rtl" data-testid="section-adhkar">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[hsl(var(--border)/.75)] pb-4"><div><div className="mb-2 flex items-center gap-2 text-[hsl(var(--accent))]"><Sparkles size={15} /><span className="text-[10px] font-semibold tracking-[.18em]">مساحة الذكر</span></div><h2 className="font-serif text-2xl text-[hsl(var(--primary))]">أذكاري اليوم</h2><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">عدادات تحفظ تقدمك تلقائياً على هذا الجهاز</p></div><div className="flex items-center gap-3"><span className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--muted-foreground))]"><CircleGauge size={13} className="text-[hsl(var(--accent))]" /> المجموع <strong className="font-serif text-lg text-[hsl(var(--primary))]">{toArabicNumber(total)}</strong></span><button data-testid="button-reset-dhikr" onClick={reset} className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3 py-2 text-[10px] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]"><RotateCcw size={13} /> تصفير</button></div></div>
    <div className="grid gap-3 sm:grid-cols-2">{counters.map((counter) => <button key={counter.id} data-testid={`button-dhikr-${counter.id}`} onClick={() => increment(counter.id)} className="dhikr-card group text-right"><span className="flex items-center justify-between gap-3"><span><span className="block text-[10px] text-[hsl(var(--muted-foreground))]">{counter.label}</span><span className="mt-1 block font-serif text-lg text-[hsl(var(--foreground))]">{counter.phrase}</span></span><span className="dhikr-count"><span className="font-serif text-xl">{toArabicNumber(counter.count)}</span><Plus size={14} /></span></span><span className="mt-4 flex items-center justify-between text-[9px] text-[hsl(var(--muted-foreground))]"><span>اضغط للزيادة</span><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))] transition-transform group-hover:scale-150" /></span></button>)}</div>
  </section>;
}

function TafsirDialog({ ayah, onClose }: { ayah: QuranAyah; onClose: () => void }) {
  const { tafsir, isLoading, error, retry } = useAyahTafsir(ayah, true);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground)/.3)] p-3 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-modal="true" aria-labelledby="tafsir-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} onClick={(event) => event.stopPropagation()} className="max-h-[82dvh] w-full max-w-xl overflow-y-auto rounded-[1.25rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-right shadow-[0_20px_60px_hsl(var(--foreground)/.2)] sm:p-7" dir="rtl">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-[hsl(var(--border))] pb-4"><div><p className="mb-1 text-[10px] tracking-[.18em] text-[hsl(var(--accent))]">التفسير الميسر</p><h2 id="tafsir-title" className="font-serif text-2xl text-[hsl(var(--primary))]">تفسير الآية</h2><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">سورة {ayah.surah.name} · الآية {toArabicNumber(ayah.numberInSurah)}</p></div><button data-testid="button-close-tafsir" aria-label="إغلاق التفسير" onClick={onClose} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"><X size={19} /></button></div>
      {isLoading && !tafsir ? <div className="space-y-3 py-5" data-testid="status-tafsir-loading"><div className="h-4 w-11/12 animate-pulse rounded bg-[hsl(var(--muted))]" /><div className="h-4 w-full animate-pulse rounded bg-[hsl(var(--muted))]" /><div className="h-4 w-4/5 animate-pulse rounded bg-[hsl(var(--muted))]" /></div> : error && !tafsir ? <div className="py-6 text-center" data-testid="status-tafsir-error"><CircleAlert size={25} className="mx-auto mb-3 text-[hsl(var(--destructive))]" /><p className="text-xs leading-6 text-[hsl(var(--muted-foreground))]">{error}</p><button data-testid="button-retry-tafsir" onClick={() => void retry()} className="mt-4 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-[10px] text-[hsl(var(--primary-foreground))]">إعادة المحاولة</button></div> : <div className="rounded-xl border border-[hsl(var(--accent)/.25)] bg-[hsl(var(--background)/.45)] p-4 sm:p-5"><p className="font-serif text-lg leading-[2.05] text-[hsl(var(--foreground))]" data-testid="text-tafsir">{tafsir?.text}</p><p className="mt-5 border-t border-[hsl(var(--border))] pt-3 text-[9px] text-[hsl(var(--muted-foreground))]">المصدر: التفسير الميسر · Al Quran Cloud API</p></div>}
    </motion.div>
  </motion.div>;
}

function PageArrow({ side, disabled, onClick, isScrolling }: { side: 'right' | 'left'; disabled: boolean; onClick: () => void; isScrolling: boolean }) {
  const isRight = side === 'right';
  return (
    <button
      data-testid={`button-fixed-${side}-page`}
      aria-label={isRight ? 'الصفحة السابقة' : 'الصفحة التالية'}
      title={isRight ? 'الصفحة السابقة' : 'الصفحة التالية'}
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: isScrolling ? 0.15 : undefined }}
      className={`fixed ${isRight ? 'right-2 sm:right-6' : 'left-2 sm:left-6'} top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[hsl(var(--accent)/.6)] bg-[hsl(var(--card)/.92)] text-[hsl(var(--primary))] shadow-[0_4px_14px_hsl(var(--foreground)/.12)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-[hsl(var(--accent)/.18)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 sm:h-12 sm:w-12`}
    >
      <span className="sr-only">{isRight ? 'الصفحة السابقة' : 'الصفحة التالية'}</span>
      {isRight ? <ChevronRight size={22} strokeWidth={2} /> : <ChevronLeft size={22} strokeWidth={2} />}
    </button>
  );
}

export default function QuranReader() {
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [pageNumber, setPageNumber] = useState(getInitialReaderPage);
  const [pageInput, setPageInput] = useState(String(getInitialReaderPage()));
  const [drawer, setDrawer] = useState<'bookmarks' | 'surahs' | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [direction, setDirection] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState<QuranAyah | null>(null);
  const [tafsirMode, setTafsirMode] = useState(() => readPreference(TAFSIR_MODE_KEY));
  const [isDark, setIsDark] = useState(() => readPreference(DARK_MODE_KEY));
  const [currentView, setCurrentView] = useState<'quran' | 'adhkar'>('quran');
  
  // حالة الشفافية أثناء التمرير
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const { page, isLoading, error, isOffline, retry } = useQuranPage(pageNumber);
  const currentSurah = pageSurah(pageNumber);

  useEffect(() => {
    try { localStorage.setItem(LAST_PAGE_KEY, String(pageNumber)); } catch { /* no-op */ }
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem(DARK_MODE_KEY, String(isDark)); } catch { /* no-op */ }
  }, [isDark]);

  useEffect(() => {
    try { localStorage.setItem(TAFSIR_MODE_KEY, String(tafsirMode)); } catch { /* no-op */ }
    if (!tafsirMode) setSelectedAyah(null);
  }, [tafsirMode]);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, []);

  const goTo = (next: number) => {
    const bounded = Math.min(604, Math.max(1, next));
    if (bounded === pageNumber) return;
    setDirection(bounded > pageNumber ? 1 : -1);
    setPageNumber(bounded);
    setSelectedAyah(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = () => {
    const existing = bookmarks.find((bookmark) => bookmark.page === pageNumber);
    if (existing) removeBookmark(existing.id);
    else addBookmark(pageNumber);
  };

  return <main className="paper-grain min-h-[100dvh] bg-[hsl(var(--background))]" dir="rtl">
    <header className="sticky top-0 z-35 border-b border-[hsl(var(--border)/.72)] bg-[hsl(var(--background)/.9)] backdrop-blur-md">
      <div className="reader-header mx-auto flex max-w-xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--accent)/.72)] text-[hsl(var(--accent))]">
            <BookOpen size={17} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] text-[hsl(var(--primary))]">مصحف QRN</p>
            <p className="hidden text-[9px] text-[hsl(var(--muted-foreground))] sm:block">رفيقك الهادئ كل يوم</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          {currentView === 'quran' && (
            <button
              data-testid="toggle-tafsir-mode"
              onClick={() => setTafsirMode((current) => !current)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all border ${
                tafsirMode
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-white shadow-md'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))]'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${tafsirMode ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              <span>وضع التفسير: {tafsirMode ? 'مفعل' : 'معطل'}</span>
            </button>
          )}

          <IconButton
            label={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}
            testId="button-toggle-dark-mode"
            onClick={() => setIsDark((current) => !current)}
            active={isDark}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>

          <IconButton
            label="فهرس السور"
            testId="button-open-surahs"
            onClick={() => setDrawer('surahs')}
          >
            <Menu size={17} />
          </IconButton>

          <IconButton
            label="مواضعي المحفوظة"
            testId="button-open-bookmarks"
            onClick={() => setDrawer('bookmarks')}
            active={bookmarks.length > 0}
          >
            <Bookmark size={17} />
          </IconButton>
        </div>
      </div>
    </header>

    {!isOnline && (
      <div
        className="mx-auto flex max-w-xl items-center justify-center gap-2 border-b border-[hsl(var(--accent)/.24)] bg-[hsl(var(--accent)/.1)] px-4 py-2 text-[10px] text-[hsl(var(--primary))]"
        data-testid="status-offline"
      >
        <WifiOff size={13} />
        أنت غير متصل. ستظهر الصفحات المحفوظة على هذا الجهاز.
      </div>
    )}

    {currentView === 'quran' && (
      <>
        <PageArrow
          side="right"
          disabled={pageNumber === 1}
          onClick={() => goTo(pageNumber - 1)}
          isScrolling={isScrolling}
        />
        <PageArrow
          side="left"
          disabled={pageNumber === 604}
          onClick={() => goTo(pageNumber + 1)}
          isScrolling={isScrolling}
        />
      </>
    )}

    <section className="reader-section mx-auto max-w-xl px-2 pb-28 pt-4 sm:px-6 sm:pt-6">
      {currentView === 'quran' ? (
        <>
          <div className="mb-4 flex items-end justify-between px-2">
            <div>
              <p className="mb-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">أنت تقرأ الآن</p>
              <h2 data-testid="text-current-surah" className="font-serif text-xl sm:text-2xl text-[hsl(var(--primary))]">
                {currentSurah.name}
              </h2>
            </div>

            <form
              className="text-left"
              onSubmit={(event) => {
                event.preventDefault();
                goTo(Number(pageInput));
              }}
            >
              <label htmlFor="page-jump" className="block text-[10px] text-[hsl(var(--muted-foreground))]">
                انتقل إلى صفحة
              </label>

              <div className="mt-0.5 flex items-center gap-1">
                <input
                  id="page-jump"
                  data-testid="input-page-jump"
                  value={toArabicNumber(pageInput)}
                  onChange={(event) => setPageInput(fromArabicNumber(event.target.value).replace(/\D/g, '').slice(0, 3))}
                  inputMode="numeric"
                  aria-label="رقم الصفحة"
                  className="w-12 border-b border-[hsl(var(--accent)/.65)] bg-transparent py-0.5 text-left font-serif text-lg text-[hsl(var(--primary))] outline-none"
                />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">/ ٦٠٤</span>
              </div>
            </form>
          </div>

          {tafsirMode && (
            <div className="mb-3 rounded-lg border border-[hsl(var(--accent)/.4)] bg-[hsl(var(--accent)/.1)] p-2 text-center text-[11px] text-[hsl(var(--primary))]">
              💡 وضع التفسير مفعل: اضغط على أي آية لمشاهدة تفسيرها الميسر.
            </div>
          )}

          <div className="mushaf-frame mx-auto min-h-[620px] overflow-hidden rounded-[1.25rem] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] p-2 shadow-sm sm:p-4">
            <div className="ornament-line mx-8 mt-3 sm:mx-14 sm:mt-5" />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0, x: direction * 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -12 }}
                transition={{ duration: .24 }}
              >
                {isLoading && !page ? (
                  <SkeletonPage />
                ) : error && !page ? (
                  <ErrorPage message={error} retry={retry} />
                ) : page?.ayahs.length ? (
                  <PageContent
                    page={page}
                    isBookmarked={isBookmarked(pageNumber)}
                    onBookmark={toggleBookmark}
                    onAyahSelect={setSelectedAyah}
                    tafsirMode={tafsirMode}
                  />
                ) : (
                  <EmptyPage />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="ornament-line mx-8 mb-3 sm:mx-14 sm:mb-5" />
          </div>

          {isOffline && (
            <div
              className="mx-auto mt-3 flex max-w-xl items-center justify-center gap-2 text-[9px] text-[hsl(var(--muted-foreground))]"
              data-testid="status-cached-page"
            >
              <WifiOff size={12} />
              تُعرض نسخة محفوظة من هذه الصفحة
            </div>
          )}
        </>
      ) : (
        <DhikrPanel />
      )}

      <div className="mx-auto mt-5 flex max-w-xl items-center justify-between gap-3">
        <button
          data-testid="button-nav-mushaf"
          onClick={() => setCurrentView('quran')}
          className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border transition-all hover:-translate-y-0.5 text-xs font-semibold ${
            currentView === 'quran'
              ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.18)] text-[hsl(var(--primary))] shadow-sm'
              : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]'
          }`}
        >
          <BookOpen size={16} />
          المصحف
        </button>

        <button
          data-testid="button-nav-adhkar"
          onClick={() => setCurrentView('adhkar')}
          className`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border transition-all hover:-translate-y-0.5 text-xs font-semibold ${
            currentView === 'adhkar'
              ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.18)] text-[hsl(var(--primary))] shadow-sm'
              : 'border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]'
          }`}
        >
          <Sparkles size={16} />
          الأذكار
        </button>
      </div>
    </section>

    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.93)] px-4 py-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-center gap-2.5 text-[9px] text-[hsl(var(--muted-foreground))]">
        <Compass size={12} className="text-[hsl(var(--accent))]" />
        <span>قراءة متأنية، آية بعد آية</span>
        <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]" />
        <span>القرآن الكريم · رواية حفص</span>
      </div>
    </footer>

    {drawer === 'bookmarks' && (
      <BookmarkDrawer
        bookmarks={bookmarks}
        onClose={() => setDrawer(null)}
        onGo={(page) => {
          goTo(page);
          setDrawer(null);
        }}
        onRemove={removeBookmark}
      />
    )}

    {drawer === 'surahs' && (
      <SurahDrawer
        currentPage={pageNumber}
        onClose={() => setDrawer(null)}
        onGo={(page) => {
          goTo(page);
          setDrawer(null);
        }}
      />
    )}

    <AnimatePresence>
      {selectedAyah && (
        <TafsirDialog
          ayah={selectedAyah}
          onClose={() => setSelectedAyah(null)}
        />
      )}
    </AnimatePresence>
  </main>;
}
