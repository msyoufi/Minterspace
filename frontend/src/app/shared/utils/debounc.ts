export default function debounce<T extends (...args: any[]) => R, R>(fn: T, delay: number = 400) {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  }
}