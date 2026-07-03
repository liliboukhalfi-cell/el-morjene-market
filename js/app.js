class ElMorjeneApp {
  constructor() {
    this.state = {
      page: 'home',
      previousPage: 'home',
      cart: [],
      selectedSize: '700g',
      justAdded: false,
      slide: 0,
      slideDir: 'right',
      animKey: 0,
      catalogFilter: 'tous',
      checkoutForm: { nom: '', email: '', adresse: '', tel: '', note: '' },
      orderConfirmed: false,
      orderNumber: '',
      selectedProduct: null
    };

    this.catalog = [
      {
        id: 'classique',
        name: 'Classique',
        images: {
          '700g': 'uploads/download.png',
          '350g': 'uploads/creme-noisettes-350g-qqaoc4xyh2idkd9jnou4yf1blnbcookze3grvb5mko_1200x1200_crop_center.webp',
          '2.5kg': 'uploads/classique-2500g.png.png'
        },
        category: 'Chocolat · Noisette',
        tagline: 'La recette originale. Douce, crémeuse, irrésistible.',
        description: "El Morjene Classique, c'est la référence. Un équilibre gourmand entre noisettes et lait crémeux, avec une touche d'arôme de vanille. La pâte qui a tout déclenché.",
        color: '#C4571A',
        badge: 'SANS GLUTEN',
        prices: { '350g': 3.50, '700g': 6.50, '2.5kg': 20.00 },
        currency: 'Fr.',
        storage: 'À conserver dans un endroit frais et sec.',
        ingredients: 'Sucre, graisse végétale, noisette, lait écrémé en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (700g)', value: '3 885 kcal' },
          { label: 'Énergie (100g)', value: '≈ 555 kcal' }
        ]
      },
      {
        id: 'rocher',
        name: 'Rocher',
        images: {
          '200g': 'uploads/design-sans-titre49-1.webp',
          '600g': 'uploads/Pate-a-tartiner-Rocher-–-El-Mordjene-–-600g.webp',
          '2.5kg': 'uploads/pate-a-tartiner-rocher-2.5kg-qqaoczymqlou7i0hmk8tqp7j7d2gqp04iczspfvmvc.jpg'
        },
        category: 'Chocolat · Éclats Croustillants',
        tagline: 'Le croustillant qui fait la différence. Irrésistible.',
        description: "El Morjene Rocher, c'est la rencontre du fondant et du craquant. Des éclats de noisettes enrobés de chocolat dans une base crémeuse — chaque cuillère surprend.",
        color: '#A0522D',
        badge: 'CROUSTILLANT',
        prices: { '200g': 3.50, '600g': 7.00, '2.5kg': 25.50 },
        currency: 'Fr.',
        storage: '',
        ingredients: 'Sucre, graisse végétale, noisettes 15%, cacao maigre 8%, éclats de gaufrette, lait écrémé en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (100g)', value: '≈ 560 kcal' }
        ]
      },
      {
        id: 'rocher-blanc',
        name: 'Rocher Blanc',
        images: {
          '200g': 'uploads/CREME-NOISETTE-200G.jpg',
          '600g': 'uploads/rocher-white-el-mordjene-creme-de-noisette.png'
        },
        category: 'Chocolat Blanc · Éclats',
        tagline: 'La douceur du blanc avec le croustillant du rocher.',
        description: "El Morjene Rocher Blanc, c'est la version lumineuse du rocher. Chocolat blanc fondant, éclats de noisettes caramélisées, texture crémeuse et croustillante à la fois. Une gourmandise douce et addictive.",
        color: '#C08A10',
        badge: 'DOUCEUR',
        prices: { '200g': 3.50, '600g': 7.00 },
        currency: 'Fr.',
        storage: '',
        ingredients: 'Sucre, graisse végétale, noisettes 15%, beurre de cacao, éclats de gaufrette, lait entier en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (100g)', value: '≈ 555 kcal' }
        ]
      }
    ];

    this.init();
  }

  init() {
    this.render();
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.render();
  }

  goProduct(p) {
    const defaultSize = Object.keys(p.prices).sort((a, b) => {
      const parseSize = s => parseFloat(s) * (s.includes('kg') ? 1000 : 1);
      return parseSize(a) - parseSize(b);
    })[0];
    this.setState({ page: 'product', previousPage: this.state.page, selectedSize: defaultSize, justAdded: false, selectedProduct: p });
    window.scrollTo({ top: 0 });
  }

  goSlide(dir) {
    const len = this.catalog.length;
    const slide = dir === 'next' ? (this.state.slide + 1) % len : (this.state.slide - 1 + len) % len;
    this.setState({ slide, slideDir: dir === 'next' ? 'right' : 'left', animKey: this.state.animKey + 1 });
  }

  addToCart(productId, size) {
    const product = this.catalog.find(p => p.id === productId);
    if (!product) return;

    const price = product.prices[size];
    const key = productId + '-' + size;
    const image = product.images ? product.images[size] : null;

    const existing = this.state.cart.find(i => i.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      this.state.cart.push({
        key,
        id: productId,
        name: product.name,
        size,
        price,
        qty: 1,
        color: product.color,
        image
      });
    }

    this.setState({ justAdded: true, cart: [...this.state.cart] });

    clearTimeout(this._addedTimer);
    this._addedTimer = setTimeout(() => {
      this.setState({ page: this.state.previousPage, justAdded: false });
      window.scrollTo({ top: 0 });
    }, 500);
  }

  removeFromCart(key) {
    this.setState({ cart: this.state.cart.filter(i => i.key !== key) });
  }

  updateCheckoutForm(field, value) {
    this.state.checkoutForm[field] = value;
    this.render();
  }

  submitOrder() {
    const f = this.state.checkoutForm;
    const items = this.state.cart;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = items.reduce((s, i) => s + i.qty, 0) * 0.5;
    const total = (subtotal + delivery).toFixed(2);
    const orderNumber = 'EM-' + Date.now().toString().slice(-6);

    const panierDetails = items.map(i => `${i.name} (${i.size}) × ${i.qty} = ${(i.price * i.qty).toFixed(2)} Fr.`).join('\n');

    const form = document.querySelector('form[name="commande-el-morjene"]');
    form.querySelector('input[name="nom"]').value = f.nom;
    form.querySelector('input[name="email"]').value = f.email || '';
    form.querySelector('input[name="tel"]').value = f.tel;
    form.querySelector('input[name="adresse"]').value = f.adresse;
    form.querySelector('textarea[name="note"]').value = f.note;
    form.querySelector('textarea[name="panier"]').value = `Commande #${orderNumber}\n\n${panierDetails}\n\nSous-total: ${subtotal.toFixed(2)} Fr.\nLivraison: ${delivery.toFixed(2)} Fr.`;
    form.querySelector('input[name="total"]').value = total;

    form.submit();
  }

  confirmOrder() {
    this.submitOrder();
    const orderNumber = 'EM-' + Date.now().toString().slice(-6);
    this.setState({ orderConfirmed: true, orderNumber });
  }

  downloadTicket() {
    const f = this.state.checkoutForm;
    const items = this.state.cart;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = items.reduce((s, i) => s + i.qty, 0) * 0.5;
    const total = (subtotal + delivery).toFixed(2);
    const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const rows = items.map(i => `<tr><td>${i.name} (${i.size})</td><td>${i.qty}</td><td>${(i.price * i.qty).toFixed(2)} Fr.</td></tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ticket El Morjene</title>
      <style>body{font-family:Georgia,serif;max-width:400px;margin:40px auto;color:#2C1A0E;padding:20px}
      h1{font-size:24px;text-align:center;border-bottom:2px solid #C4571A;padding-bottom:12px}
      .sub{text-align:center;font-size:12px;color:#888;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#C4571A;color:white;padding:8px;text-align:left;font-size:12px}
      td{padding:8px;border-bottom:1px solid #eee;font-size:13px}
      .total{font-size:18px;font-weight:bold;text-align:right;margin-top:16px;color:#C4571A}
      .info{background:#FDF6EC;padding:12px;border-radius:8px;font-size:13px;margin:16px 0}</style></head>
      <body><h1>El Morjene Market</h1>
      <div class="sub">Ticket de commande — ${date}</div>
      <div class="info"><strong>Client :</strong> ${f.nom}<br><strong>Adresse :</strong> ${f.adresse}<br><strong>Tél :</strong> ${f.tel}${f.note ? `<br><strong>Note :</strong> ${f.note}` : ''}</div>
      <table><tr><th>Produit</th><th>Qté</th><th>Prix</th></tr>${rows}</table>
      <div class="total">Sous-total : ${subtotal.toFixed(2)} Fr.</div>
      <div class="total">Livraison : ${delivery.toFixed(2)} Fr.</div>
      <div class="total" style="font-size:22px;border-top:2px solid #C4571A;padding-top:8px">TOTAL : ${total} Fr.</div></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ticket-el-morjene-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  getCartCount() {
    return this.state.cart.reduce((s, i) => s + i.qty, 0);
  }

  getCartSubtotal() {
    return this.state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  getCartDelivery() {
    return this.getCartCount() * 0.5;
  }

  getCartTotal() {
    return (this.getCartSubtotal() + this.getCartDelivery()).toFixed(2);
  }

  renderHomePage() {
    const slide = this.catalog[this.state.slide];
    const slidePrice = Object.values(slide.prices)[0];
    const anim = this.state.slideDir === 'right' ? `slideInRight${this.state.animKey % 2}` : `slideInLeft${this.state.animKey % 2}`;

    return `
      <!-- NAV -->
      <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
        <div style="cursor:pointer;display:flex;align-items:center;gap:10px;" onclick="app.setState({page:'home'});window.scrollTo({top:0});">
          <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208; letter-spacing: 0.5px">El Morjene<span style="color:#C4571A;">.</span></span>
        </div>
        <div style="display:flex;gap:36px;align-items:center;">
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.5);transition:color 0.2s;" onclick="app.setState({page:'home'});window.scrollTo({top:0});">Accueil</span>
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.5);transition:color 0.2s;" onclick="app.setState({page:'catalog'});window.scrollTo({top:0});">Produits</span>
          <div style="cursor:pointer;display:flex;align-items:center;gap:9px;background:rgba(196,87,26,0.08);border:1.5px solid rgba(196,87,26,0.25);padding:9px 20px;border-radius:100px;transition:all 0.2s;" onclick="app.setState({page:'cart'});window.scrollTo({top:0});">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Panier</span>
            <span style="background:#C4571A;color:#FDF6EC;font-size:11px;font-weight:800;padding:1px 8px;border-radius:100px;min-width:20px;text-align:center;">${this.getCartCount()}</span>
          </div>
        </div>
      </nav>

      <!-- HERO -->
      <section style="min-height:calc(100vh - 66px);display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden;padding:80px 48px 100px;background:linear-gradient(160deg,#FDF6EC 0%,#F8ECD8 100%);">
        <div style="position:absolute;top:10%;right:-5%;width:500px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(196,87,26,0.07) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="position:absolute;bottom:5%;left:-8%;width:420px;height:420px;border-radius:50%;background:radial-gradient(ellipse,rgba(232,164,32,0.07) 0%,transparent 70%);pointer-events:none;"></div>

        <div style="background:rgba(196,87,26,0.1);border:1.5px solid rgba(196,87,26,0.25);color:#C4571A;font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;padding:6px 20px;border-radius:100px;margin-bottom:36px;animation:fadeUp 0.7s ease both;">Pâte à tartiner artisanale</div>

        <div style="text-align:center;animation:fadeUp 0.8s 0.1s ease both;position:relative;">
          <div style="font-family:'Playfair Display';font-size:clamp(64px,12vw,148px);line-height:0.85;font-weight:900;font-style:italic;color:#2C1A0E;letter-spacing:-1px;">El</div>
          <div style="font-family:'Playfair Display';font-size:clamp(64px,12vw,148px);line-height:0.85;font-weight:900;font-style:italic;color:#2C1A0E;letter-spacing:-1px;">Morjene</div>
          <div style="font-family:'Playfair Display';font-size:clamp(28px,4.5vw,52px);font-weight:900;font-style:italic;color:transparent;-webkit-text-stroke:2px #C4571A;letter-spacing:4px;margin-top:8px;transform:rotate(-1.5deg);display:inline-block;">Market</div>
        </div>

        <p style="max-width:400px;text-align:center;font-size:15px;font-weight:500;line-height:1.9;color:rgba(44,26,14,0.55);margin:40px 0;animation:fadeUp 0.8s 0.25s ease both;">
          La pâte à tartiner qui vient de la rue.<br>Pure, intense, faite avec amour.
        </p>

        <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;animation:fadeUp 0.8s 0.4s ease both;">
          <button onclick="app.setState({page:'catalog'});window.scrollTo({top:0});" style="padding:15px 42px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:14px;font-weight:800;letter-spacing:0.5px;border:none;cursor:pointer;border-radius:100px;transition:opacity 0.2s,transform 0.2s;box-shadow:0 8px 24px rgba(196,87,26,0.28);">Explorer les saveurs →</button>
        </div>

        <div style="position:absolute;top:14%;right:7%;animation:float 5s ease-in-out infinite;opacity:0.7;">
          <div style="background:rgba(253,246,236,0.9);border:2px solid rgba(196,87,26,0.35);padding:10px 16px;border-radius:12px;transform:rotate(8deg);box-shadow:0 4px 16px rgba(44,26,14,0.08);">
            <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#C4571A;">100% artisanal</div>
          </div>
        </div>
        <div style="position:absolute;bottom:18%;left:6%;animation:float 6s 1s ease-in-out infinite;opacity:0.6;">
          <div style="background:rgba(253,246,236,0.9);border:2px solid rgba(196,87,26,0.3);padding:8px 14px;border-radius:12px;transform:rotate(-6deg);box-shadow:0 4px 16px rgba(44,26,14,0.08);">
            <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#C4571A;">3 saveurs</div>
          </div>
        </div>
      </section>

      <!-- MARQUEE -->
      <div style="background:linear-gradient(90deg,#C4571A,#B34812);padding:11px 0;overflow:hidden;">
        <div style="display:flex;animation:marquee 22s linear infinite;white-space:nowrap;width:max-content;">
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">El Morjene Original</span>
          <span style="color:rgba(253,246,236,0.4);padding:0 4px;">✦</span>
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">Dark Chocolat</span>
          <span style="color:rgba(253,246,236,0.4);padding:0 4px;">✦</span>
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">White Noisette</span>
          <span style="color:rgba(253,246,236,0.4);padding:0 4px;">✦</span>
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">Crunchy Éclats</span>
          <span style="color:rgba(253,246,236,0.4);padding:0 4px;">✦</span>
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">Gold Édition Limitée</span>
          <span style="color:rgba(253,246,236,0.4);padding:0 4px;">✦</span>
          <span style="font-family:'Nunito';font-size:12px;font-weight:800;letter-spacing:3px;color:#FDF6EC;padding:0 32px;">El Morjene Original</span>
        </div>
      </div>

      <!-- FEATURED CAROUSEL -->
      <section style="padding:72px 0 80px;background:#FDF6EC;">
        <div style="padding:0 48px;display:flex;align-items:baseline;gap:16px;margin-bottom:40px;flex-wrap:wrap;">
          <h2 style="font-family:'Playfair Display';font-size:clamp(30px,4vw,44px);font-weight:900;font-style:italic;color:#2C1A0E;">Nos <span style="color:#C4571A;">saveurs</span></h2>
          <div style="flex:1;height:1.5px;background:linear-gradient(to right,rgba(196,87,26,0.25),transparent);min-width:40px;margin-bottom:6px;"></div>
        </div>

        <div style="padding:0 48px;">
          <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:28px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:280px;box-shadow:0 8px 36px rgba(44,26,14,0.08);animation:${anim} 0.55s cubic-bezier(0.16,1,0.3,1) both;">
            <div style="display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 60%,${slide.color}12 0%,transparent 70%);padding:32px;position:relative;min-height:260px;">
              ${slide.images && slide.images[Object.keys(slide.images)[0]] ? `<div style="height:100%;width:100%;background-image:url(${slide.images[Object.keys(slide.images)[0]]});background-size:contain;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 8px 20px rgba(44,26,14,0.18));"></div>` : '<div style="width:140px;height:140px;border-radius:50%;border:1.5px dashed ' + slide.color + '55;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;letter-spacing:2px;color:' + slide.color + '66;">PHOTO</div>'}
              <div style="position:absolute;top:18px;left:18px;background:${slide.color}18;border:1.5px solid ${slide.color}35;color:${slide.color};font-size:9px;font-weight:800;letter-spacing:1.5px;padding:4px 12px;border-radius:100px;">${slide.badge}</div>
            </div>
            <div style="padding:36px 36px 36px 28px;display:flex;flex-direction:column;justify-content:center;">
              <div style="font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:${slide.color};margin-bottom:8px;">${slide.category}</div>
              <h3 style="font-family:'Playfair Display';font-size:clamp(28px,3.5vw,40px);font-weight:900;font-style:italic;color:#2C1A0E;line-height:1;margin-bottom:14px;">${slide.name}</h3>
              <p style="font-size:13px;font-weight:500;color:rgba(44,26,14,0.55);line-height:1.75;margin-bottom:24px;">${slide.tagline}</p>
              <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                <div>
                  <div style="font-size:9px;font-weight:700;color:rgba(44,26,14,0.35);margin-bottom:2px;">dès</div>
                  <span style="font-family:'Playfair Display';font-size:28px;font-weight:900;color:#C4571A;">${slidePrice} Fr.</span>
                </div>
                <button style="padding:11px 26px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:13px;font-weight:800;border:none;cursor:pointer;border-radius:100px;box-shadow:0 4px 14px rgba(196,87,26,0.28);transition:opacity 0.2s;" onclick="app.goProduct(app.catalog[${this.state.slide}]);">Voir le produit →</button>
              </div>
            </div>
          </div>
        </div>

        <div style="padding:24px 48px 0;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;gap:8px;align-items:center;">
            ${this.catalog.map((_, i) => `<div style="width:8px;height:8px;border-radius:50%;background:${i === this.state.slide ? '#C4571A' : 'rgba(196,87,26,0.2)'};cursor:pointer;transition:all 0.2s;" onclick="app.setState({slide:${i}})"></div>`).join('')}
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <div style="width:38px;height:38px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:100px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;" onclick="app.goSlide('prev');">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div style="width:38px;height:38px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:100px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;" onclick="app.goSlide('next');">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <button style="padding:10px 24px;background:transparent;color:#C4571A;font-family:'Nunito';font-size:13px;font-weight:800;border:1.5px solid rgba(196,87,26,0.35);cursor:pointer;border-radius:100px;transition:all 0.2s;margin-left:6px;" onclick="app.setState({page:'catalog'});window.scrollTo({top:0});">Voir tout →</button>
          </div>
        </div>
      </section>

      <!-- BRAND SECTION -->
      <section style="padding:88px 48px;background:#F8ECD8;border-top:1.5px solid rgba(196,87,26,0.1);">
        <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;">
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#C4571A;margin-bottom:16px;">La marque</div>
            <h2 style="font-family:'Playfair Display';font-size:clamp(30px,4.5vw,48px);font-weight:900;font-style:italic;color:#2C1A0E;line-height:1.1;margin-bottom:22px;">Une pâte,<br><span style="color:transparent;-webkit-text-stroke:1.5px #C4571A;">une culture.</span></h2>
            <p style="font-size:14px;font-weight:500;color:rgba(44,26,14,0.6);line-height:1.9;margin-bottom:28px;">El Morjene, c'est plus qu'une pâte à tartiner. C'est une identité. Née de la rue, faite avec passion, portée par une communauté qui refuse le banal.</p>
            <button onclick="app.setState({page:'catalog'});window.scrollTo({top:0});" style="padding:13px 32px;background:transparent;color:#C4571A;font-family:'Nunito';font-size:13px;font-weight:800;letter-spacing:0.5px;border:1.5px solid rgba(196,87,26,0.4);cursor:pointer;border-radius:100px;transition:all 0.2s;">Voir tout →</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;padding:24px;border-top:3px solid #C4571A;box-shadow:0 4px 16px rgba(44,26,14,0.06);">
              <div style="font-family:'Playfair Display';font-size:36px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:4px;">3</div>
              <div style="font-size:11px;font-weight:700;color:rgba(44,26,14,0.4);">Saveurs disponibles</div>
            </div>
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;padding:24px;border-top:3px solid #E8A020;box-shadow:0 4px 16px rgba(44,26,14,0.06);">
              <div style="font-family:'Playfair Display';font-size:36px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:4px;">3</div>
              <div style="font-size:11px;font-weight:700;color:rgba(44,26,14,0.4);">Formats de pot</div>
            </div>
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;padding:24px;border-top:3px solid #4CA05A;box-shadow:0 4px 16px rgba(44,26,14,0.06);">
              <div style="font-family:'Playfair Display';font-size:36px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:4px;">100%</div>
              <div style="font-size:11px;font-weight:700;color:rgba(44,26,14,0.4);">Artisanal</div>
            </div>
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;padding:24px;border-top:3px solid #9B6BA5;box-shadow:0 4px 16px rgba(44,26,14,0.06);">
              <div style="font-family:'Playfair Display';font-size:36px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:4px;">1</div>
              <div style="font-size:11px;font-weight:700;color:rgba(44,26,14,0.4);">Occasion exclusive</div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer style="background:#F0E2CA;border-top:1.5px solid rgba(196,87,26,0.12);padding:48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <div>
          <div style="font-family:'Playfair Display';font-size:24px;font-weight:900;font-style:italic;margin-bottom:5px;"><span style="color:#2C1A0E;">El Morjene</span><span style="color:#C4571A;">.</span></div>
          <div style="font-size:11px;font-weight:600;color:rgba(44,26,14,0.35);letter-spacing:0.5px;">La pâte de la rue</div>
        </div>
        <div style="display:flex;gap:28px;">
          <span style="cursor:pointer;font-size:12px;font-weight:700;color:rgba(44,26,14,0.35);transition:color 0.2s;">CGV</span>
          <span style="cursor:pointer;font-size:12px;font-weight:700;color:rgba(44,26,14,0.35);transition:color 0.2s;">Mentions légales</span>
          <span style="cursor:pointer;font-size:12px;font-weight:700;color:rgba(44,26,14,0.35);transition:color 0.2s;">Contact</span>
        </div>
        <div style="font-size:11px;font-weight:600;color:rgba(44,26,14,0.25);">© 2025 El Morjene Market</div>
      </footer>
    `;
  }

  renderCatalogPage() {
    const filtered = this.state.catalogFilter === 'tous' ? this.catalog : this.catalog.filter(p => p.id === this.state.catalogFilter);

    return `
      <!-- NAV -->
      <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
        <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
          <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
        </div>
        <div style="display:flex;gap:36px;align-items:center;">
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.5);" onclick="app.setState({page:'home'});">Accueil</span>
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.5);">Produits</span>
          <div style="cursor:pointer;display:flex;align-items:center;gap:9px;background:rgba(196,87,26,0.08);border:1.5px solid rgba(196,87,26,0.25);padding:9px 20px;border-radius:100px;" onclick="app.setState({page:'cart'});">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Panier</span>
            <span style="background:#C4571A;color:#FDF6EC;font-size:11px;font-weight:800;padding:1px 8px;border-radius:100px;min-width:20px;text-align:center;">${this.getCartCount()}</span>
          </div>
        </div>
      </nav>

      <section style="padding:68px 48px;min-height:calc(100vh - 66px);background:linear-gradient(160deg,#FDF6EC 0%,#F8ECD8 100%);">
        <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:32px;flex-wrap:wrap;">
          <h1 style="font-family:'Playfair Display';font-size:clamp(28px,4vw,44px);font-weight:900;font-style:italic;color:#2C1A0E;">Tous les <span style="color:#C4571A;">produits</span></h1>
          <div style="flex:1;height:1.5px;background:linear-gradient(to right,rgba(196,87,26,0.25),transparent);min-width:40px;margin-bottom:6px;"></div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:36px;">
          ${['tous', 'classique', 'rocher', 'rocher-blanc'].map(filter => `
            <button style="padding:9px 22px;background:${this.state.catalogFilter === filter ? 'linear-gradient(135deg,#C4571A,#E07828)' : 'rgba(196,87,26,0.08)'};color:${this.state.catalogFilter === filter ? '#FDF6EC' : '#C4571A'};border:${this.state.catalogFilter === filter ? 'none' : '1.5px solid rgba(196,87,26,0.25)'};font-family:'Nunito';font-size:13px;font-weight:800;cursor:pointer;border-radius:100px;transition:all 0.2s;" onclick="app.setState({catalogFilter:'${filter}'})">
              ${filter === 'tous' ? 'Tous' : this.catalog.find(p => p.id === filter)?.name}
            </button>
          `).join('')}
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:24px;">
          ${filtered.map(prod => `
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:24px;cursor:pointer;overflow:hidden;transition:transform 0.25s,box-shadow 0.25s;" onclick="app.goProduct({...app.catalog.find(p => p.id === '${prod.id}')});">
              <div style="height:165px;display:flex;align-items:center;justify-content:center;position:relative;background:radial-gradient(ellipse at 50% 60%,${prod.color}15 0%,transparent 70%);">
                ${prod.images && prod.images[Object.keys(prod.images)[0]] ? `<div style="height:100%;width:100%;background-image:url(${prod.images[Object.keys(prod.images)[0]]});background-size:72%;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 8px 20px rgba(44,26,14,0.18));"></div>` : ''}
                <div style="position:absolute;top:14px;right:14px;background:${prod.color}18;border:1.5px solid ${prod.color}35;color:${prod.color};font-size:9px;font-weight:800;letter-spacing:1.5px;padding:4px 11px;border-radius:100px;">${prod.badge}</div>
              </div>
              <div style="padding:20px 22px 26px;">
                <div style="font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:${prod.color};margin-bottom:5px;">${prod.category}</div>
                <h3 style="font-family:'Playfair Display';font-size:23px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:6px;">${prod.name}</h3>
                <p style="font-size:12px;font-weight:500;color:rgba(44,26,14,0.5);line-height:1.65;margin-bottom:18px;">${prod.tagline}</p>
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                  <div>
                    <div style="font-size:9px;font-weight:700;color:rgba(44,26,14,0.35);margin-bottom:1px;">À partir de</div>
                    <div style="font-family:'Playfair Display';font-size:24px;font-weight:900;color:#C4571A;">${Object.values(prod.prices)[0]} Fr.</div>
                  </div>
                  <button style="padding:10px 22px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:13px;font-weight:800;border:none;cursor:pointer;border-radius:100px;box-shadow:0 4px 12px rgba(196,87,26,0.25);transition:opacity 0.2s;">Voir →</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- FOOTER -->
      <footer style="background:#F0E2CA;border-top:1.5px solid rgba(196,87,26,0.12);padding:48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <div>
          <div style="font-family:'Playfair Display';font-size:24px;font-weight:900;font-style:italic;margin-bottom:5px;"><span style="color:#2C1A0E;">El Morjene</span><span style="color:#C4571A;">.</span></div>
          <div style="font-size:11px;font-weight:600;color:rgba(44,26,14,0.35);letter-spacing:0.5px;">La pâte de la rue</div>
        </div>
      </footer>
    `;
  }

  renderProductPage() {
    if (!this.state.selectedProduct) return '';
    const prod = this.state.selectedProduct;
    const size = this.state.selectedSize || Object.keys(prod.prices)[0];
    const price = prod.prices[size];
    const isAdded = this.state.justAdded;

    return `
      <!-- NAV -->
      <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
        <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
          <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
        </div>
        <div style="display:flex;gap:36px;align-items:center;">
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.5);" onclick="app.setState({page:'catalog'});">Produits</span>
          <div style="cursor:pointer;display:flex;align-items:center;gap:9px;background:rgba(196,87,26,0.08);border:1.5px solid rgba(196,87,26,0.25);padding:9px 20px;border-radius:100px;" onclick="app.setState({page:'cart'});">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Panier</span>
            <span style="background:#C4571A;color:#FDF6EC;font-size:11px;font-weight:800;padding:1px 8px;border-radius:100px;min-width:20px;text-align:center;">${this.getCartCount()}</span>
          </div>
        </div>
      </nav>

      <section style="padding:52px 48px 88px;min-height:calc(100vh - 66px);background:linear-gradient(160deg,#FDF6EC 0%,#F8ECD8 100%);">
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:44px;font-size:13px;font-weight:700;color:rgba(44,26,14,0.35);">
          <span style="cursor:pointer;color:#C4571A;" onclick="app.setState({page:'catalog'});">Produits</span>
          <span style="opacity:0.4;">/</span>
          <span>${prod.name}</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:72px;max-width:1200px;align-items:start;">
          <div style="position:sticky;top:82px;">
            <div style="aspect-ratio:1;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:28px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(44,26,14,0.08);">
              <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,${prod.color}12 0%,transparent 65%);"></div>
              ${prod.images && prod.images[size] ? `<div style="height:100%;width:100%;background-image:url(${prod.images[size]});background-size:contain;background-repeat:no-repeat;background-position:center;filter:drop-shadow(0 24px 48px rgba(44,26,14,0.22));"></div>` : '<div style="width:220px;height:220px;border-radius:50%;border:2px dashed ' + prod.color + '44;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;letter-spacing:2px;color:' + prod.color + '55;">PHOTO PRODUIT</div>'}
            </div>
            <div style="margin-top:14px;display:flex;align-items:center;gap:10px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${prod.color};flex-shrink:0;"></div>
              <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:${prod.color};text-transform:uppercase;">${prod.category}</span>
            </div>
          </div>

          <div>
            <h1 style="font-family:'Playfair Display';font-size:clamp(46px,6vw,72px);font-weight:900;font-style:italic;line-height:0.9;color:#2C1A0E;margin-bottom:14px;">${prod.name}</h1>
            <p style="font-size:15px;font-weight:500;color:rgba(44,26,14,0.6);line-height:1.9;margin-bottom:36px;">${prod.description}</p>

            <div style="margin-bottom:32px;">
              <div style="font-size:10px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:rgba(44,26,14,0.4);margin-bottom:12px;">Choisir la taille</div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                ${Object.keys(prod.prices).map(sz => `
                  <button style="padding:10px 24px;border:1.5px solid ${size === sz ? prod.color : 'rgba(44,26,14,0.18)'};background:${size === sz ? prod.color + '18' : 'transparent'};color:${size === sz ? '#2C1A0E' : 'rgba(44,26,14,0.5)'};font-family:'Nunito';font-size:14px;font-weight:800;cursor:pointer;border-radius:100px;transition:all 0.2s;" onclick="app.setState({selectedSize:'${sz}'})">
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:28px;">
              <span style="font-family:'Playfair Display';font-size:60px;font-weight:900;font-style:italic;color:#C4571A;line-height:1;">${price} Fr.</span>
              <span style="font-size:13px;font-weight:700;color:rgba(44,26,14,0.35);letter-spacing:1px;text-transform:uppercase;">/ ${size}</span>
            </div>

            <button style="width:100%;padding:18px;background:${isAdded ? 'linear-gradient(135deg,#3A7A48,#4CA05A)' : 'linear-gradient(135deg,#C4571A,#E07828)'};color:#FDF6EC;font-family:'Nunito';font-size:17px;font-weight:900;letter-spacing:0.5px;border:none;cursor:pointer;border-radius:16px;margin-bottom:12px;transition:background 0.35s,opacity 0.2s;box-shadow:${isAdded ? '0 8px 24px rgba(58,122,72,0.3)' : '0 8px 24px rgba(196,87,26,0.28)'};animation:${isAdded ? 'addedStamp 0.4s ease, addedShine 0.8s ease' : 'none'};" onclick="app.addToCart('${prod.id}', '${size}')">
              ${isAdded ? '✓ Ajouté au panier !' : '+ Ajouter au panier'}
            </button>
            <p style="text-align:center;font-size:11px;font-weight:600;color:rgba(44,26,14,0.3);letter-spacing:0.5px;margin-bottom:40px;">Livraison suivie partout en France</p>

            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;overflow:hidden;margin-bottom:16px;box-shadow:0 2px 12px rgba(44,26,14,0.06);">
              <div style="padding:16px 22px;border-bottom:1.5px solid rgba(196,87,26,0.08);background:rgba(196,87,26,0.04);">
                <span style="font-family:'Playfair Display';font-size:14px;font-weight:900;font-style:italic;color:#2C1A0E;">Infos nutritionnelles</span>
                <span style="font-size:10px;font-weight:700;color:rgba(44,26,14,0.35);margin-left:10px;">pour 100g</span>
              </div>
              ${prod.nutrition.map(n => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 22px;border-bottom:1px solid rgba(196,87,26,0.06);">
                  <span style="font-size:12px;font-weight:600;color:rgba(44,26,14,0.5);">${n.label}</span>
                  <span style="font-size:13px;font-weight:800;color:#2C1A0E;font-variant-numeric:tabular-nums;">${n.value}</span>
                </div>
              `).join('')}
            </div>

            <div style="padding:20px 22px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:18px;border-left:3px solid ${prod.color};box-shadow:0 2px 12px rgba(44,26,14,0.06);margin-bottom:12px;">
              <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#2C1A0E;margin-bottom:10px;">Ingrédients</div>
              <p style="font-size:12px;font-weight:500;color:rgba(44,26,14,0.5);line-height:1.85;">${prod.ingredients}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer style="background:#F0E2CA;border-top:1.5px solid rgba(196,87,26,0.12);padding:48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <div>
          <div style="font-family:'Playfair Display';font-size:24px;font-weight:900;font-style:italic;margin-bottom:5px;"><span style="color:#2C1A0E;">El Morjene</span><span style="color:#C4571A;">.</span></div>
        </div>
      </footer>
    `;
  }

  renderCartPage() {
    const items = this.state.cart;
    const isEmpty = items.length === 0;
    const subtotal = this.getCartSubtotal();
    const delivery = this.getCartDelivery();
    const total = this.getCartTotal();

    if (isEmpty) {
      return `
        <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
          <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
            <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
          </div>
        </nav>
        <div style="padding:68px 48px;min-height:calc(100vh - 66px);max-width:960px;margin:0 auto;text-align:center;">
          <div style="font-family:'Playfair Display';font-size:80px;font-weight:900;font-style:italic;color:transparent;-webkit-text-stroke:2px rgba(196,87,26,0.12);margin-bottom:28px;">Vide</div>
          <p style="color:rgba(44,26,14,0.45);font-size:15px;font-weight:500;line-height:1.8;margin-bottom:36px;">Ton panier est vide pour l'instant.<br>Explore nos saveurs et craque pour une.</p>
          <button style="padding:15px 48px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:15px;font-weight:800;border:none;cursor:pointer;border-radius:100px;box-shadow:0 8px 24px rgba(196,87,26,0.28);transition:opacity 0.2s;" onclick="app.setState({page:'catalog'});">Voir les produits</button>
        </div>
      `;
    }

    return `
      <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
        <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
          <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
        </div>
        <div style="display:flex;gap:36px;align-items:center;">
          <div style="cursor:pointer;display:flex;align-items:center;gap:9px;background:rgba(196,87,26,0.08);border:1.5px solid rgba(196,87,26,0.25);padding:9px 20px;border-radius:100px;" onclick="app.setState({page:'cart'});">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4571A" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Panier</span>
            <span style="background:#C4571A;color:#FDF6EC;font-size:11px;font-weight:800;padding:1px 8px;border-radius:100px;min-width:20px;text-align:center;">${items.length}</span>
          </div>
        </div>
      </nav>
      <section style="padding:68px 48px;min-height:calc(100vh - 66px);max-width:960px;margin:0 auto;background:transparent;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:48px;flex-wrap:wrap;">
          <h1 style="font-family:'Playfair Display';font-size:clamp(34px,5vw,52px);font-weight:900;font-style:italic;color:#2C1A0E;">Mon <span style="color:#C4571A;">panier</span></h1>
          <div style="background:rgba(196,87,26,0.1);border:1.5px solid rgba(196,87,26,0.25);color:#C4571A;font-size:12px;font-weight:800;padding:4px 14px;border-radius:100px;">${items.length} article(s)</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">
          ${items.map(item => `
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:20px;padding:20px 24px;display:flex;align-items:center;gap:18px;border-left:3px solid ${item.color};box-shadow:0 2px 12px rgba(44,26,14,0.05);">
              <div style="width:64px;height:64px;flex-shrink:0;position:relative;border-radius:12px;overflow:hidden;background:rgba(196,87,26,0.05);">
                ${item.image ? `<div style="height:100%;width:100%;background-image:url(${item.image});background-size:contain;background-repeat:no-repeat;background-position:center;"></div>` : ''}
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-family:'Playfair Display';font-size:18px;font-weight:900;font-style:italic;color:#2C1A0E;">${item.name}</div>
                <div style="font-size:11px;font-weight:700;color:rgba(44,26,14,0.4);letter-spacing:1px;text-transform:uppercase;margin-top:3px;">${item.size} — ${item.qty} unité(s)</div>
              </div>
              <div style="font-family:'Playfair Display';font-size:22px;font-weight:900;color:#C4571A;flex-shrink:0;">${(item.price * item.qty).toFixed(2)} Fr.</div>
              <div style="cursor:pointer;width:34px;height:34px;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;background:none;padding:0;color:currentColor;" onclick="app.removeFromCart('${item.key}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:24px;padding:32px 36px;box-shadow:0 4px 24px rgba(44,26,14,0.07);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid rgba(196,87,26,0.08);padding-bottom:16px;margin-bottom:16px;">
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Sous-total</span>
            <span style="font-family:'Playfair Display';font-size:18px;font-weight:900;font-style:italic;color:#2C1A0E;">${subtotal.toFixed(2)} Fr.</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
            <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Livraison <span style="font-size:11px;font-weight:500;color:rgba(44,26,14,0.5);">(0.50 Fr. × ${items.length} pot(s))</span></span>
            <span style="font-size:14px;font-weight:800;color:#2C1A0E;">${delivery.toFixed(2)} Fr.</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1.5px solid rgba(196,87,26,0.08);padding-top:20px;margin-bottom:28px;">
            <span style="font-size:14px;font-weight:800;color:#2C1A0E;">Total</span>
            <span style="font-family:'Playfair Display';font-size:48px;font-weight:900;font-style:italic;color:#C4571A;line-height:1;">${total} Fr.</span>
          </div>
          <button style="width:100%;padding:18px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:17px;font-weight:900;border:none;cursor:pointer;border-radius:14px;margin-bottom:12px;box-shadow:0 8px 24px rgba(196,87,26,0.28);transition:opacity 0.2s;" onclick="app.setState({page:'checkout'});">Commander maintenant →</button>
          <div style="text-align:center;font-size:11px;font-weight:600;color:rgba(44,26,14,0.3);">Livraison + récapitulatif à l'étape suivante</div>
        </div>

        <div style="text-align:center;margin-top:20px;">
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:rgba(44,26,14,0.4);text-decoration:underline;text-underline-offset:4px;transition:color 0.2s;" onclick="app.setState({page:'catalog'});">← Continuer mes achats</span>
        </div>
      </section>
    `;
  }

  renderCheckoutPage() {
    const items = this.state.cart;
    const subtotal = this.getCartSubtotal();
    const delivery = this.getCartDelivery();
    const total = this.getCartTotal();
    const form = this.state.checkoutForm;
    const canConfirm = !!(form.nom && form.adresse && form.tel);

    if (this.state.orderConfirmed) {
      return `
        <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;">
          <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
            <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
          </div>
        </nav>
        <div style="padding:52px 48px 88px;min-height:calc(100vh - 66px);background:linear-gradient(160deg,#FDF6EC 0%,#F8ECD8 100%);">
          <div style="max-width:560px;margin:60px auto;text-align:center;animation:fadeUp 0.6s ease both;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#3A7A48,#4CA05A);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FDF6EC" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h1 style="font-family:'Playfair Display';font-size:42px;font-weight:900;font-style:italic;color:#2C1A0E;margin-bottom:10px;">Commande confirmée !</h1>
            <p style="font-size:14px;font-weight:500;color:rgba(44,26,14,0.55);margin-bottom:8px;">Numéro de commande : <strong style="color:#C4571A;">${this.state.orderNumber}</strong></p>
            <p style="font-size:14px;font-weight:500;color:rgba(44,26,14,0.55);margin-bottom:36px;">Nous vous contacterons sur WhatsApp pour finaliser la livraison.</p>
            <button style="padding:14px 32px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;font-family:'Nunito';font-size:14px;font-weight:800;border:none;cursor:pointer;border-radius:100px;box-shadow:0 6px 20px rgba(196,87,26,0.25);transition:opacity 0.2s;" onclick="app.setState({page:'home',cart:[],orderConfirmed:false,orderNumber:'',checkoutForm:{nom:'',email:'',adresse:'',tel:'',note:''}});">Retour à l'accueil</button>
          </div>
        </div>
      `;
    }

    return `
      <nav style="position:sticky;top:0;z-index:200;background:rgba(253,246,236,0.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,87,26,0.12);padding:0 48px;height:66px;display:flex;align-items:center;justify-content:space-between;">
        <div style="cursor:pointer;" onclick="app.setState({page:'home'});">
          <span style="font-family: 'Playfair Display'; font-size: 25px; font-weight: 800; font-style: italic; color: #201208;">El Morjene<span style="color:#C4571A;">.</span></span>
        </div>
      </nav>
      <section style="padding:52px 48px 88px;min-height:calc(100vh - 66px);background:linear-gradient(160deg,#FDF6EC 0%,#F8ECD8 100%);">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:44px;flex-wrap:wrap;">
          <span style="cursor:pointer;font-size:13px;font-weight:700;color:#C4571A;" onclick="app.setState({page:'cart'});">← Panier</span>
          <h1 style="font-family:'Playfair Display';font-size:clamp(26px,4vw,40px);font-weight:900;font-style:italic;color:#2C1A0E;">Confirmer ma <span style="color:#C4571A;">commande</span></h1>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:1100px;align-items:start;">
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#C4571A;margin-bottom:20px;">Vos informations</div>
            <div style="display:flex;flex-direction:column;gap:16px;">
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:rgba(44,26,14,0.6);margin-bottom:6px;letter-spacing:0.5px;">Nom & Prénom *</label>
                <input type="text" placeholder="Ex: Karim Benali" value="${form.nom}" onchange="app.updateCheckoutForm('nom', this.value)" style="width:100%;padding:13px 16px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:12px;font-family:'Nunito';font-size:14px;font-weight:600;color:#2C1A0E;outline:none;">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:rgba(44,26,14,0.6);margin-bottom:6px;letter-spacing:0.5px;">Email</label>
                <input type="email" placeholder="Ex: karim@example.com" value="${form.email}" onchange="app.updateCheckoutForm('email', this.value)" style="width:100%;padding:13px 16px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:12px;font-family:'Nunito';font-size:14px;font-weight:600;color:#2C1A0E;outline:none;">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:rgba(44,26,14,0.6);margin-bottom:6px;letter-spacing:0.5px;">Adresse de livraison *</label>
                <textarea placeholder="Rue, ville, code postal..." onchange="app.updateCheckoutForm('adresse', this.value)" style="width:100%;padding:13px 16px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:12px;font-family:'Nunito';font-size:14px;font-weight:600;color:#2C1A0E;outline:none;resize:vertical;min-height:88px;">${form.adresse}</textarea>
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:rgba(44,26,14,0.6);margin-bottom:6px;letter-spacing:0.5px;">Numéro WhatsApp *</label>
                <input type="tel" placeholder="Ex: +41 79 123 45 67" value="${form.tel}" onchange="app.updateCheckoutForm('tel', this.value)" style="width:100%;padding:13px 16px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:12px;font-family:'Nunito';font-size:14px;font-weight:600;color:#2C1A0E;outline:none;">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:700;color:rgba(44,26,14,0.6);margin-bottom:6px;letter-spacing:0.5px;">Note / Commentaire</label>
                <textarea placeholder="Instructions spéciales, horaires de livraison..." onchange="app.updateCheckoutForm('note', this.value)" style="width:100%;padding:13px 16px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:12px;font-family:'Nunito';font-size:14px;font-weight:600;color:#2C1A0E;outline:none;resize:vertical;min-height:72px;">${form.note}</textarea>
              </div>
            </div>
          </div>

          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#C4571A;margin-bottom:20px;">Récapitulatif</div>
            <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(44,26,14,0.07);">
              <div style="padding:8px 0;border-bottom:1.5px solid rgba(196,87,26,0.08);">
                ${items.map(item => `
                  <div style="display:flex;align-items:center;gap:12px;padding:12px 22px;">
                    <div style="width:52px;height:52px;border-radius:10px;background:${item.color}10;border:1px solid ${item.color}20;flex-shrink:0;overflow:hidden;position:relative;">
                      ${item.image ? `<div style="height:100%;width:100%;background-image:url(${item.image});background-size:contain;background-repeat:no-repeat;background-position:center;"></div>` : ''}
                    </div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:13px;font-weight:700;color:#2C1A0E;">${item.name}</div>
                      <div style="font-size:11px;font-weight:600;color:rgba(44,26,14,0.4);">${item.size} × ${item.qty}</div>
                    </div>
                    <div style="font-family:'Playfair Display';font-size:15px;font-weight:900;color:#C4571A;white-space:nowrap;">${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>
              <div style="padding:16px 22px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                  <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Sous-total</span>
                  <span style="font-size:13px;font-weight:700;color:#2C1A0E;">${subtotal.toFixed(2)} Fr.</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding-bottom:14px;border-bottom:1.5px solid rgba(196,87,26,0.08);margin-bottom:14px;">
                  <span style="font-size:13px;font-weight:700;color:#2C1A0E;">Livraison <span style="font-size:11px;font-weight:500;color:rgba(44,26,14,0.4);">(${items.length} pot(s) × 0.50 Fr.)</span></span>
                  <span style="font-size:13px;font-weight:700;color:#2C1A0E;">${delivery.toFixed(2)} Fr.</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <span style="font-size:15px;font-weight:800;color:#2C1A0E;">Total</span>
                  <span style="font-family:'Playfair Display';font-size:32px;font-weight:900;font-style:italic;color:#C4571A;">${total} Fr.</span>
                </div>
              </div>

              <div style="padding:0 22px 22px;display:flex;flex-direction:column;gap:10px;">
                <button style="width:100%;padding:14px;background:rgba(196,87,26,0.08);color:#C4571A;font-family:'Nunito';font-size:14px;font-weight:800;border:1.5px solid rgba(196,87,26,0.25);cursor:pointer;border-radius:12px;transition:all 0.2s;" onclick="app.downloadTicket();">🧾 Télécharger le ticket</button>
                <button style="width:100%;padding:14px;background:${canConfirm ? 'linear-gradient(135deg,#C4571A,#E07828)' : 'rgba(44,26,14,0.1)'};color:${canConfirm ? '#FDF6EC' : 'rgba(44,26,14,0.3)'};font-family:'Nunito';font-size:15px;font-weight:900;border:none;cursor:${canConfirm ? 'pointer' : 'not-allowed'};border-radius:12px;box-shadow:${canConfirm ? '0 6px 20px rgba(196,87,26,0.25)' : 'none'};transition:all 0.2s;" ${canConfirm ? 'onclick="app.confirmOrder();"' : 'disabled'}>Confirmer la commande →</button>
                <div style="text-align:center;font-size:11px;font-weight:600;color:rgba(44,26,14,0.3);">Nous vous contacterons sur WhatsApp pour la livraison</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  render() {
    const app = document.getElementById('app');
    let content = '';

    switch (this.state.page) {
      case 'home':
        content = this.renderHomePage();
        break;
      case 'catalog':
        content = this.renderCatalogPage();
        break;
      case 'product':
        content = this.renderProductPage();
        break;
      case 'cart':
        content = this.renderCartPage();
        break;
      case 'checkout':
        content = this.renderCheckoutPage();
        break;
      default:
        content = this.renderHomePage();
    }

    app.innerHTML = content;
  }
}

const app = new ElMorjeneApp();
