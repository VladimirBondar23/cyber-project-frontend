"use client";
import { useState, useEffect } from "react";
import { Navbar, type Tab } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { FirewallRules } from "@/components/FirewallRules";

function Placeholder({ title}:{title:string}) {
  return <div style={{padding:24}}><h2>{title}</h2><p>Coming soon…</p></div>;
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("Overview");

  useEffect(() => {
    // Optional: read hash to select tab
    const fromHash = decodeURIComponent(location.hash.replace("#",""));
    if (fromHash) setTab(fromHash as Tab);
  }, []);

  return (
    <>
      <Navbar current={tab} onSelect={t => { setTab(t); location.hash = encodeURIComponent(t); }} />
      <main style={{flex:1}}>
        {tab === "Overview"        && <Placeholder title="Overview" />}
        {tab === "Kernel Modules"  && <Placeholder title="Kernel Modules" />}
        {tab === "API Interface"   && <Placeholder title="API Interface" />}
        {tab === "Logs & Testing"  && <Placeholder title="Logs & Testing" />}
        {tab === "Firewall Rules"  && <FirewallRules />}
      </main>
      <Footer />
    </>
  );
}
