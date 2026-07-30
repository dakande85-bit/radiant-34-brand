(() => {
  const SESSION_KEY = 'r34CustomerAuthSession';
  const STYLE_ID = 'r34-customer-account-styles';
  const MODAL_ID = 'r34-account-modal';
  const nativeFetch = window.fetch.bind(window);

  let customer = null;
  let loadingCustomer = false;
  let accountMessage = '';

  const readSession = () => {
    try {
      return JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  };

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

  const clearSession = () => {
    window.localStorage.removeItem(SESSION_KEY);
    customer = null;
    accountMessage = '';
  };

  const processOAuthReturn = () => {
    if (!window.location.hash.includes('access_token=') && !window.location.hash.includes('error_description=')) return;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const error = params.get('error_description');
    if (error) accountMessage = decodeURIComponent(error.replace(/\+/g, ' '));
    const accessToken = params.get('access_token');
    if (accessToken) {
      saveSession({
        access_token: accessToken,
        refresh_token: params.get('refresh_token') || '',
        expires_at: params.get('expires_at'),
        expires_in: params.get('expires_in'),
      });
      accountMessage = '';
    }
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .r34-account-tab {
        appearance:none;
        border:0;
        background:transparent;
        color:inherit;
        cursor:pointer;
        font:inherit;
        font-size:.7rem;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
        white-space:nowrap;
      }
      .r34-account-tab:hover,
      .r34-account-tab:focus-visible { color:#b98529; }
      .r34-account-shell {
        position:fixed;
        inset:0;
        z-index:160;
        display:none;
        align-items:center;
        justify-content:center;
        padding:24px;
      }
      .r34-account-shell[data-open='true'] { display:flex; }
      .r34-account-backdrop {
        position:absolute;
        inset:0;
        border:0;
        background:rgba(17,16,13,.68);
        backdrop-filter:blur(7px);
      }
      .r34-account-dialog {
        position:relative;
        z-index:1;
        width:min(560px,100%);
        max-height:min(760px,calc(100svh - 36px));
        overflow-y:auto;
        padding:clamp(28px,5vw,48px);
        border:1px solid rgba(185,133,41,.28);
        border-radius:12px;
        background:#fffaf0;
        color:#11100d;
        box-shadow:0 34px 90px rgba(17,16,13,.32);
      }
      .r34-account-close {
        position:absolute;
        top:18px;
        right:18px;
        width:42px;
        height:42px;
        border:1px solid rgba(17,16,13,.18);
        border-radius:50%;
        background:transparent;
        color:#11100d;
        cursor:pointer;
        font-size:1.3rem;
      }
      .r34-account-eyebrow {
        margin:0 0 14px;
        color:#b98529;
        font-size:.7rem;
        font-weight:900;
        letter-spacing:.18em;
        text-transform:uppercase;
      }
      .r34-account-dialog h2 {
        max-width:9ch;
        margin:0;
        font-family:Georgia,'Times New Roman',serif;
        font-size:clamp(2.6rem,7vw,4.7rem);
        font-weight:400;
        letter-spacing:-.045em;
        line-height:.95;
      }
      .r34-account-intro {
        max-width:460px;
        margin:20px 0 28px;
        color:#655945;
        line-height:1.7;
      }
      .r34-account-providers {
        display:grid;
        gap:12px;
      }
      .r34-account-provider,
      .r34-account-signout {
        width:100%;
        min-height:54px;
        border:1px solid rgba(17,16,13,.18);
        border-radius:999px;
        cursor:pointer;
        font-size:.72rem;
        font-weight:900;
        letter-spacing:.08em;
      }
      .r34-account-provider { background:#fff; color:#11100d; }
      .r34-account-provider--facebook { background:#1877f2; border-color:#1877f2; color:#fff; }
      .r34-account-provider--tiktok { background:#111; border-color:#111; color:#fff; }
      .r34-account-provider:disabled { cursor:wait; opacity:.58; }
      .r34-account-card {
        margin-top:26px;
        padding:22px;
        border:1px solid rgba(185,133,41,.25);
        border-radius:10px;
        background:#f7efe0;
      }
      .r34-account-card strong,
      .r34-account-card span { display:block; }
      .r34-account-card strong { font-family:Georgia,'Times New Roman',serif; font-size:1.7rem; font-weight:400; }
      .r34-account-card span { margin-top:6px; color:#74654e; }
      .r34-account-signout { margin-top:18px; background:#11100d; color:#fffaf0; }
      .r34-account-message {
        margin:18px 0 0;
        padding:13px 15px;
        border:1px solid rgba(185,133,41,.28);
        border-radius:8px;
        color:#2b241a;
        line-height:1.5;
      }
      .r34-account-note {
        margin:18px 0 0;
        color:#74654e;
        font-size:.78rem;
        line-height:1.55;
      }
      @media (max-width:980px) {
        .main-nav .r34-account-tab {
          width:100%;
          min-height:58px;
          display:flex;
          align-items:center;
          border-bottom:1px solid rgba(185,133,41,.18);
          text-align:left;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const renameMissionLabels = () => {
    document.querySelectorAll('a[href="/mission"], button, .r34-mission-eyebrow').forEach((node) => {
      const copy = node.textContent?.trim();
      if (copy === 'Our Mission' || (node.matches?.('a[href="/mission"]') && copy === 'Mission')) {
        node.textContent = 'Our Missions';
      }
    });
    if (window.location.pathname === '/mission') document.title = 'Our Missions | Radiant 34';
  };

  const accountLabel = () => readSession()?.access_token ? 'My Account' : 'Create Account';

  const updateAccountTabs = () => {
    document.querySelectorAll('[data-r34-account-tab]').forEach((button) => {
      button.textContent = accountLabel();
      button.setAttribute('aria-label', `${accountLabel()} — Google, Facebook or TikTok`);
    });
  };

  const ensureModal = () => {
    let shell = document.getElementById(MODAL_ID);
    if (shell) return shell;

    shell = document.createElement('div');
    shell.id = MODAL_ID;
    shell.className = 'r34-account-shell';
    shell.dataset.open = 'false';
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = `
      <button class="r34-account-backdrop" type="button" aria-label="Close account"></button>
      <section class="r34-account-dialog" role="dialog" aria-modal="true" aria-labelledby="r34-account-title">
        <button class="r34-account-close" type="button" aria-label="Close account">×</button>
        <div data-r34-account-content></div>
      </section>
    `;
    document.body.appendChild(shell);

    shell.querySelector('.r34-account-backdrop')?.addEventListener('click', closeAccount);
    shell.querySelector('.r34-account-close')?.addEventListener('click', closeAccount);
    return shell;
  };

  const closeAccount = () => {
    const shell = document.getElementById(MODAL_ID);
    if (!shell) return;
    shell.dataset.open = 'false';
    shell.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  };

  const loadCustomer = async () => {
    const session = readSession();
    if (!session?.access_token || loadingCustomer) return;
    loadingCustomer = true;
    renderAccount();
    try {
      const response = await nativeFetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.customer) throw new Error(body.error || 'Your session has expired.');
      customer = body.customer;
      accountMessage = '';
    } catch (error) {
      clearSession();
      accountMessage = error instanceof Error ? error.message : 'Please sign in again.';
    } finally {
      loadingCustomer = false;
      updateAccountTabs();
      renderAccount();
    }
  };

  const startSocialSignIn = async (provider) => {
    accountMessage = '';
    const buttons = document.querySelectorAll('.r34-account-provider');
    buttons.forEach((button) => { button.disabled = true; });
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
      accountMessage = error instanceof Error ? error.message : 'Unable to start sign-in.';
      buttons.forEach((button) => { button.disabled = false; });
      renderAccount();
    }
  };

  const renderAccount = () => {
    const shell = ensureModal();
    const content = shell.querySelector('[data-r34-account-content]');
    if (!content) return;

    const session = readSession();
    if (session?.access_token && !customer) {
      content.innerHTML = `
        <p class="r34-account-eyebrow">Customer account</p>
        <h2 id="r34-account-title">Loading your account.</h2>
        <p class="r34-account-intro">Checking your Radiant 34 customer profile…</p>
        ${accountMessage ? `<p class="r34-account-message">${accountMessage}</p>` : ''}
      `;
      if (!loadingCustomer) void loadCustomer();
      return;
    }

    if (customer) {
      content.innerHTML = `
        <p class="r34-account-eyebrow">My account</p>
        <h2 id="r34-account-title">Welcome back.</h2>
        <p class="r34-account-intro">Your account is connected to verified purchases and product reviews.</p>
        <div class="r34-account-card">
          <strong>${customer.name || 'Radiant 34 customer'}</strong>
          <span>${customer.email || ''}</span>
        </div>
        <button class="r34-account-signout" type="button" data-r34-signout>Sign out</button>
      `;
      content.querySelector('[data-r34-signout]')?.addEventListener('click', () => {
        clearSession();
        updateAccountTabs();
        renderAccount();
      });
      return;
    }

    content.innerHTML = `
      <p class="r34-account-eyebrow">Customer account</p>
      <h2 id="r34-account-title">Create your account.</h2>
      <p class="r34-account-intro">Use a social account to register or sign in. Your Radiant 34 account is created automatically on your first login.</p>
      <div class="r34-account-providers">
        <button class="r34-account-provider" type="button" data-r34-provider="google">Continue with Google</button>
        <button class="r34-account-provider r34-account-provider--facebook" type="button" data-r34-provider="facebook">Continue with Facebook</button>
        <button class="r34-account-provider r34-account-provider--tiktok" type="button" data-r34-provider="custom:tiktok">Continue with TikTok</button>
      </div>
      <p class="r34-account-note">By continuing, you create or access your Radiant 34 customer account.</p>
      ${accountMessage ? `<p class="r34-account-message">${accountMessage}</p>` : ''}
    `;
    content.querySelectorAll('[data-r34-provider]').forEach((button) => {
      button.addEventListener('click', () => startSocialSignIn(button.dataset.r34Provider));
    });
  };

  const openAccount = () => {
    const shell = ensureModal();
    shell.dataset.open = 'true';
    shell.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderAccount();
    window.setTimeout(() => shell.querySelector('.r34-account-close')?.focus(), 0);
  };

  const ensureAccountTab = () => {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.querySelector('[data-r34-account-tab]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'r34-account-tab';
    button.dataset.r34AccountTab = 'true';
    button.textContent = accountLabel();
    button.addEventListener('click', openAccount);

    const mobileActions = nav.querySelector('.mobile-nav-actions');
    nav.insertBefore(button, mobileActions || null);
  };

  const apply = () => {
    installStyles();
    renameMissionLabels();
    ensureAccountTab();
    updateAccountTabs();
  };

  processOAuthReturn();
  installStyles();
  ensureModal();

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  };

  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', queue);
  window.addEventListener('popstate', queue);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAccount();
  });
  queue();
})();