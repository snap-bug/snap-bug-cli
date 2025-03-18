import config from "../utils/config.js";

export const trackStateChanges = async (page) => {
  await page.evaluate(
    (wsUrl, apiUrl) => {
      if (!window.snapbugSocket || window.snapbugSocket.readyState !== 1) {
        window.snapbugSocket = new WebSocket(wsUrl);
        window.snapbugSocket.onopen = () => {
          console.log("WebSocket 연결 완료 - React 상태 변경 감지 시작");
        };
      }

      window.snapbugState = {};

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

      const detectStateChange = async () => {
        const fiberRoot = getFiberRoot();
        if (!fiberRoot) return;

        const newState = traverseFiberTree(fiberRoot.child);
        if (JSON.stringify(window.snapbugState) !== JSON.stringify(newState)) {
          window.snapbugState = newState;
          console.log("상태 변경 감지됨:", newState);

          if (window.snapbugSocket && window.snapbugSocket.readyState === 1) {
            window.snapbugSocket.send(JSON.stringify({ event: "state_update", data: newState }));
          }

          try {
            const response = await fetch(`${apiUrl}/saveState`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ state: newState }),
            });

            if (!response.ok) {
              throw new Error(`서버 응답 오류: ${response.status}`);
            }

            console.log("상태 저장 완료");
          } catch (error) {
            console.error("상태 저장 API 오류:", error);
          }
        }
      };

      const fiberRoot = getFiberRoot();
      if (fiberRoot?.memoizedState?.baseState) {
        const { setState } = fiberRoot.memoizedState.baseState;
        if (typeof setState === "function") {
          const originalSetState = setState.bind(fiberRoot.memoizedState.baseState);
          fiberRoot.memoizedState.baseState.setState = (...args) => {
            originalSetState(...args);
            detectStateChange();
          };
        }
      }
    },
    WEBSOCKET_URL,
    API_SERVER_URL
  );
};
