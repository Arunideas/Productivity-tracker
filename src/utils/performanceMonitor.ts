let lastCPUTime = process.cpuUsage();
let lastTime = Date.now();

export function startMemoryMonitor() {
  const interval = setInterval(() => {
    // MEMORY
    const usedMB = process.memoryUsage().heapUsed / 1024 / 1024;
    const memoryMsg = `📈 Memory Usage: ${usedMB.toFixed(2)} MB`;
    if (usedMB > 8) {
      console.warn(`⚠️ High Memory Usage: ${memoryMsg}`);
    } else {
      console.log(memoryMsg);
    }

    // CPU
    const currentCPU = process.cpuUsage();
    const now = Date.now();
    const elapsedMS = now - lastTime;

    const userCPU = (currentCPU.user - lastCPUTime.user) / 1000; // microseconds → ms
    const systemCPU = (currentCPU.system - lastCPUTime.system) / 1000;

    const cpuMsg = `🧠 CPU Usage: user ${userCPU.toFixed(2)} ms, system ${systemCPU.toFixed(2)} ms (in ${elapsedMS} ms)`;
    console.log(cpuMsg);

    lastCPUTime = currentCPU;
    lastTime = now;
  }, 15000); // every 15s

  return () => clearInterval(interval);
}
