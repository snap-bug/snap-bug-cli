(function () {
  const API_SERVER_URL = "http://localhost:3001";

  window.snapbugState = {};
  window.snapbugPreviousDomHash = null;

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
    if (stateValue === null) return true;
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
      if (invalidKeys.has(key)) return false;
    }

    if (Array.isArray(stateValue)) {
      for (const element of stateValue) {
        if (element && typeof element === "object" && "rootComponent" in element) {
          return false;
        }
      }
    }

    return true;
  };

  const getStateData = (fiber) => {
    const stateData = {};
    let currentState = fiber.memoizedState;
    let index = 0;

    while (currentState) {
      if (isValidState(currentState.memoizedState)) {
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

      if (fiberNode.child) {
        fiberNode = fiberNode.child;
      } else {
        while (fiberNode && !fiberNode.sibling) {
          fiberNode = fiberNode.return;
        }
        if (fiberNode) {
          fiberNode = fiberNode.sibling;
        }
      }
    }

    return newState;
  };

  const getDOMHash = async (domString) => {
    const HASH_RADIX = 16;
    const HASH_PAD_LENGTH = 2;
    const encoder = new TextEncoder();
    const data = encoder.encode(domString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((byte) => byte.toString(HASH_RADIX).padStart(HASH_PAD_LENGTH, "0"))
      .join("");
  };

  const detectStateChange = async () => {
    const fiberRoot = getFiberRoot();
    if (!fiberRoot) return;

    const newState = traverseFiberTree(fiberRoot.child);

    if (JSON.stringify(window.snapbugState) !== JSON.stringify(newState)) {
      window.snapbugState = newState;
      console.log("상태 변경 감지됨:", newState);

      const root = document.getElementById("root") || document.getElementById("app");
      const domTree = root?.outerHTML || "";

      const currentHash = await getDOMHash(domTree);
      const isDomChanged = currentHash !== window.snapbugPreviousDomHash;

      if (isDomChanged) {
        window.snapbugPreviousDomHash = currentHash;
      }

      try {
        await fetch(`${API_SERVER_URL}/states`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            state: newState,
            dom: isDomChanged ? domTree : null,
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
  }

  const root = document.getElementById("root") || document.getElementById("app");

  if (root) {
    const observer = new MutationObserver(() => {
      detectStateChange();
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }
})();
