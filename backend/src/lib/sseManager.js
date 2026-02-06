const clients = new Map();

export function addClient(userId, res) {
  // console.log("addclient called\n");
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
    // console.log("Client added\n");
  }
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.add(res);
    // console.log("Client added 2\n");
  }
}

export function removeClient(res) {
  for (const [userId, set] of clients.entries()) {
    set.delete(res);
    // console.log("Client deleted \n");

    if (set.size === 0) {
      clients.delete(userId);
    }
  }
}

export function sendEvent(userId, event, data) {
  // console.log("Send event called\n");
  const userClients = clients.get(userId);
  if (!userClients) {
    // console.log("UserClinet not found\n");
    return;
  }
  for (const res of userClients) {
    // console.log("Send event called by res\n");
    res.write(
      `event: ${event}\n` +
      `data: ${JSON.stringify(data || {})}\n\n`
    );
  }
}
