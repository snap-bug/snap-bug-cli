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
