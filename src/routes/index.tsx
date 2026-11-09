import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Activity, ArrowDownRight, ArrowUpRight, AudioLines, Bell, ChevronDown, Compass, Heart, Info, MessageCircle, Plus, Search, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listTokenizedStocks } from "@/lib/stocks.functions";
import { careMood } from "@/lib/stockcial";
import mascotArt from "@/assets/mascot-sprite.png";

const stocksQuery = queryOptions({
  queryKey: ["tokenized-stocks"],
  queryFn: () => listTokenizedStocks(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(stocksQuery),
  head: () => ({
    meta: [
      { title: "Stockcial — a little life for your stocks" },
      { name: "description", content: "Meet the little characters behind tokenized stocks on Base. Feed, cheer, pair, and follow their market moods." },
      { property: "og:title", content: "Stockcial — a little life for your stocks" },
      { property: "og:description", content: "Cute stock companions with market moods, community snacks, and a pulse of their own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(stocksQuery);
  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [care, setCare] = useState(0);
  const [paired, setPaired] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(false);
  const [notice, setNotice] = useState("");
  const [speech, setSpeech] = useState("hi, friend!");
  const [blink, setBlink] = useState(false);

  const previewStocks = useMemo(() => [
    { contract_address: "preview-nvda", symbol: "NVDA", name: "Nvidia", nav_price: null },
    { contract_address: "preview-aapl", symbol: "AAPL", name: "Apple", nav_price: null },
    { contract_address: "preview-tsla", symbol: "TSLA", name: "Tesla", nav_price: null },
    { contract_address: "preview-msft", symbol: "MSFT", name: "Microsoft", nav_price: null },
  ], []);
  const stocks = data.stocks.length ? data.stocks : previewStocks;
  const filtered = stocks.filter((stock) => {
    const search = query.trim().toLowerCase();
    return !search || `${stock.name} ${stock.symbol}`.toLowerCase().includes(search);
  }).slice(0, 6);
  const featured = stocks.find((stock) => stock.symbol.toUpperCase() === selectedSymbol) ??
    stocks.find((stock) => stock.symbol.toUpperCase() === "NVDA") ?? stocks[0];
  const mood = careMood(care);
  const sayings = ["to the moon", "snack time", "feeling lucky", "stay curious", "more hugs"];

  useEffect(() => {
    const timer = window.setInterval(() => setBlink((current) => !current), 3100);
    return () => window.clearInterval(timer);
  }, []);

  function speak(text: string) {
    setSpeech(text);
    if (soundOn && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  }

  function giveSnack(amount: number) {
    setCare((current) => current + 1);
    speak(["yummy!", "more please", "so sweet!"][Math.floor(Math.random() * 3)]);
    setNotice(`A pretend $${amount} snack made ${featured.name} feel loved. No money moved.`);
  }

  function cheer() {
    setCare((current) => current + 1);
    speak("so loved!");
    setNotice(`You sent ${featured.name} a little love. This is a local demo, not a social post.`);
  }

  function connectNotice(action: string) {
    setNotice(`${action} is not connected yet. No wallet is connected and no trade was placed.`);
  }

  function togglePair(symbol: string) {
    setPaired((current) => current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol]);
    setNotice(`${symbol} ${paired.includes(symbol) ? "unpaired" : "paired"} with ${featured.symbol} in your local demo.`);
  }

  return (
    <main className="stockcial min-h-screen bg-background text-foreground">
      <aside className="side-rail" aria-label="Main navigation">
        <a href="#home" className="brand-mark" aria-label="Stockcial home"><span className="brand-icon"><Sparkles size={17} /></span><span>stockcial</span></a>
        <nav className="rail-nav">
          <a className="rail-link rail-link-active" href="#home"><Compass size={18} /><span>Discover</span></a>
          <a className="rail-link" href="#friends"><Heart size={18} /><span>My friends</span><span className="rail-count">04</span></a>
          <a className="rail-link" href="#pulse"><Activity size={18} /><span>Market pulse</span></a>
        </nav>
        <div className="rail-bottom"><div className="rail-avatar">S</div><div><b>Stockcial</b><small>Base companions</small></div><ChevronDown size={15} className="rail-chevron" /></div>
      </aside>

      <div className="page-shell" id="home">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-icon"><Sparkles size={16} /></span> stockcial</div>
          <div className="breadcrumb"><span>the little market</span><span className="crumb-divider">/</span><b>discover</b></div>
          <div className="top-actions">
            <span className="network-pill"><i /> Base <ChevronDown size={13} /></span>
            <Button variant="outline" size="sm" className="wallet-button" onClick={() => connectNotice("Wallet connection")}><Wallet size={15} /> Connect wallet</Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setNotice("No new notes from your companions.")}><Bell size={17} /></Button>
          </div>
        </header>

        <section className="intro-row">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> A FRIENDLY LITTLE MARKET</div><h1>Meet your market <span>friends.</span></h1><p>Tokenized stocks with tiny personalities and a pulse of their own.</p></div>
          <div className="search-wrap"><Search size={17} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a stock friend" aria-label="Find a stock friend" /></div>
        </section>

        <section className="feature-layout" aria-label="Featured stock character">
          <div className={`feature-stage mood-${mood.key}`}>
            <div className="stage-topline"><span className="stage-label"><i /> TODAY'S LITTLE COMPANION</span><Button variant="ghost" size="icon" aria-label={soundOn ? "Turn sounds off" : "Turn sounds on"} title={soundOn ? "Turn sounds off" : "Turn sounds on"} onClick={() => { setSoundOn((value) => !value); setNotice(soundOn ? "Character sounds off." : "Character sounds on. Tap your friend to hear a little voice."); }}><AudioLines size={18} /></Button></div>
            <div className="mascot-area">
              <div className="speech-bubble" aria-live="polite">{speech}<span /></div>
              <div className={`mascot-wrap ${blink ? "mascot-blink" : ""}`}>
                <img className="main-mascot" src={mascotArt} width={1200} height={800} alt={`Cute green stock companion for ${featured.name}`} />
                <span className="mascot-sparkle sparkle-one">✦</span><span className="mascot-sparkle sparkle-two">✧</span>
              </div>
              <div className="mood-orbit"><span className="mood-face">{mood.face}</span><div><small>feeling</small><b>{mood.label}</b></div></div>
            </div>
            <div className="feature-footer">
              <div className="featured-name"><span className="featured-ticker">{featured.symbol}</span><h2>{featured.name}</h2><span className="chain-tag">B20 · Base</span></div>
              <div className="featured-stats"><div><small>THEIR MOOD</small><b>{mood.label}</b></div><div><small>MARKET SIGNAL</small><b className="muted-stat">Waiting for live feed</b></div><div><small>COMMUNITY</small><b className="muted-stat">Your demo only</b></div></div>
            </div>
            <span className="stage-decor decor-left">✳</span><span className="stage-decor decor-right">✧</span>
          </div>

          <div className="care-panel">
            <div className="care-heading"><div><span className="eyebrow">A LITTLE LOVE GOES FAR</span><h2>Keep them company</h2></div><span className="care-heart"><Heart size={17} /></span></div>
            <p className="care-copy">Little moments make a happy friend. These are just playful taps in this preview.</p>
            <div className="care-actions"><div className="care-row"><div className="care-action-icon snack-icon"><Sparkles size={17} /></div><div className="care-action-copy"><b>Feed me</b><small>pretend money snacks</small></div><div className="meal-options"><Button variant="outline" size="sm" onClick={() => giveSnack(5)}>$5</Button><Button variant="outline" size="sm" onClick={() => giveSnack(10)}>$10</Button><Button variant="outline" size="sm" onClick={() => giveSnack(25)}>$25</Button></div></div>
              <div className="care-row"><div className="care-action-icon post-icon"><MessageCircle size={17} /></div><div className="care-action-copy"><b>Send a little love</b><small>one happy tap</small></div><Button variant="secondary" size="sm" className="care-cta" onClick={cheer}><Heart size={14} /> Cheer</Button></div>
            </div>
            <div className="care-divider" />
            <div className="market-actions"><Button className="buy-action" onClick={() => connectNotice("Buy me")}><ArrowDownRight size={16} /> Buy me</Button><Button variant="outline" className="trade-action" onClick={() => connectNotice("Trade me")}><ArrowUpRight size={16} /> Trade me</Button></div>
            <div className="safety-note"><Info size={14} /><span>Play only — no wallet, purchase, or post is connected.</span></div>
          </div>
        </section>

        <div className="notice-line" role="status" aria-live="polite">{notice || <span><AudioLines size={14} /> {soundOn ? "Little voice is on" : "Little voice is resting"} <span className="notice-divider">·</span> Sound starts after you tap</span>}</div>

        <section className="friends-section" id="friends">
          <div className="section-heading"><div><div className="eyebrow">THE NEIGHBORHOOD</div><h2>Stock friends <span>{stocks.length}</span></h2></div><Button variant="outline" size="sm" onClick={() => setNotice("The full Coinbase stock list is shown when the public listing feed is available.")}><Plus size={15} /> Find a friend</Button></div>
          {!data.stocks.length && <div className="feed-status"><span className="feed-dot" /> Preview cast <span className="notice-divider">·</span> Live listings couldn’t load, so these are example companions.</div>}
          {data.error && data.stocks.length > 0 && <div className="feed-status"><span className="feed-dot" /> Some listings may be missing right now.</div>}
          <div className="friend-grid">
            {filtered.map((stock, index) => {
              const isSelected = featured.contract_address === stock.contract_address;
              const isPaired = paired.includes(stock.symbol);
              return <article className={`friend-card ${isSelected ? "friend-selected" : ""}`} key={stock.contract_address}>
                <button className="friend-select" type="button" aria-label={`Meet ${stock.name}`} onClick={() => { setSelectedSymbol(stock.symbol); setNotice(""); speak("hello friend!"); }}>
                  <span className={`friend-avatar friend-avatar-${index % 4}`}><img src={mascotArt} width={1200} height={800} alt="" loading="lazy" /></span>
                  <span className="friend-info"><b>{stock.name}</b><small>{stock.symbol} <i>·</i> B20</small></span>
                  <span className="friend-status"><span className="status-dot" /> {isSelected ? "Here with you" : "Say hi"}</span>
                </button>
                <div className="friend-card-bottom"><span className="nav-pending">{stock.nav_price != null ? `NAV $${Number(stock.nav_price).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "NAV waiting"}</span><Button variant="ghost" size="icon" aria-label={isPaired ? `Unpair ${stock.symbol}` : `Pair ${stock.symbol}`} title={isPaired ? "Remove pairing" : "Pair with featured friend"} onClick={() => togglePair(stock.symbol)}><Heart size={16} className={isPaired ? "paired-heart" : ""} /></Button></div>
              </article>;
            })}
            {!filtered.length && <p className="empty-state">No little friends match “{query}”. Try another name.</p>}
          </div>
        </section>

        <section className="bottom-insights" id="pulse">
          <div className="pulse-panel"><div className="insight-heading"><div><span className="eyebrow">A NOTE FROM THE MARKET</span><h2>Today's pulse</h2></div><span className="pulse-icon"><Activity size={18} /></span></div><div className="pulse-empty"><span className="pulse-mood">☁</span><p>Waiting for the market to wake up.</p><small>Live price history, on-chain swaps, and social mood aren’t connected in this preview.</small></div></div>
          <div className="snacks-panel"><div className="insight-heading"><div><span className="eyebrow">LITTLE SNACKS</span><h2>From the neighborhood</h2></div><MessageCircle size={18} /></div><div className="snack-post"><span className="post-avatar"><img src={mascotArt} width={1200} height={800} alt="" loading="lazy" /></span><div><b>{featured.symbol} <span>· just now</span></b><p>“{sayings[(care + 2) % sayings.length]}”</p></div><span className="post-reaction">♡ 12</span></div><div className="snack-post snack-post-muted"><span className="post-avatar post-avatar-coral"><Sparkles size={17} /></span><div><b>Neighborhood note <span>· preview</span></b><p>Little characters love a kind hello.</p></div><span className="post-reaction">♡ 08</span></div><div className="social-status"><Info size={13} /> Sample posts only · social mentions aren’t connected</div></div>
        </section>

        <footer className="page-footer"><span>stockcial <i>·</i> little market, big feelings</span><span><Info size={13} /> Informational play experience. Tokenized stocks may be restricted by location and eligibility.</span></footer>
      </div>
    </main>
  );
}
