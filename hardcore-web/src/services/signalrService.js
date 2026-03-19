import * as signalR from "@microsoft/signalr";
import { getToken } from "./authService";
import { env } from "../config";

let connection = null;

export function getDataHubConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(env.signalrHubUrl, {
      accessTokenFactory: () => getToken() || "",
      withCredentials: false,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: env.signalrSkipNegotiation,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .build();

  return connection;
}

export async function startDataHub() {
  const conn = getDataHubConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}

export async function stopDataHub() {
  if (!connection) return;
  if (connection.state !== signalR.HubConnectionState.Disconnected) {
    await connection.stop();
  }
}

async function ensureConnected() {
  const conn = getDataHubConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}

export async function sendBroadcastMessage(message) {
  const conn = await ensureConnected();
  await conn.invoke("SendMessage", message);
}

export async function sendMessageToUser(userId, message) {
  const conn = await ensureConnected();
  await conn.invoke("SendMessageToUser", userId, message);
}