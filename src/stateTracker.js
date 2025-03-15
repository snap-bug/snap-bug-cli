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

  const invalidKeys = [
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
  ];

  for (const key of Object.keys(stateValue)) {
    if (invalidKeys.includes(key)) {
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

