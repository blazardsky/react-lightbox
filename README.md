# oLo LIGHTBOX

A simple React image gallery lightbox.

```tsx
import { Lightbox, Gallery, useLightbox } from "olo-lightbox";
import "olo-lightbox/lightbox.css";

<Lightbox>
  <Lightbox.Image src="a.jpg" alt="Canyon" />
  <Lightbox.Image src="b.jpg" alt="Forest" trigger="button" />
  <Lightbox.Image src="c.jpg" alt="Lake">
    {({ open }) => <button onClick={open}>View</button>}
  </Lightbox.Image>

  <Gallery.Grid>
    <Lightbox.Image src="d.jpg" alt="Path" />
  </Gallery.Grid>
</Lightbox>
```

`npm run dev` — playground with all trigger modes and gallery layouts.
