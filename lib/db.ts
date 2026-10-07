import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.warn("PrismaClient could not be initialized:", error);
    return {} as PrismaClient;
  }
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Resilient Proxy ensures module evaluation never throws errors during Next.js builds on Vercel
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    try {
      const realDb = getDb();
      const val = Reflect.get(realDb, prop, receiver);
      return typeof val === 'function' ? val.bind(realDb) : val;
    } catch {
      return undefined;
    }
  },
});

export default db;
