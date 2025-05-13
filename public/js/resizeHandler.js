export function setupResizeHandler(map) {
    window.addEventListener("resize", () => {
      map.invalidateSize();
    });
  }
  