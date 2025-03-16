import { WEBSOCKET_URL } from "../utils/config";

export const trackStateChanges = async (page) => {
  await page.evaluate(() => {
    window.snapbugState = {};

    /* eslint-disable no-unused-vars */
    const getFiberRoot = () => {
      const elements = document.body.children;
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (const key in element) {
          if (key.startsWith("__reactContainer$") || key.startsWith("__reactFiber$")) {
            return element[key].stateNode.current;
          }
        }
      }
      return null;
    };

    const isValidState = (stateValue) => {
      if (typeof stateValue !== "object") return true;

      const invalidKeys = new Set([
        "baseState",
        "baseQueue",
        "deps",
        "destroy",
        "create",
        "_owner",
        "_store",
        "_source",
        "queue",
        "tag",
      ]);

      for (const key of Object.keys(stateValue)) {
        if (invalidKeys.has(key)) {
          return false;
        }
      }

      if (Array.isArray(stateValue)) {
        const filteredArray = stateValue.filter((element) => {
          if (typeof element !== "object") return true;
          if ("rootComponent" in element) return false;
        });

        return filteredArray.length > 0;
      }

      return true;
    };

    /* eslint-disable no-unused-vars */
    const traverseFiberTree = (fiberNode) => {
      const newState = {};
      while (fiberNode) {
        if (fiberNode.memoizedState) {
          const componentName = fiberNode.type?.name || "Anonymous";
          const stateData = fiberNode.memoizedState.memoizedState;

          if (isValidState(stateData)) {
            newState[componentName] = stateData;
          }
        }
        fiberNode = fiberNode.child;
      }
      return newState;
    };

    const detectStateChange = () => {
      const fiberRoot = getFiberRoot();
      if (!fiberRoot) return;

      const newState = traverseFiberTree(fiberRoot.child);
      if (JSON.stringify(window.snapbugState) !== JSON.stringify(newState)) {
        window.snapbugState = newState;
        console.log("⚡ 상태 변경 감지됨:", newState);

        if (window.snapbugSocket && window.snapbugSocket.readyState === 1) {
          window.snapbugSocket.send(JSON.stringify({ event: "state_update", data: newState }));
        }

        fetch(`${WEBSOCKET_URL}/saveState`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: newState }),
        });
      }
    };

    const fiberRoot = getFiberRoot();
    if (fiberRoot) {
      const originalSetState = fiberRoot.memoizedState?.baseState?.setState;
      if (originalSetState) {
        fiberRoot.memoizedState.baseState.setState = (...args) => {
          originalSetState.apply(fiberRoot.memoizedState.baseState, args);
          detectStateChange();
        };
      }
    }

    window.snapbugSocket = new WebSocket(WEBSOCKET_URL);
    window.snapbugSocket.onopen = () => {
      console.log("WebSocket 연결 완료 - React 상태 변경 감지 시작");
    };
  });
};
