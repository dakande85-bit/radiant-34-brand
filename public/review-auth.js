(() => {
  const SESSION_KEY = 'r34CustomerAuthSession';
  const HANDLE_PREFIX = 'r34ReviewHandle:';
  const nativeFetch = window.fetch.bind(window);
  const state = {
    customer: null,
    eligibility: new Map(),
    message: '',
    loadingSession: false,
  };

  const text = (node) => node?.textContent?.trim() ?? '';
  const currentHandleKey = () => `${HANDLE_PREFIX}${window.location.pathname}`;
  const currentProductHandle = () => window.sessionStorage.getItem(currentHandleKey()) ?? '';

  const saveSession = (session) => {
    if (!session?.access_token) return;
    const expiresAt = Number(session.expires_at)
      || Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token || '',
      expires_at: expiresAt,
    }));
  };

  const readSession = () => {
    try {
      return JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  };

  const clearSession = () => {
    window.localStorage.removeItem(SESSION_KEY);
    state.customer = null;
    state.eligibility.clear();
  };

  const captureProductHandle = (input, init) => {
    try {
      const urlValue = typeof input === 'string' ? input : input?.url;
      if (!urlValue) return;
      const url = new URL(urlValue, window.location.origin);
      const method = String(init?.method || (typeof input !== 'string' ? input?.method : '') || 'GET').toUpperCase();
      if (method !== 'GET' || url.pathname !== '/api/reviews') return;
      const handle = url.searchParams.get('product_handle');
      if (!handle) return;
      window.sessionStorage.setItem(currentHandleKey(), handle);
      window.setTimeout(renderAll, 0);
    } catch {
      // Ignore unrelated requests.
    }
  };

  window.fetch = (input, init) => {
    captureProductHandle(input, init);
    return nativeFetch(input, init);
  };

  const installStyles = () => {
    if (document.getElementById('r34-review-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'r34-review-auth-styles';
    style.textContent = `
      .verified-review-gate {
        margin-top: 34px;
        padding-top: 30px;
        border-top: 1px solid rgba(185,133,41,.22);
      }
      .verified-review-gate h4 {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(1.7rem,3vw,2.45rem);
        font-weight: 400;
        line-height: 1;
      }
      .verified-review-gate__intro {
        max-width: 520px;
        margin: 14px 0 22px;
        color: #74654e;
        line-height: 1.65;
      }
      .verified-review-gate__account {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 0 0 20px;
        padding: 15px 17px;
        border: 1px solid rgba(185,133,41,.22);
        border-radius: 8px;
        background: rgba(255,250,240,.56);
      }
      .verified-review-gate__account strong,
      .verified-review-gate__account span { display: block; }
      .verified-review-gate__account span {
        margin-top: 3px;
        color: #74654e;
        font-size: .82rem;
      }
      .verified-review-gate__account button,
      .review-social-button {
        min-height: 44px;
        border-radius: 999px;
        font-size: .72rem;
        font-weight: 900;
        letter-spacing: .08em;
      }
      .verified-review-gate__account button {
        padding: 0 16px;
        border: 1px solid rgba(17,16,13,.22);
        background: transparent;
        color: #11100d;
      }
      .review-social-actions {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 12px;
      }
      .review-social-button {
        padding: 0 20px;
        border: 1px solid rgba(17,16,13,.18);
        background: #fff;
        color: #11100d;
      }
      .review-social-button--facebook {
        background: #1877f2;
        border-color: #1877f2;
        color: #fff;
      }
      .verified-review-form {
        display: grid;
        gap: 12px;
      }
      .verified-review-form__row {
        display: grid;
        grid-template-columns: minmax(130px,.35fr) minmax(0,1fr);
        gap: 12px;
      }
      .verified-review-form select,
      .verified-review-form input,
      .verified-review-form textarea {
        width: 100%;
        border: 1px solid rgba(185,133,41,.28);
        border-radius: 8px;
        background: rgba(255,250,240,.54);
        color: #11100d;
        font: inherit;
      }
      .verified-review-form select,
      .verified-review-form input { min-height: 48px; padding: 0 16px; }
      .verified-review-form textarea { min-height: 126px; padding: 15px 16px; resize: vertical; }
      .verified-review-form button[type='submit'] { width: 100%; }
      .verified-review-message {
        margin: 14px 0 0;
        padding: 13px 15px;
        border: 1px solid rgba(185,133,41,.28);
        border-radius: 8px;
        color: #2b241a;
        line-height: 1.5;
      }
      .verified-review-message--success { background: rgba(185,133,41,.1); }
      @media (max-width:640px) {
        .review-social-actions,
        .verified-review-form__row { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  };

  const processOAuthReturn = () => {
    if (!window.location.hash.includes('access_token=') && !window.location.hash.includes('error_description=')) return;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const error = params.get('error_description');
    if (error) state.message = decodeURIComponent(error.replace(/\+/g, ' '));
    const accessToken = params.get('access_token');
    if (accessToken) {
      saveSession({
        access_token: accessToken,
        refresh_token: params.get('refresh_token') || '',
        expires_at: params.get('expires_at'),
        expires_in: params.get('expires_in'),
      });
      state.message = '';
    }
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };

  const refreshSession = async () => {
    const session = readSession();
    if (!session?.refresh_token) return null;
    const response = await nativeFetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.access_token) return null;
    saveSession(body);
    return readSession();
  };

  const authenticatedFetch = async (url, init = {}) => {
    let session = readSession();
    if (!session?.access_token) throw new Error('Please sign in to continue.');

    let response = await nativeFetch(url, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.status === 401) {
      session = await refreshSession();
      if (!session?.access_token) {
        clearSession();
        throw new Error('Your session expired. Please sign in again.');
      }
      response = await nativeFetch(url, {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    }
    return response;
  };

  const loadCustomer = async () => {
    if (state.loadingSession || state.customer || !readSession()?.access_token) return;
    state.loadingSession = true;
    try {
      const response = await authenticatedFetch('/api/auth/session');
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.customer) throw new Error(body.error || 'Please sign in again.');
      state.customer = body.customer;
      state.message = '';
    } catch (error) {
      clearSession();
      state.message = error instanceof Error ? error.message : 'Please sign in again.';
    } finally {
      state.loadingSession = false;
      renderAll();
    }
  };

  const loadEligibility = async (handle) => {
    if (!state.customer || !handle || state.eligibility.has(handle)) return;
    state.eligibility.set(handle, { loading: true });
    renderAll();
    try {
      const response = await authenticatedFetch(`/api/reviews/eligibility?product_handle=${encodeURIComponent(handle)}`);
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Purchase verification is temporarily unavailable.');
      state.eligibility.set(handle, { loading: false, eligible: Boolean(body.eligible) });
    } catch (error) {
      state.eligibility.set(handle, {
        loading: false,
        eligible: false,
        error: error instanceof Error ? error.message : 'Purchase verification is temporarily unavailable.',
      });
    }
    renderAll();
  };

  const startSocialSignIn = async (provider) => {
    state.message = '';
    renderAll();
    try {
      const response = await nativeFetch('/api/auth/config');
      const config = await response.json().catch(() => ({}));
      if (!response.ok || !config.configured || !config.supabaseUrl) {
        throw new Error('Customer sign-in is being configured. Please try again shortly.');
      }
      const redirectTo = `${window.location.origin}${window.location.pathname}${window.location.search}`;
      const authUrl = `${config.supabaseUrl}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirectTo)}`;
      window.location.assign(authUrl);
    } catch (error) {
      state.message = error instanceof Error ? error.message : 'Unable to start sign-in.';
      renderAll();
    }
  };

  const messageMarkup = (copy, success = false) => copy
    ? `<p class="verified-review-message${success ? ' verified-review-message--success' : ''}">${copy}</p>`
    : '';

  const renderGate = (gate) => {
    const handle = currentProductHandle();

    if (!state.customer) {
      gate.innerHTML = `
        <h4>Sign in to review</h4>
        <p class="verified-review-gate__intro">Only verified customers who purchased this product can leave a review. Your account is created automatically the first time you sign in.</p>
        <div class="review-social-actions">
          <button type="button" class="review-social-button" data-review-provider="google">Continue with Google</button>
          <button type="button" class="review-social-button review-social-button--facebook" data-review-provider="facebook">Continue with Facebook</button>
        </div>
        ${messageMarkup(state.message)}
      `;
      gate.querySelectorAll('[data-review-provider]').forEach((button) => {
        button.addEventListener('click', () => startSocialSignIn(button.dataset.reviewProvider));
      });
      if (readSession()?.access_token) void loadCustomer();
      return;
    }

    const eligibility = handle ? state.eligibility.get(handle) : null;
    gate.innerHTML = `
      <div class="verified-review-gate__account">
        <div><strong>${state.customer.name}</strong><span>${state.customer.email}</span></div>
        <button type="button" data-review-signout>Sign out</button>
      </div>
      ${!handle || eligibility?.loading || !eligibility ? '<p class="verified-review-gate__intro">Checking your purchase history…</p>' : ''}
      ${eligibility?.error ? messageMarkup(eligibility.error) : ''}
      ${eligibility && !eligibility.loading && !eligibility.error && !eligibility.eligible
        ? messageMarkup('Only customers who purchased this product can leave a review.')
        : ''}
    `;

    gate.querySelector('[data-review-signout]')?.addEventListener('click', () => {
      clearSession();
      state.message = '';
      renderAll();
    });

    if (handle && !eligibility) void loadEligibility(handle);
    if (!eligibility?.eligible) return;

    const form = document.createElement('form');
    form.className = 'verified-review-form';
    form.innerHTML = `
      <h4>Write a verified review</h4>
      <p class="verified-review-gate__intro">Your review will show a Verified purchase label after approval.</p>
      <div class="verified-review-form__row">
        <select name="rating" aria-label="Rating">
          <option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option>
        </select>
        <input name="title" placeholder="Review title" maxlength="120">
      </div>
      <textarea name="body" placeholder="Tell other customers about the product, fit and quality" minlength="10" maxlength="2000" required></textarea>
      <button class="btn btn--gold" type="submit">Submit verified review</button>
      <div data-review-submit-message></div>
    `;
    gate.appendChild(form);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const output = form.querySelector('[data-review-submit-message]');
      const data = new FormData(form);
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting…';
      output.innerHTML = '';
      try {
        const response = await authenticatedFetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_handle: handle,
            rating: Number(data.get('rating')),
            title: String(data.get('title') || ''),
            body: String(data.get('body') || ''),
          }),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'Unable to submit your review.');
        form.reset();
        output.innerHTML = messageMarkup('Thank you. Your verified review will appear after approval.', true);
        submitButton.textContent = 'Review submitted';
        submitButton.disabled = true;
      } catch (error) {
        output.innerHTML = messageMarkup(error instanceof Error ? error.message : 'Unable to submit your review.');
        submitButton.textContent = 'Submit verified review';
        submitButton.disabled = false;
      }
    });
  };

  function renderAll() {
    installStyles();
    document.querySelectorAll('.reviews-panel').forEach((panel) => {
      const originalForm = panel.querySelector('form.review-form');
      if (originalForm) originalForm.remove();

      let gate = panel.querySelector('.verified-review-gate');
      if (!gate) {
        gate = document.createElement('section');
        gate.className = 'verified-review-gate';
        panel.appendChild(gate);
      }
      renderGate(gate);
    });
  }

  processOAuthReturn();
  if (readSession()?.access_token) void loadCustomer();

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      renderAll();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queue);
  queue();
})();