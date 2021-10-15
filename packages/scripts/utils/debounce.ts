export const debounce = (callBack: () => void | Promise<void>, t: number) => {
  let TM = Date.now();
  setTimeout(() => {
    if (Date.now() - TM >= t) {
      callBack();
    }
  }, t);
};
