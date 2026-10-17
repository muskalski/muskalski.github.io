export function initContactForm(form: HTMLFormElement): void {
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[role="status"]')!;
  const endpoint = form.getAttribute('action');
  let sending = false;
  if (!endpoint) {
    submit.disabled = true;
    form.addEventListener('submit', event => event.preventDefault());
    return;
  }
  submit.disabled = false;
  status.textContent = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const submitted = new FormData(form);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', body: submitted, headers: { Accept: 'application/json' }, signal: controller.signal,
      });
      if (!response.ok) throw new Error('Provider rejected submission');
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
        throw new Error('Provider did not confirm submission');
      }
      const current = new FormData(form);
      const unchanged = [...submitted].every(([name, value]) => current.get(name) === value);
      if (unchanged) form.reset();
      status.textContent = unchanged
        ? 'Your message has been sent. Thank you for getting in touch.'
        : 'Your message has been sent. Your newer edits are still here.';
    } catch {
      status.textContent = 'Delivery could not be confirmed. Your message is still here; please try again.';
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
