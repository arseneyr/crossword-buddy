import classMap from "../class_map";

function prune(source: Node, targetNodes: Node[]) {
  if (targetNodes.includes(source)) {
    return;
  }

  for (let i = source.childNodes.length - 1; i >= 0; i--) {
    if (targetNodes.some(t => source.childNodes[i].contains(t))) {
      prune(source.childNodes[i], targetNodes);
    } else {
      source.childNodes[i].remove();
    }
  }
}

export function getInitialHtml() {
  const clone = document.querySelector("main")!.cloneNode(true) as Element;
  prune(
    clone,
    [classMap.header, classMap.puzzle].map(
      prefix => clone.querySelector(`*[class*=${prefix}]`)!
    )
  );

  [classMap.tools].forEach(prefix =>
    clone.querySelector(`*[class*=${prefix}]`)!.remove()
  );

  clone.querySelector(`*[class*=${classMap.veilContent}]`)!.innerHTML = "";

  return clone.outerHTML;
}

export function getOtherStyles() {
  return Array.prototype.filter
    .call(document.styleSheets, s => s.ownerNode.outerText.length < 1000000)
    .map(s => Array.prototype.map.call(s.cssRules, r => r.cssText))
    .flat()
    .join("\n");
}
