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
  });
};
