"use client";
import React from "react";

const tabs = ["Overview","Kernel Modules","Firewall Rules","API Interface","Logs & Testing"] as const;
export type Tab = typeof tabs[number];

export function Navbar({ current, onSelect }:{ current: Tab; onSelect:(t:Tab)=>void }) {
  return (
    <nav style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #eee"}}>
      <a href="/" aria-label="Home" style={{fontWeight:700}}>🔥 Firewall</a>
      {tabs.map(t => (
        <button key={t}
          style={{padding:"6px 10px", borderRadius:8, background: current===t?"#eee":"transparent"}}
          onClick={() => onSelect(t)}>{t}</button>
      ))}
      <div style={{marginLeft:"auto", display:"flex", gap:12}}>
        <a href="#" aria-label="Settings">Settings</a>
        <a href="#" aria-label="Profile">Profile</a>
      </div>
    </nav>
  );
}
