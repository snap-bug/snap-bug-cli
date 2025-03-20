import config from "../utils/config.js";

export const trackStateChanges = async (page) => {
  try {
    await page.waitForSelector("#root, #app", { timeout: config.WAIT_TIME });

    const evaluationResult = await page.evaluate(async (apiUrl) => {
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

      const getStateData = (fiber) => {
        const stateData = {};
        let currentState = fiber.memoizedState;
        let index = 0;

        while (currentState) {
          const prevState = currentState.alternate?.memoizedState;
          if (
            isValidState(currentState.memoizedState) &&
            JSON.stringify(currentState.memoizedState) !== JSON.stringify(prevState)
          ) {
            stateData[`state_${index}`] = currentState.memoizedState;
          }
          currentState = currentState.next;
          index++;
        }
        return stateData;
      };

      const traverseFiberTree = (fiberNode) => {
        const newState = {};
        while (fiberNode) {
          if (fiberNode.memoizedState) {
            const componentName = fiberNode.type?.name || "Anonymous";
            const stateData = getStateData(fiberNode);

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

          const domTree = document.documentElement.outerHTML;
          const state = newState;

          try {
            await fetch(`${apiUrl}/states`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                state,
                dom: domTree,
              }),
            });
          } catch (error) {
            console.error("서버로 데이터 전송 실패:", error);
          }
        }
      };

      const fiberRoot = getFiberRoot();
      if (fiberRoot) {
        detectStateChange();

        let fiberNode = fiberRoot.child;
        while (fiberNode) {
          const alternate = fiberNode.alternate;

          if (
            alternate &&
            JSON.stringify(fiberNode.memoizedState) !== JSON.stringify(alternate.memoizedState)
          ) {
            detectStateChange();
          }

          fiberNode = fiberNode.sibling;
        }
      }

      return "Puppeteer evaluate 실행 완료!";
    }, config.API_SERVER_URL);

    console.log("page.evaluate 실행 결과:", evaluationResult);
  } catch (error) {
    console.error("page.evaluate 실행 실패:", error);
  }
};
