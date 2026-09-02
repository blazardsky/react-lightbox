import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Slide = { id: string; src: string; alt: string };

type Ctx = {
  register: (slide: Slide) => () => void;
  open: (idOrIndex: string | number) => void;
  close: () => void;
};

const LightboxCtx = createContext<Ctx | null>(null);

export function useLightbox(): Ctx {
  const ctx = useContext(LightboxCtx);
  if (!ctx) throw new Error("useLightbox must be used inside <Lightbox>");
  return ctx;
}

function wrapIndex(i: number, len: number) {
  return (i + len) % len;
}

function LightboxRoot({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  const register = useCallback((slide: Slide) => {
    setSlides((s) => [...s, slide]);
    return () => setSlides((s) => s.filter((x) => x.id !== slide.id));
  }, []);

  const open = useCallback((idOrIndex: string | number) => {
    const list = slidesRef.current;
    // ponytail: first src match wins if duplicates
    const i =
      typeof idOrIndex === "number"
        ? idOrIndex
        : list.findIndex((s) => s.id === idOrIndex || s.src === idOrIndex);
    if (i >= 0) setOpenIndex(i);
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  const ctx = useMemo(() => ({ register, open, close }), [register, open, close]);

  const current = openIndex !== null ? slides[openIndex] : null;

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (current && !el.open) el.showModal();
    if (!current && el.open) el.close();
  }, [current]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : wrapIndex(i + 1, slidesRef.current.length)));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : wrapIndex(i - 1, slidesRef.current.length)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex]);

  return (
    <LightboxCtx.Provider value={ctx}>
      {children}
      <dialog
        ref={dialogRef}
        className="olo-dialog"
        aria-label={current?.alt || "Image lightbox"}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && (
          <div className="olo-stage">
            <img src={current.src} alt={current.alt} />
            {current.alt ? <p className="olo-caption">{current.alt}</p> : null}
            <button type="button" className="olo-ctrl olo-ctrl--close" aria-label="Close" onClick={close}>
              ×
            </button>
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="olo-ctrl olo-ctrl--prev"
                  aria-label="Previous image"
                  onClick={() => setOpenIndex((i) => wrapIndex((i ?? 0) - 1, slides.length))}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="olo-ctrl olo-ctrl--next"
                  aria-label="Next image"
                  onClick={() => setOpenIndex((i) => wrapIndex((i ?? 0) + 1, slides.length))}
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </LightboxCtx.Provider>
  );
}

function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

type ImageProps = {
  src: string;
  alt: string;
  /** click the image, or a hover/focus button. omit when using a render-prop child or useLightbox(). */
  trigger?: "click" | "button";
  children?: ReactNode | ((opts: { open: () => void }) => ReactNode);
};

function Image({ src, alt, trigger = "click", children }: ImageProps) {
  const id = useId();
  const { register, open } = useLightbox();
  const openThis = useCallback(() => open(id), [open, id]);

  useLayoutEffect(() => register({ id, src, alt }), [register, id, src, alt]);

  if (typeof children === "function") return <>{children({ open: openThis })}</>;

  const preview = children ?? <img src={src} alt={trigger === "click" ? "" : alt} />;
  const label = alt ? `Open ${alt}` : "Open image";

  if (trigger === "button") {
    return (
      <div className="olo-thumb olo-thumb--hover">
        {preview}
        <button type="button" className="olo-thumb__btn" aria-label={label} onClick={openThis}>
          <ExpandIcon />
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="olo-thumb" aria-label={label} onClick={openThis}>
      {preview}
    </button>
  );
}

export const Lightbox = Object.assign(LightboxRoot, { Image });
