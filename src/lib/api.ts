import { env } from "@/env";

export type Mode = "blacklist" | "whitelist";
export type RuleType = "ip" | "url" | "port";

export async function getRules() {
  const r = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/firewall/rules`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to fetch rules");
  return r.json() as Promise<{
    ips: { blacklist: {id:number,value:string}[]; whitelist: {id:number,value:string}[] };
    urls:{ blacklist: {id:number,value:string}[]; whitelist: {id:number,value:string}[] };
    ports:{ blacklist: {id:number,value:number}[]; whitelist: {id:number,value:number}[] };
  }>;
}

export async function addRules(type: RuleType, mode: Mode, values: (string|number)[]) {
  const r = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/firewall/${type}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, values })
  });
  if (!r.ok) throw new Error("Failed to add rules");
  return r.json();
}

export async function deleteRules(type: RuleType, mode: Mode, values: (string|number)[]) {
  const r = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/firewall/${type}`, {
    method: "DELETE", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, values })
  });
  if (!r.ok) throw new Error("Failed to delete rules");
  return r.json();
}

export async function toggleRules(body: any) {
  const r = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/firewall/rules`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("Failed to toggle rules");
  return r.json();
}
