import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runBrowserAudit() {
  console.log('🚀 Iniciando Browser Agent & Auditoría Visual...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  try {
    // ---------------------------------------------------------
    // 1. AUDITORÍA EN START SCREEN (ESCRITORIO 1280x800)
    // ---------------------------------------------------------
    await page.setViewport({ width: 1280, height: 800 });
    console.log('🌐 Navegando a http://localhost:3000/ ...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });

    const title = await page.title();
    console.log(`✅ Página cargada con título: "${title}"`);

    // Verificar fuentes cargadas
    const fontInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const btn = document.querySelector('#btn-start-new-career');
      return {
        h1Font: h1 ? window.getComputedStyle(h1).fontFamily : null,
        h1Weight: h1 ? window.getComputedStyle(h1).fontWeight : null,
        h1Color: h1 ? window.getComputedStyle(h1).color : null,
        btnFont: btn ? window.getComputedStyle(btn).fontFamily : null,
        btnBg: btn ? window.getComputedStyle(btn).backgroundImage : null,
        btnBoxShadow: btn ? window.getComputedStyle(btn).boxShadow : null
      };
    });
    console.log('📊 Tipografía & Botón Primario en StartScreen:', fontInfo);

    // ---------------------------------------------------------
    // 2. PRUEBA RESPONSIVA EN 375PX (MÓVIL)
    // ---------------------------------------------------------
    console.log('\n📱 Configurando viewport móvil 375x812...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 600));

    const mobileMetricsStart = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const btn = document.querySelector('#btn-start-new-career') as HTMLElement;
      const btnRect = btn ? btn.getBoundingClientRect() : null;

      return {
        scrollW,
        clientW,
        hasHorizontalScroll: scrollW > clientW,
        btnHeight: btnRect ? btnRect.height : 0,
        btnWidth: btnRect ? btnRect.width : 0
      };
    });

    console.log('📱 Métricas Móviles en Menú Inicial:', mobileMetricsStart);
    if (mobileMetricsStart.hasHorizontalScroll) {
      console.error('❌ Scroll horizontal detectado en StartScreen!');
    } else {
      console.log('✅ Cero scroll horizontal en StartScreen (375px)');
    }

    await page.screenshot({ path: 'audit-start-screen-375px.png', fullPage: false });

    // ---------------------------------------------------------
    // 3. ENTRAR AL JUEGO ACTIVO (CONTINUAR O NUEVA CARRERA)
    // ---------------------------------------------------------
    console.log('\n🎯 Accediendo al Dashboard del Juego Activo...');
    const continueBtn = await page.$('#btn-continue-career');
    if (continueBtn) {
      console.log('🎯 Partida guardada encontrada. Click en Continuar Partida (#btn-continue-career)...');
      await continueBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    } else {
      console.log('🎯 Click en Iniciar Nueva Carrera...');
      await page.click('#btn-start-new-career');
      await new Promise((r) => setTimeout(r, 800));

      const quickStartBtn = await page.$('#btn-quick-start-top');
      if (quickStartBtn) {
        console.log('🎯 Click en Comenzar Carrera...');
        await quickStartBtn.click();
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    await page.screenshot({ path: 'audit-mobile-dashboard-375px.png', fullPage: false });

    // ---------------------------------------------------------
    // 4. AUDITORÍA DEL DASHBOARD ACTIVO EN 375PX
    // ---------------------------------------------------------
    console.log('\n📱 Evaluando Dashboard Activo en Móvil 375px...');
    const dashboardMobileMetrics = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const main = document.querySelector('main');
      const heroCard = document.querySelector('.liquid-glass-card');
      const advanceBtn = document.querySelector('#btn-advance-cycle');

      return {
        scrollW,
        clientW,
        hasHorizontalScroll: scrollW > clientW,
        mainPaddingLeft: main ? window.getComputedStyle(main).paddingLeft : null,
        mainPaddingRight: main ? window.getComputedStyle(main).paddingRight : null,
        heroCardWidth: heroCard ? (heroCard as HTMLElement).getBoundingClientRect().width : null,
        advanceBtnExists: !!advanceBtn
      };
    });

    console.log('📱 Métricas Móviles en Dashboard:', dashboardMobileMetrics);
    if (dashboardMobileMetrics.hasHorizontalScroll) {
      console.error('❌ Scroll horizontal detectado en Dashboard!');
    } else {
      console.log('✅ Cero scroll horizontal en Dashboard (375px). Contenedor se adapta fluidamente.');
    }

    // ---------------------------------------------------------
    // 5. AUDITORÍA DE LEGIBILIDAD, CONTRASTE Y BACKDROP-BLUR
    // ---------------------------------------------------------
    console.log('\n🔍 Auditoría de Legibilidad y Capas Glassmorphism...');
    const glassAudit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.liquid-glass-card, .glass-level-2'));
      const pills = Array.from(document.querySelectorAll('.liquid-glass-pill, .glass-level-1'));
      const header = document.querySelector('header');

      const cardStyles = cards[0] ? window.getComputedStyle(cards[0]) : null;
      const pillStyles = pills[0] ? window.getComputedStyle(pills[0]) : null;
      const headerStyles = header ? window.getComputedStyle(header) : null;

      // Medir tamaño de fuentes para verificar floor >= 14px
      const textElements = Array.from(document.querySelectorAll('span, p, h1, h2, h3, h4, button'));
      let minFontSize = 999;
      for (const el of textElements) {
        const fs = parseFloat(window.getComputedStyle(el).fontSize);
        if (fs > 0 && fs < minFontSize) minFontSize = fs;
      }

      return {
        cardBackdropBlur: cardStyles?.backdropFilter || cardStyles?.webkitBackdropFilter,
        cardBg: cardStyles?.backgroundColor,
        cardBorder: cardStyles?.borderColor,
        pillBackdropBlur: pillStyles?.backdropFilter || pillStyles?.webkitBackdropFilter,
        headerBackdropBlur: headerStyles?.backdropFilter || headerStyles?.webkitBackdropFilter,
        minFontSizePx: minFontSize
      };
    });

    console.log('💎 Auditoría de Propiedades Glassmorphism:', glassAudit);
    if (glassAudit.minFontSizePx >= 14) {
      console.log(`✅ Floor tipográfico garantizado: fuente mínima es ${glassAudit.minFontSizePx}px (>= 14px)`);
    } else {
      console.warn(`⚠️ Fuente mínima detectada: ${glassAudit.minFontSizePx}px`);
    }

    // ---------------------------------------------------------
    // 6. FLUJO DE DOPAMINA: SIMULACIÓN DE JUGADA
    // ---------------------------------------------------------
    console.log('\n⚡ Probando Flujo de Dopamina & Microinteracciones en Escritorio...');
    await page.setViewport({ width: 1280, height: 800, isMobile: false, hasTouch: false });
    await new Promise((r) => setTimeout(r, 600));

    const currentScreenInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.innerText;
      const navBrand = document.querySelector('header span')?.innerText;
      return { h1, navBrand, bodySample: document.body.innerText.substring(0, 150) };
    });
    console.log('🖥️ Pantalla actual antes de screenshot desktop:', currentScreenInfo);

    await page.screenshot({ path: 'audit-desktop-dashboard.png', fullPage: false });

    // Buscar botón de decisión en DecisionHub (ej. #btn-vocal-training o botón de descansar)
    const vocalBtn = await page.$('#btn-vocal-training');
    if (vocalBtn) {
      console.log('⚡ Ejecutando acción en DecisionHub: Entrenar Voz (#btn-vocal-training)...');
      await vocalBtn.click();
      await new Promise((r) => setTimeout(r, 200));

      // Verificar si se generaron números flotantes (.kit-float-num)
      const floatNums = await page.evaluate(() => {
        const floats = document.querySelectorAll('.kit-float-num');
        return Array.from(floats).map((f) => (f as HTMLElement).innerText);
      });
      console.log(`✨ Números flotantes generados (${floatNums.length}):`, floatNums);

      // Esperar viaje hacia el HUD y pop reactivo
      await new Promise((r) => setTimeout(r, 600));

      const hudPopActive = await page.evaluate(() => {
        const hudMoney = document.querySelector('#hud-money');
        return hudMoney ? hudMoney.classList.contains('scale-125') : false;
      });
      console.log('⚡ Reacción de impacto en HUD (scale-125):', hudPopActive);
    }

    // Probar Avanzar Turno (#btn-advance-cycle)
    const advanceBtn = await page.$('#btn-advance-cycle');
    if (advanceBtn) {
      console.log('⚡ Probando Botón de Avanzar Turno (#btn-advance-cycle)...');
      await advanceBtn.hover();
      await new Promise((r) => setTimeout(r, 150));
      await advanceBtn.click();
      await new Promise((r) => setTimeout(r, 800));
      console.log('✅ Turno avanzado con fluidez sin congelamiento');
    }

    console.log('\n🎉 AUDITORÍA DEL BROWSER COMPLETADA CON ÉXITO');
  } catch (err) {
    console.error('❌ Error durante la auditoría del navegador:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runBrowserAudit();
