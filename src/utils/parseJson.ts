export function tryParseJSON<T=any>(jsonString: string){
  try {
      const obj = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (obj && typeof obj === "object") {
          return obj as T;
      }
  }
  catch (e) { }

  return jsonString;
};

export function stringifyOrKepOriginal(json: any): string{
  if(typeof(json) === "string"){
    return json
  } else {
    return JSON.stringify(json)
  }
};