/// <reference types="@types/node" />

import { PrismaClient } from "@prisma/client"
import fs from "fs"

const log = console.log

const prisma = new PrismaClient({ log: ["query"] })

log("connected to database")

/** @type {Date} */
// const beginDate = await prisma.feed.findFirst({ orderBy: { time: "asc" }, select: { time: true } }).then(x => x.time)
// const beginDate = new Date("2022-01-01T00:00:00.000Z")
const beginDate = new Date("2011-03-13 15:06:40")

log("beginDate", beginDate)

/** @type {Date} */
// const endDate = await prisma.feed.findFirst({ orderBy: { time: "desc" }, select: { time: true }, take: 1 }).then(x => x.time)
const endDate = new Date("2024-07-21 11:51:54")

log("endDate", endDate)

const interval = 24 * 60 * 60 * 1000;
const dayInterval = 8 * 60 * 60 * 1000;

// 从 beginDate 到 endDate 每个 interval 执行下列查询
// 按照每秒划窗
let results = [];
let batch = [];

// 从 beginDate 到 endDate 每个 interval 执行下列查询
// 按照每秒划窗
for (let currentDate = new Date(beginDate.getTime()); currentDate <= endDate; currentDate = new Date(currentDate.getTime() + dayInterval)) {
    batch.push(
        prisma.feed.count({
            where: {
                time: {
                    lte: currentDate,
                    gt: new Date(currentDate.getTime() - interval),
                }
            }
        }).then(count => {
            log(`current [${count}\t]: ${currentDate.toISOString()} / ${endDate.toISOString()}`)
            return { date: currentDate.toISOString(), count };
        })
    );

    if (batch.length === 24) {
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
        batch = [];
    }
}

// 处理剩余的查询
if (batch.length > 0) {
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
}


console.log(results);

try { fs.mkdirSync("src/lib/analytics") } catch (_) { }

fs.writeFileSync("src/lib/analytics/day24h.json", JSON.stringify(results))
