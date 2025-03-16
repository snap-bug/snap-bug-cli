import fs from "fs";
import path from "path";
import util from "./utils/util";

export const getFiberRoot = () => {
  /* eslint-disable no-undef */
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
    const stateValue = currentState.memoizedState;

    if (isValidState(stateValue)) {
      stateData[`state_${index}`] = stateValue;
    }

    currentState = currentState.next;
    index++;
  }

  return stateData;
};

const traverseFiberTree = (fiberNode, newHistory) => {
  while (fiberNode) {
    if (fiberNode.memoizedState) {
      const stateData = getStateData(fiberNode);
      const componentName = fiberNode.type?.name || "Anonymous";
      const timestamp = new Date().toISOString();

      let rootComponent = fiberNode;

      while (rootComponent.return && rootComponent.return.type) {
        rootComponent = rootComponent.return;
      }

      const rootComponentName = rootComponent.type?.name || "no root";

      let pageRecord = newHistory.find((page) => page.rootComponent === rootComponentName);

      if (!pageRecord) {
        pageRecord = { rootComponent: rootComponentName, changedComponents: [] };
        newHistory.push(pageRecord);
      }

      let componentRecord = pageRecord.changedComponents.find(
        (component) => component.name === componentName
      );

      if (!componentRecord) {
        componentRecord = { name: componentName, stateHistory: [] };
        pageRecord.changedComponents.push(componentRecord);
      }

      if (stateData) {
        componentRecord.stateHistory.push({
          timestamp,
          state: stateData,
        });
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

  return newHistory;
};

const STATE_FILE = path.join(process.cwd(), "snapbug-state.json");
const JSON_INDENTATION = 2;

export const saveStateToJson = async () => {
  await util.delay(0);

  const fiberRoot = getFiberRoot();
  if (!fiberRoot) return;

  const newHistory = [];
  traverseFiberTree(fiberRoot.child, newHistory);

  let updatedHistory = [];

  if (fs.existsSync(STATE_FILE)) {
    const existingData = fs.readFileSync(STATE_FILE, "utf-8");
    updatedHistory = existingData ? JSON.parse(existingData) : [];
  }

  newHistory.forEach((newEntry) => {
    let rootEntry = updatedHistory.find((entry) => entry.rootComponent === newEntry.rootComponent);

    if (!rootEntry) {
      rootEntry = { rootComponent: newEntry.rootComponent, changedComponents: [] };
      updatedHistory.push(rootEntry);
    }

    newEntry.changedComponents.forEach((newComponent) => {
      let componentRecord = rootEntry.changedComponents.find(
        (component) => component.name === newComponent.name
      );

      if (!componentRecord) {
        componentRecord = { name: newComponent.name, stateHistory: [] };
        rootEntry.changedComponents.push(componentRecord);
      }

      newComponent.stateHistory.forEach((newState) => {
        const timestampEntry = componentRecord.stateHistory.find(
          (history) => history.timestamp === newState.timestamp
        );

        if (timestampEntry) {
          Object.assign(timestampEntry.state, newState.state);
        } else {
          componentRecord.stateHistory.push(newState);
        }
      });
    });
  });

  fs.writeFileSync(STATE_FILE, JSON.stringify(updatedHistory, null, JSON_INDENTATION));

  return updatedHistory;
};
