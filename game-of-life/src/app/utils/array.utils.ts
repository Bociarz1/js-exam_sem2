export class ArrayUtils {
  static contains(item: any,array: any):boolean {
    for (const obj of array) {
      let match: boolean = true;
      for (const key in item) {
        if (item[key] !== obj[key]) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  static  countMatchingElements(arr: any): any {
    const countMap: Map<any,any> = new Map();

    for (const innerObj of arr) {
      for (const obj of innerObj) {
        const key = JSON.stringify(obj);

        countMap.set(key, (countMap.get(key) || 0) + 1);
      }
    }
    const result: any = [];
    countMap.forEach((amount, value) => {
      result.push({ value: JSON.parse(value), amount });
    });

    return result;
  }
}
