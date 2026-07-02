/**
 * This function loops through a function rerunning all assertions
 * inside of it until it gets a truthy result.
 *
 * If the maximum duration is reached, it then rejects.
 */
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime += 10;

      Promise.resolve(assertions())
        .then(() => {
          clearInterval(interval);
          resolve();
        })
        .catch((err: unknown) => {
          if (elapsedTime >= maxDuration) {
            clearInterval(interval);
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });
    }, 10);
  });
}
