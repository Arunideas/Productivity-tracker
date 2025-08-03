let lastCPUTime = process.cpuUsage();
let lastTime = Date.now();

export function startMemoryMonitor() {
  const interval = setInterval(() => {
    // MEMORY
    const usedMB = process.memoryUsage().heapUsed / 1024 / 1024;

    // CPU
    const currentCPU = process.cpuUsage();
    const now = Date.now();
    const elapsedMS = now - lastTime;

    lastCPUTime = currentCPU;
    lastTime = now;
  }, 15000); // every 15s

  return () => clearInterval(interval);
}
