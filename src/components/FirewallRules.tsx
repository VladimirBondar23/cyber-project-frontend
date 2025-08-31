"use client";
import { useEffect, useMemo, useState, useId } from "react";
import { addRules, deleteRules, getRules, toggleRules, type Mode, type RuleType } from "@/lib/api";



function RuleForm({ onChanged }: { onChanged: () => void }) {
  const [type, setType] = useState<RuleType>("ip");
  const [mode, setMode] = useState<Mode>("blacklist");
  const [values, setValues] = useState("");

  // unique ids for label ↔ control association
  const typeId = useId();
  const modeId = useId();
  const valuesId = useId();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Parse values (comma-separated)
    const valuesArr = values.split(',').map(v => v.trim()).filter(Boolean);
    if (!valuesArr.length) return;
  // Call addRules with correct arguments
  await addRules(type, mode, valuesArr);
    setValues("");
    onChanged();
  };

  return (
    <form onSubmit={onSubmit} style={{padding:16, borderBottom:"1px solid #eee"}}>
      <h3>Add Rules</h3>

      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <label htmlFor={typeId} className="visually-hidden">Rule type</label>
        <select id={typeId} name="type" value={type} onChange={e => setType(e.target.value as RuleType)}>
          <option value="ip">IP</option>
          <option value="url">URL</option>
          <option value="port">Port</option>
        </select>

        <label htmlFor={modeId} className="visually-hidden">Mode</label>
        <select id={modeId} name="mode" value={mode} onChange={e => setMode(e.target.value as Mode)}>
          <option value="blacklist">Blacklist</option>
          <option value="whitelist">Whitelist</option>
        </select>

        <label htmlFor={valuesId} className="visually-hidden">Values to add</label>
        <input
          id={valuesId}
          name="values"
          placeholder={type==="port" ? "22,443,8080" : type==="ip" ? "1.1.1.1, 8.8.8.8" : "good.com, docs.example.org"}
          value={values}
          onChange={e => setValues(e.target.value)}
          style={{flex:1}}
        />

        <button type="submit">Add</button>
      </div>
    </form>
  );
}

function RulesList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async ()=> {
    setLoading(true);
    try { setData(await getRules()); } finally { setLoading(false); }
  };

  useEffect(()=>{ refresh(); }, []);

  const flat = useMemo(()=> {
    if (!data) return [];
    const out:any[] = [];
    (["ips","urls","ports"] as const).forEach(group=>{
      (["blacklist","whitelist"] as const).forEach(mode=>{
        for (const r of data[group][mode]) {
          out.push({ id:r.id, value:r.value, type: group.slice(0,-1) as RuleType, mode });
        }
      });
    });
    return out;
  }, [data]);

  if (loading && !data) return <div style={{padding:16}}>Loading…</div>;
  if (!data) return <div style={{padding:16}}>No data</div>;

  return (
    <div style={{padding:16}}>
      <h3>Existing Rules</h3>
      <button onClick={refresh} style={{marginBottom:8}}>Reload</button>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead><tr>
          <th align="left">ID</th><th align="left">Type</th><th align="left">Mode</th><th align="left">Value</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {flat.map(row=>(
            <tr key={`${row.type}-${row.mode}-${row.id}`} style={{borderTop:"1px solid #eee"}}>
              <td>{row.id}</td><td>{row.type}</td><td>{row.mode}</td><td>{row.value}</td>
              <td>
                <button onClick={async ()=>{
                  const body:any = { ips:{}, urls:{}, ports:{} };
                  const key = (row.type + "s") as "ips"|"urls"|"ports";
                  body[key] = { ids:[row.id], mode: row.mode, active: false }; // deactivate example
                  await toggleRules(body);
                  await refresh();
                }}>Deactivate</button>
                <button onClick={async ()=>{
                  await deleteRules(row.type, row.mode, [row.value]);
                  await refresh();
                }} style={{marginLeft:8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FirewallRules() {
  const [key, setKey] = useState(0);
  return (
    <section>
      <RuleForm onChanged={()=>setKey(k=>k+1)} />
      {/* key forces RulesList to reload after adding */}
      <RulesList key={key} />
    </section>
  );
}
