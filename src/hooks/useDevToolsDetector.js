import { useEffect, useState } from "react";

const useDevtoolsDetector = () => {
  const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);

  useEffect(() => {
    const enableDetection =
      process.env.NEXT_PUBLIC_FF_ENABLE_DEVTOOLS_DETECTION === "true";

    if (!enableDetection) {
      return;
    }

    const config = {
      pollingIntervalSeconds: 0.25,
      maxMillisBeforeAckWhenClosed: 100,
      moreAnnoyingDebuggerStatements: 1,
      onDetectOpen: () => setIsDevtoolsOpen(true),
      startup: "asap",
      onCheckOpennessWhilePaused: "returnStaleValue",
    };
    Object.seal(config);

    const heart = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `"use strict";
      onmessage = (ev) => { postMessage({isOpenBeat:true});
        debugger; for (let i = 0; i < ev.data.moreDebugs; i++) { debugger; }
        postMessage({isOpenBeat:false});
      };`,
          ],
          { type: "text/javascript" }
        )
      )
    );

    let _isDevtoolsOpen = false;
    let _isDetectorPaused = true;

    let resolveVerdict = undefined;
    let nextPulse$ = NaN;

    const onHeartMsg = (msg) => {
      if (msg.data.isOpenBeat) {
        let p = new Promise((_resolveVerdict) => {
          resolveVerdict = _resolveVerdict;
          let wait$ = setTimeout(() => {
            wait$ = NaN;
            resolveVerdict(true);
          }, config.maxMillisBeforeAckWhenClosed + 1);
        });
        p.then((verdict) => {
          if (verdict === null) return;
          if (verdict !== _isDevtoolsOpen) {
            _isDevtoolsOpen = verdict;
            const cb = {
              true: config.onDetectOpen,
            }[verdict + ""];
            if (cb) cb();
          }
          nextPulse$ = setTimeout(() => {
            nextPulse$ = NaN;
            doOnePulse();
          }, config.pollingIntervalSeconds * 1000);
        });
      } else {
        resolveVerdict(false);
      }
    };

    const doOnePulse = () => {
      heart.postMessage({ moreDebugs: config.moreAnnoyingDebuggerStatements });
    };

    const detector = {
      config,
      get isOpen() {
        if (
          _isDetectorPaused &&
          config.onCheckOpennessWhilePaused === "throw"
        ) {
          throw new Error('`onCheckOpennessWhilePaused` is set to `"throw"`.');
        }
        return _isDevtoolsOpen;
      },
      get paused() {
        return _isDetectorPaused;
      },
      set paused(pause) {
        if (_isDetectorPaused === pause) {
          return;
        }
        _isDetectorPaused = pause;
        if (pause) {
          heart.removeEventListener("message", onHeartMsg);
          clearTimeout(nextPulse$);
          nextPulse$ = NaN;
          resolveVerdict(null);
        } else {
          heart.addEventListener("message", onHeartMsg);
          doOnePulse();
        }
      },
    };
    Object.freeze(detector);
    globalThis.devtoolsDetector = detector;

    switch (config.startup) {
      case "manual":
        break;
      case "asap":
        detector.paused = false;
        break;
      case "domContentLoaded": {
        if (document.readyState !== "loading") {
          detector.paused = false;
        } else {
          document.addEventListener(
            "DOMContentLoaded",
            () => {
              detector.paused = false;
            },
            { once: true }
          );
        }
        break;
      }
    }

    return () => {
      detector.paused = true;
    };
  }, []);

  return isDevtoolsOpen;
};

export default useDevtoolsDetector;
