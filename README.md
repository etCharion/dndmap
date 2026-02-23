# DnD Map App

Jednoduchá aplikace pro promítání DnD map s žetony postav a systémem "Fog of War" (Mlha).

## Jak aplikaci spustit lokálně

1. Nainstalujte závislosti:
   ```bash
   npm install
   ```
2. Spusťte vývojový server:
   ```bash
   npm run dev
   ```
3. Otevřete prohlížeč na adrese, kterou vám Vite ukáže (obvykle `http://localhost:5173`).

## Používání aplikace

- **Herní část**: Hlavní adresa aplikace. Slouží pro hráče (nebo pro zobrazení na TV).
- **Administrace**: Přidejte `#admin` na konec URL (např. `http://localhost:5173/#admin`). Zde můžete vybírat mapy, přidávat postavy a definovat skryté oblasti.

## Struktura souborů pro GitHub

Aplikace automaticky načítá obrázky z následujících složek ve vašem repozitáři:
- `maps/` - Zde nahrajte obrázky map (JPG/PNG/WebP, až 100MB).
- `characters/` - Zde nahrajte obrázky postav (ideálně čtvercové).

## Nasazení na GitHub Pages

Aplikace je připravena pro nasazení na GitHub Pages. Protože používá React, je potřeba ji před nahráním "sestavit" (build):

1. Spusťte příkaz:
   ```bash
   npm run build
   ```
2. Obsah složky `dist/` nahrajte do větve `gh-pages` nebo nastavte GitHub Pages tak, aby se spouštěly z této složky.

**Důležité**: Pokud aplikaci otevíráte přímo ze souborového systému (poklepáním na `index.html`), nebude fungovat kvůli omezením prohlížeče pro moduly a JSX. Vždy použijte `npm run dev` nebo sestavenou verzi v `dist/`.
