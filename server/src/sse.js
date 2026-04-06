'use strict'

// ── Server-Sent Events broadcaster ────────────────────────────────────────────
// Each connected browser gets its own response stream added to this set.
// Call broadcast() from any route to push real-time updates to all tabs.

const clients = new Set()

/**
 * Register a new SSE client response stream.
 * Automatically removes it when the connection closes.
 */
function addClient(res) {
  clients.add(res)
  console.log(`[SSE] לקוח חדש התחבר. סה"כ: ${clients.size}`)
  res.on('close', () => {
    clients.delete(res)
    console.log(`[SSE] לקוח התנתק. סה"כ: ${clients.size}`)
  })
}

/**
 * Send a named SSE event to every connected client.
 * @param {string} event - event name (e.g. 'deal:updated', 'price:dropped')
 * @param {object} data  - JSON-serialisable payload
 */
function broadcast(event, data) {
  if (clients.size === 0) return
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  let dead = []
  clients.forEach((res) => {
    try {
      res.write(msg)
    } catch (_) {
      dead.push(res)
    }
  })
  dead.forEach((r) => clients.delete(r))
}

/**
 * Returns the current number of active SSE connections.
 */
function clientCount() {
  return clients.size
}

module.exports = { addClient, broadcast, clientCount }
