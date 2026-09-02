import { Gallery, Lightbox, useLightbox } from "../src";

const photos = [
  { src: "https://picsum.photos/id/1015/1600/1000", alt: "River canyon" },
  { src: "https://picsum.photos/id/1018/1600/1000", alt: "Foggy forest" },
  { src: "https://picsum.photos/id/1025/1600/1000", alt: "Dog in the snow" },
  { src: "https://picsum.photos/id/1039/1600/1000", alt: "Forest waterfall" },
  { src: "https://picsum.photos/id/1043/1600/1000", alt: "Mountain path" },
  { src: "https://picsum.photos/id/1069/1600/1000", alt: "Jellyfish" },
];

function ToolbarOpen({ src }: { src: string }) {
  const { open } = useLightbox();
  return (
    <div className="toolbar">
      <button type="button" onClick={() => open(src)}>
        Open from this toolbar
      </button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h1>oLo Lightbox</h1>

      <h2>Click the image</h2>
      <Lightbox>
        <div className="single">
          <Lightbox.Image src={photos[0].src} alt={photos[0].alt} />
        </div>
      </Lightbox>

      <h2>Hover / focus button</h2>
      <Lightbox>
        <div className="single">
          <Lightbox.Image src={photos[1].src} alt={photos[1].alt} trigger="button" />
        </div>
      </Lightbox>

      <h2>Control on another node (render prop)</h2>
      <Lightbox>
        <div className="single">
          <Lightbox.Image src={photos[2].src} alt={photos[2].alt}>
            {({ open }) => (
              <figure>
                <img src={photos[2].src} alt={photos[2].alt} />
                <figcaption>
                  <button type="button" onClick={open}>
                    View larger
                  </button>
                </figcaption>
              </figure>
            )}
          </Lightbox.Image>
        </div>
      </Lightbox>

      <h2>Control from a sibling (useLightbox)</h2>
      <Lightbox>
        <ToolbarOpen src={photos[3].src} />
        <div className="single">
          <Lightbox.Image src={photos[3].src} alt={photos[3].alt}>
            {() => <img src={photos[3].src} alt={photos[3].alt} />}
          </Lightbox.Image>
        </div>
      </Lightbox>

      <h2>Gallery.Grid</h2>
      <Lightbox>
        <Gallery.Grid>
          {photos.map((p) => (
            <Lightbox.Image key={p.src} src={p.src} alt={p.alt} />
          ))}
        </Gallery.Grid>
      </Lightbox>

      <h2>Gallery.Strip</h2>
      <Lightbox>
        <Gallery.Strip>
          {photos.map((p) => (
            <Lightbox.Image key={p.src} src={p.src} alt={p.alt} />
          ))}
        </Gallery.Strip>
      </Lightbox>

      <h2>Gallery.Featured</h2>
      <Lightbox>
        <Gallery.Featured>
          {photos.slice(0, 5).map((p) => (
            <Lightbox.Image key={p.src} src={p.src} alt={p.alt} />
          ))}
        </Gallery.Featured>
      </Lightbox>
    </main>
  );
}
