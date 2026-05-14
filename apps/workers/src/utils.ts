export function parse(
  text: string,
  values: any,
  startBracket = "{",
  endBracket = "}",
): string {
  if (!text || typeof text !== "string") {
    throw new TypeError(" this is an empty string ");
  }
  if (values === null || values === undefined) {
    throw new TypeError("you got a null object");
  }

  let start = 0;
  let end = 1;
  let finalStr = "";

  while (end <= text.length) {
    if (text[start] === startBracket) {
      let endPoint = start + 1;
      while (endPoint < text.length && text[endPoint] !== endBracket) {
        endPoint++;
      }

      if (endPoint >= text.length) {
        throw new SyntaxError(
          `unclosed bracket '${startBracket}' at position ${start}`,
        );
      }

      const stringValue = text.slice(start + 1, endPoint);
      if (!stringValue.trim()) {
        throw new SyntaxError(`empty key at position ${start}`);
      }

      const keys = stringValue.split(".");
      let localValues: any = { ...values };

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (typeof localValues === "string") {
          try {
            localValues = JSON.parse(localValues);
          } catch {
            throw new SyntaxError(
              `parsing failed for = '${key}' in path '${stringValue}'`,
            );
          }
        }

        if (localValues === null || localValues === undefined) {
          throw new ReferenceError(
            `cant read key '${key}' from ${localValues} at path '${keys.slice(0, i).join(".")}'`,
          );
        }

        if (typeof localValues !== "object") {
          throw new TypeError(
            `no object path '${keys.slice(0, i).join(".")}', got ${typeof localValues}`,
          );
        }

        if (!(key in localValues)) {
          throw new ReferenceError(
            `key '${key}' not found in path '${stringValue}'`,
          );
        }

        localValues = localValues[key];
      }

      finalStr += localValues ?? "";
      start = endPoint + 1;
      end = endPoint + 2;
    } else {
      finalStr += text[start];
      start++;
      end++;
    }
  }

  return finalStr;
}
