// If you see a loading/encoding error in the browser console:
// In Unity: Edit > Project Settings > Player > Publishing Settings
// Set Compression Format to "Disabled", rebuild, and replace /public/Build/.
//
// FMOD bank ERR_FORMAT: copy your Unity build's StreamingAssets folder into
// public/StreamingAssets/ (Master.bank, Master.strings.bank, MUSIC.bank, etc.).

import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayPage.css';

const BUILD_BASE = '/Build/web build 2';
const LOADER_SRC = `${BUILD_BASE}.loader.js`;
const CANVAS_ID = 'unity-canvas';

const unityConfig = {
  dataUrl: `${BUILD_BASE}.data.gz`,
  frameworkUrl: `${BUILD_BASE}.framework.js.gz`,
  codeUrl: `${BUILD_BASE}.wasm.gz`,
  companyName: 'Unity',
  productName: 'WebGL Player',
  productVersion: '1.0',
  showBanner: (message, type) => {
    console.error(`[Unity ${type}]`, message);
    return false;
  },
};

function loadUnityLoader() {
  if (window.createUnityInstance) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LOADER_SRC}"]`);
    if (existing) {
      if (window.createUnityInstance) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = LOADER_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function prepareCanvas(canvas) {
  canvas.id = CANVAS_ID;
  canvas.setAttribute('id', CANVAS_ID);
  canvas.tabIndex = 0;
}

function syncModuleCanvasId(instance) {
  const moduleCanvas = instance?.Module?.canvas;
  if (moduleCanvas) {
    moduleCanvas.id = CANVAS_ID;
  }
}

export default function PlayPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.classList.add('play-route');
    document.body.classList.add('play-route');

    let cancelled = false;

    const boot = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      prepareCanvas(canvas);

      try {
        if (window.__mimoUnityInstance) {
          await window.__mimoUnityInstance.Quit().catch(() => {});
          window.__mimoUnityInstance = null;
        }

        await loadUnityLoader();
        if (cancelled) return;

        prepareCanvas(canvas);

        const instance = await window.createUnityInstance(
          canvas,
          unityConfig,
          (progress) => {
            if (cancelled) return;
            setLoadPercent(Math.round(progress * 100));
            if (progress >= 1) {
              setIsLoaded(true);
            }
          },
        );

        if (cancelled) {
          await instance.Quit();
          return;
        }

        syncModuleCanvasId(instance);
        instanceRef.current = instance;
        window.__mimoUnityInstance = instance;
        setIsLoaded(true);
        setLoadPercent(100);
        canvas.focus();
      } catch (error) {
        console.error('[PlayPage] Unity failed to start:', error);
      }
    };

    boot();

    return () => {
      cancelled = true;
      document.documentElement.classList.remove('play-route');
      document.body.classList.remove('play-route');

      const instance = instanceRef.current;
      instanceRef.current = null;
      if (window.__mimoUnityInstance === instance) {
        window.__mimoUnityInstance = null;
      }
      if (instance) {
        instance.Quit().catch(() => {});
      }
    };
  }, []);

  useLayoutEffect(() => {
    const onKeyDown = (event) => {
      if (!instanceRef.current) return;
      if (event.code !== 'Space') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      event.preventDefault();
      if (document.activeElement !== canvas) {
        canvas.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, []);

  const focusCanvas = () => {
    canvasRef.current?.focus();
  };

  return (
    <div className="play-page" onPointerDown={focusCanvas}>
      <button
        type="button"
        className="play-page__back hover-light"
        onClick={() => navigate('/home')}
      >
        ← Back
      </button>

      <div
        className={`play-page__loading${isLoaded ? ' play-page__loading--hidden' : ''}`}
        aria-live="polite"
        aria-hidden={isLoaded}
      >
        <img src="/images/mi_icon.gif" alt="" className="play-page__logo" aria-hidden="true" />
        <p className="play-page__loading-text">Loading MiMo... {loadPercent}%</p>
      </div>

      <canvas ref={canvasRef} id={CANVAS_ID} className="play-page__canvas" />
    </div>
  );
}
