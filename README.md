# El Morjene Market

Site e-commerce moderne pour une pâte à tartiner artisanale suisse.

## Structure

- `index.html` - Page principale (point d'entrée)
- `css/styles.css` - Feuille de style complète avec variables CSS et animations
- `js/app.js` - Logique d'application (gestion d'état, interactions)

## Utilisation

Ouvre le fichier `index.html` dans un navigateur moderne (Chrome, Firefox, Safari, Edge).

### Navigateur local

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server

# Puis ouvre http://localhost:8000
```

## Pages

1. **Accueil** - Hero section, carousel de saveurs, section marque
2. **Catalogue** - Grille de produits avec filtres
3. **Détail Produit** - Description complète, nutritionnelle, ajout au panier
4. **Panier** - Récapitulatif des articles, suppression, totaux
5. **Checkout** - Formulaire de commande, ticket PDF, confirmation

## Fonctionnalités

- ✅ Navigation fluide entre pages
- ✅ Gestion du panier (ajout, suppression, calcul totaux)
- ✅ Carrousel de produits avec navigation tactile/souris
- ✅ Filtres de catalogue
- ✅ Formulaire de checkout avec validation
- ✅ Génération PDF de ticket
- ✅ Animations et micro-interactions
- ✅ Design responsive
- ✅ Palette de couleurs chaud (Warm & Round style)

## Produits inclus

- **Classique** - Chocolat & noisette (350g, 700g, 2.5kg)
- **Rocher** - Avec éclats croustillants (200g, 600g, 2.5kg)
- **Rocher Blanc** - Chocolat blanc & noisettes (200g, 600g)

## Personnalisation

### Ajouter une image produit

Dans `js/app.js`, modifier la propriété `image` du produit :

```javascript
image: 'assets/products/classique.png'
```

### Changer les couleurs

Les couleurs sont définies en variables CSS dans `css/styles.css` :

```css
:root {
  --color-primary: #C4571A;
  --color-primary-light: #E07828;
  /* ... */
}
```

## Navigateurs supportés

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- L'app stocke les données en mémoire (panier réinitialisé au rechargement)
- Les formulaires ne sont pas envoyés au serveur (affichage de confirmation locale)
- Les images produits sont des placeholders (à remplacer par les vraies images)
