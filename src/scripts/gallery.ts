export function initGallery(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>('dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-photo]')];
  const image = dialog.querySelector<HTMLImageElement>('[data-full-photo]')!;
  const status = dialog.querySelector<HTMLElement>('[data-photo-status]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-close]')!;
  let index = 0;
  let opener: HTMLAnchorElement | undefined;
  let previousOverflow = '';
  function show(nextIndex: number) {
    index = (nextIndex + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt ?? '';
    status.textContent = `Photo ${index + 1} of ${links.length}: ${image.alt}`;
  }
  links.forEach((link, i) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    show(i);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-previous]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]')?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll<HTMLButtonElement>('button')];
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
}
