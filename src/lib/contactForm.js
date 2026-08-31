import { submitContact, HCAPTCHA_SITE_KEY } from './supabase.js';

const LEGAL = {
  privacy: {
    title: 'Política de Privacidade',
    updated: 'Última atualização: Fevereiro de 2026',
    html: `
      <p>A iSCOUT (CNPJ 10.538.909/0001-51) trata dados pessoais em conformidade com a
      Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).</p>
      <h3>Dados coletados</h3>
      <p>Ao usar o formulário de contato coletamos: nome, e-mail, telefone, estado, função,
      motivo do contato e mensagem.</p>
      <h3>Finalidade</h3>
      <p>Os dados são usados exclusivamente para retornar seu contato e qualificar reuniões.
      Não vendemos nem compartilhamos informações para fins comerciais de terceiros.</p>
      <h3>Retenção e direitos</h3>
      <p>Dados de contato são excluídos após 180 dias. Solicitações de acesso, correção ou
      exclusão são atendidas em até 15 dias úteis pelo e-mail
      <a href="mailto:contato@iscout.tech">contato@iscout.tech</a>.</p>
      <h3>Segurança</h3>
      <p>Aplicamos criptografia em trânsito, controle de acesso e boas práticas de governança
      como parte da infraestrutura.</p>`,
  },
  terms: {
    title: 'Termos de Serviço',
    updated: 'Última atualização: Fevereiro de 2026',
    html: `
      <p>Estes termos regem o uso do site e dos materiais da iSCOUT.</p>
      <h3>1. Objeto</h3>
      <p>A iSCOUT oferece plataforma de tecnologia para scouting esportivo: organização de
      vídeo, armazenamento otimizado, relatórios técnicos e ferramentas de apoio à decisão.</p>
      <h3>2. Uso</h3>
      <p>O uso é destinado a maiores de 18 anos e a organizações do ecossistema do futebol
      de base. Parcerias e exibição pública de logos dependem de contrato assinado.</p>
      <h3>3. Privacidade</h3>
      <p>O tratamento de dados segue a Política de Privacidade e a LGPD.</p>
      <h3>4. Foro</h3>
      <p>Fica eleito o foro de São Paulo/SP. Contato legal:
      <a href="mailto:contato@iscout.tech">contato@iscout.tech</a>.</p>`,
  },
};

export function initDialogs() {
  const contact = document.getElementById('contact-dialog');
  const legal = document.getElementById('legal-dialog');
  const legalContent = legal.querySelector('[data-legal-content]');

  const openContact = () => { if (!contact.open) contact.showModal(); };
  document.querySelectorAll('[data-open-contact]').forEach((b) => b.addEventListener('click', openContact));
  contact.querySelector('[data-close-contact]').addEventListener('click', () => contact.close());

  document.querySelectorAll('[data-open-legal]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    const doc = LEGAL[b.getAttribute('data-open-legal')];
    if (!doc) return;
    legalContent.innerHTML = `<h2>${doc.title}</h2><p class="legal-updated">${doc.updated}</p>${doc.html}`;
    if (!legal.open) legal.showModal();
  }));
  legal.querySelector('[data-close-legal]').addEventListener('click', () => legal.close());
  [contact, legal].forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  _initForm(contact);
  _initHCaptcha(contact);
}

function _initHCaptcha(contact) {
  if (!HCAPTCHA_SITE_KEY) return;
  const holder = contact.querySelector('#cf-captcha');
  const s = document.createElement('script');
  s.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
  s.async = true; s.defer = true;
  s.onload = () => {
    if (window.hcaptcha && holder) {
      contact._captchaId = window.hcaptcha.render(holder, { sitekey: HCAPTCHA_SITE_KEY });
    }
  };
  document.head.appendChild(s);
}

function _initForm(contact) {
  const form = document.getElementById('contact-form');
  const status = form.querySelector('[data-cf-status]');
  const roleSel = form.querySelector('#cf-role');
  const otherField = form.querySelector('.field--other');

  roleSel.addEventListener('change', () => {
    otherField.hidden = roleSel.value !== 'outro';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'cf-status';
    status.textContent = '';

    // honeypot
    if (form.company && form.company.value) { contact.close(); return; }

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      state: form.state.value.trim(),
      role: form.role.value,
      role_other: form.role.value === 'outro' ? form.role_other.value.trim() : null,
      reason: form.reason.value,
      message: form.message.value.trim(),
      captchaToken: window.hcaptcha && contact._captchaId != null
        ? window.hcaptcha.getResponse(contact._captchaId) : '',
    };

    if (!payload.name || !payload.email || !payload.role || !payload.reason || !payload.message) {
      status.classList.add('is-err');
      status.textContent = 'Preencha os campos obrigatórios.';
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      await submitContact(payload);
      status.classList.add('is-ok');
      status.textContent = 'Obrigado! Retornaremos em breve.';
      form.reset(); otherField.hidden = true;
      if (window.hcaptcha && contact._captchaId != null) window.hcaptcha.reset(contact._captchaId);
    } catch (err) {
      status.classList.add('is-err');
      status.textContent = err.message === 'supabase_not_configured'
        ? 'Formulário indisponível nesta prévia. Fale por contato@iscout.tech.'
        : err.status === 400 || err.status === 403
          ? 'Verifique os dados e o captcha e tente novamente.'
          : 'Não foi possível enviar agora. Tente novamente ou use contato@iscout.tech.';
    } finally {
      btn.disabled = false; btn.textContent = 'Enviar';
    }
  });
}
