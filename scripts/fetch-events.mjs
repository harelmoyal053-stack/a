// Builds the FestiChat event catalog from every configured source, removes
// duplicates across them, and writes festivals/events.json.
//
//   node scripts/fetch-events.mjs <output.json> [--previous <old.json>] [--fixture <entries.json>]
//
// Sources run only when configured:
//   TICKETMASTER_API_KEY   Ticketmaster Discovery API
//   SEATGEEK_CLIENT_ID     SeatGeek Platform API
//   GITHUB_REPOSITORY      approved "add an event" issues (GITHUB_TOKEN optional)
//   scripts/partner-feeds.json  partner promoter feeds
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { fetchCommunity } from './events/community.mjs'
import { entriesFromPrevious, mergeAll } from './events/merge.mjs'
import { fetchPartners } from './events/partners.mjs'
import { fetchSeatGeek } from './events/seatgeek.mjs'
import { fetchTicketmaster } from './events/ticketmaster.mjs'

const PARTNER_FEEDS = fileURLToPath(new URL('./partner-feeds.json', import.meta.url))

function option(args, name) {
  const i = args.indexOf(name)
  return i === -1 ? null : args[i + 1]
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

function configuredSources(env) {
  const sources = []
  if (env.TICKETMASTER_API_KEY) sources.push(['ticketmaster', () => fetchTicketmaster(env.TICKETMASTER_API_KEY)])
  if (env.SEATGEEK_CLIENT_ID) sources.push(['seatgeek', () => fetchSeatGeek(env.SEATGEEK_CLIENT_ID)])
  if (env.GITHUB_REPOSITORY) sources.push(['community', () => fetchCommunity(env.GITHUB_REPOSITORY, env.GITHUB_TOKEN)])
  sources.push(['partner', () => fetchPartners(PARTNER_FEEDS)])
  return sources
}

async function main() {
  const args = process.argv.slice(2)
  const output = args[0]
  if (!output) throw new Error('Usage: fetch-events.mjs <output.json> [--previous <old.json>] [--fixture <entries.json>]')
  const previous = (await readJson(option(args, '--previous') ?? output, { events: [] })).events ?? []

  let entries = []
  const fixture = option(args, '--fixture')
  if (fixture) {
    entries = JSON.parse(await readFile(fixture, 'utf8'))
  } else {
    for (const [name, run] of configuredSources(process.env)) {
      try {
        const found = await run()
        console.log(`${name}: ${found.length} listings`)
        entries.push(...found)
      } catch (err) {
        // Keep yesterday's events from a source that is down today.
        const kept = previous.filter((e) => e.sources?.some((s) => s.split(':')[0] === name))
        console.warn(`${name} failed (${err.message}); keeping ${kept.length} previous events`)
        for (const event of kept) {
          for (const source of event.sources.filter((s) => s.split(':')[0] === name)) entries.push(...entriesFromPrevious(event, source))
        }
      }
    }
  }

  const events = mergeAll(entries, previous)
  if (events.length === 0) {
    console.warn('No events found; leaving the catalog unchanged.')
    return
  }
  const sources = [...new Set(events.flatMap((e) => e.sources.map((s) => s.split(':')[0])))]
  await writeFile(output, JSON.stringify({ updatedAt: new Date().toISOString(), sources, events }))
  console.log(`Wrote ${events.length} events from ${sources.join(', ')} to ${output}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
