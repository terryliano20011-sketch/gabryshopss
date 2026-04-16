# GabryShopss — Contesto progetto per Claude

## Cos'è questo progetto
E-commerce italiano multi-categoria per la vendita di prodotti fisici e digitali. Sviluppato da zero con Next.js, React e TypeScript. Pubblicato gratuitamente su Vercel.

**URL live:** https://gabryshopss.vercel.app
**Repository:** https://github.com/terryliano20011-sketch/gabryshopss
**Dev locale:** http://localhost:3000 (avviare con `npm run dev` nella cartella `~/Desktop/gabryshopss`)

## Proprietario
- **Nome:** Gabriel Mancaruso
- **Email:** terryliano20011@gmail.com
- **GitHub:** terryliano20011-sketch
- **Mac username:** gabrielmancaruso
- **WhatsApp:** +39 351 843 5322

## Stack tecnologico
- Next.js 16 (App Router)
- React 19 + TypeScript
- Stili inline + isMobile hook per responsive
- Supabase (database + auth + storage)
- PayPal (pagamenti live in EUR)
- Resend (email automatiche ordini)
- Vercel (hosting + deploy automatico)
- Google Analytics G-KE97EKDGK3

## Struttura cartelle
```
app/
  page.tsx                    ← Homepage con categorie (dark premium)
  layout.tsx                  ← Layout globale + Google Analytics
  globals.css                 ← CSS base dark theme
  not-found.tsx               ← Pagina 404 personalizzata
  admin/page.tsx              ← Pannello admin (pass: gabry2007!)
  auth/page.tsx               ← Login/Registrazione
  ordini/page.tsx             ← Storico ordini utente
  chi-siamo/page.tsx
  contatti/page.tsx
  privacy/page.tsx
  termini/page.tsx
  faq/page.tsx
  categoria/[slug]/page.tsx   ← Pagina prodotti per categoria
  api/ordine/route.ts         ← API email ordine con Resend
lib/
  supabase.ts                 ← Client Supabase
public/
  images/                     ← Foto prodotti
  icons/                      ← Icone PWA
  manifest.json               ← PWA manifest
```

## Credenziali importanti
- **PayPal Client ID Live:** `Aaw-5XjE4JVOxAo86vZE7hUP5IpaAXmGxBf-8VflGfr9KjtF21hsJ7SViQkaV5FKDEPmXvWrW2D608CS`
- **Resend API Key:** `re_GciUTmUa_LgDG6ofVfzc8b9JDgGjKgeHC`
- **Supabase URL:** `https://xaxlhxyltpepvvptvrzy.supabase.co`
- **Supabase Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheGxoeHlsdHBlcHZ2cHR2cnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDM0NTQsImV4cCI6MjA5MTc3OTQ1NH0.7wDWn7dyOLUDMBD_3-weeuQ2vjYK7GSG9KkVuElTilk`
- **Admin password:** `gabry2007!`

## Database Supabase — Tabelle

### products
```sql
id, name, short_desc, long_desc, price, type (fisico/digitale),
image, images (array), active, categoria, taglie (array), created_at
```

### categorie
```sql
id, nome, slug, descrizione, emoji, cover, active
```
Categorie: auto, vestiti, gioielli, elettronica

### orders
```sql
id, user_id, items (jsonb), shipping (jsonb), total, status, created_at
```

### reviews
```sql
id, product_id, user_id, nome, stelle (1-5), testo, created_at
```

## Prodotti attuali
**Auto:**
- Panno Microfibra Auto 500GSM — €7.00
- Pellicola Oscurante 90% 50x300cm — €49.99
- Kit Professionale Wrapping 14pz — €7.99

**Vestiti:**
- Felpa con Cappuccio Fur Collar Slim Fit — €35.00
- Felpa Corta Fur Collar con Logo — €40.00
- Cappello Trucker con Ricamo Stelle Y2K — €13.99

**Gioielli:**
- Orecchini a Perno con Zirconia Set Punk Glamour — €9.99

**Elettronica:**
- Auricolari Bluetooth 5.4 HiFi 30 Ore LED — €30.00

## Come fare il deploy
```bash
cd ~/Desktop/gabryshopss
git add .
git commit -m "descrizione"
git push
```
Se il push fallisce con "Authentication failed" → generare nuovo token su github.com/settings/tokens (spuntare `repo`, No expiration) e aggiornare:
```bash
git remote set-url origin https://terryliano20011-sketch:TOKEN@github.com/terryliano20011-sketch/gabryshopss.git
```

## Come aggiungere prodotti
Vai su **gabryshopss.vercel.app/admin** (pass: gabry2007!) oppure via SQL su Supabase:
```sql
INSERT INTO products (name, short_desc, long_desc, price, type, image, images, active, categoria, taglie) VALUES
('Nome', 'Breve', 'Lunga', 9.99, 'fisico', '/images/foto.jpg', ARRAY['/images/foto.jpg'], true, 'vestiti', ARRAY['S','M','L','XL']);
```
Le foto vanno in `public/images/` e pushate su GitHub.

## Design
- **Tema:** Dark premium con accenti dorati (#C9A84C)
- **Font:** DM Sans (body) + Playfair Display (titoli)
- **Responsive:** Hook `isMobile` (window.innerWidth < 768)

## Coupon sconto attivi
- `GABRY10` → -10%
- `WELCOME` → -15%

## Spedizione
- Prodotti fisici: €4.99 (gratis sopra €50)
- Prodotti digitali: gratis

## Funzionalità complete ✅
- Homepage con 4 categorie
- Pagina prodotti per categoria con filtri
- Pagina dettaglio prodotto (zoom foto, galleria, recensioni, prodotti correlati)
- Carrello con quantità, coupon sconto, spedizione
- Selezione taglia per abbigliamento/gioielli
- Pagamenti PayPal live
- Email automatica a admin + cliente (Resend)
- Registrazione/Login utenti (Supabase Auth)
- Storico ordini per utenti registrati
- Pannello admin per gestire prodotti
- Google Analytics
- SEO ottimizzato
- PWA (installabile su telefono)
- WhatsApp button (+39 351 843 5322)
- Banner promo con codice sconto
- Badge prodotti (Bestseller, Top qualità, Novità)
- Animazioni fadeUp e hover
- Recensioni prodotti con stelle
- Navbar responsive mobile
- Pagine: Chi siamo, Contattaci, FAQ, Privacy, Termini

## Da fare ancora 🔲
- Pagina 404 personalizzata (file creato: not-found.tsx da copiare in app/)
- Ricerca prodotti nella navbar
- Upload foto dall'admin senza terminale
- Notifica WhatsApp nuovo ordine
- Statistiche ordini nell'admin
- Tracciamento spedizioni
- Fix verifica email (auth_fixed.tsx già deployato)

## Note importanti
- Le foto sono in `public/images/` e servite da Vercel
- Supabase Storage bucket `prodotti` esiste ma non viene usato (usare /images/)
- Il token GitHub scade spesso → rigenerare se il push fallisce
- Il sito rimane online anche con il Mac spento (gira su Vercel)
- Tailwind installato ma NON usato — tutti gli stili sono inline
