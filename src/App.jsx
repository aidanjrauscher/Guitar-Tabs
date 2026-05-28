import { useState, useEffect } from 'react'

const btnBase = 'border-none px-[0.875rem] py-[0.35rem] rounded-[6px] cursor-pointer text-sm font-medium font-[var(--sans)] transition-all duration-150'

export default function App() {
  const [tabs, setTabs] = useState([])
  const [sortBy, setSortBy] = useState('title')
  const [asc, setAsc] = useState(true)

  useEffect(() => {
    fetch('/tabs/tabs.json').then(r => r.json()).then(setTabs)
  }, [])

  const sorted = [...tabs].sort((a, b) => {
    const cmp = a[sortBy].localeCompare(b[sortBy])
    return asc ? cmp : -cmp
  })

  const groups = sorted.reduce((acc, tab) => {
    const letter = tab[sortBy][0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(tab)
    return acc
  }, {})

  const letters = Object.keys(groups).sort((a, b) => asc ? a.localeCompare(b) : b.localeCompare(a))

  return (
    <div className="max-w-[680px] mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
        <h1 className="m-0 text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--text-h)]">
          Guitar Tabs
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--code-bg)] rounded-[8px] p-[3px] gap-[2px]">
            <button
              className={`${btnBase} ${sortBy === 'title' ? 'bg-[var(--accent)] text-white' : 'bg-transparent text-[var(--text)] hover:text-[var(--text-h)]'}`}
              onClick={() => setSortBy('title')}
            >
              Song
            </button>
            <button
              className={`${btnBase} ${sortBy === 'artist' ? 'bg-[var(--accent)] text-white' : 'bg-transparent text-[var(--text)] hover:text-[var(--text-h)]'}`}
              onClick={() => setSortBy('artist')}
            >
              Artist
            </button>
          </div>
          <button
            className="bg-[var(--code-bg)] border-none rounded-[8px] py-[0.35rem] px-[0.625rem] cursor-pointer text-sm text-[var(--text)] font-[var(--sans)] transition-all duration-150 hover:text-[var(--text-h)]"
            onClick={() => setAsc(a => !a)}
          >
            {asc ? '↑' : '↓'}
          </button>
        </div>
      </header>

      <main>
        {letters.map((letter, i) => (
          <section key={letter}>
            <p className={`text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-[var(--accent)] mb-[0.35rem] ${i === 0 ? 'mt-0' : 'mt-5'}`}>
              {letter}
            </p>
            <ul className="list-none p-0 m-0 border border-[var(--border)] rounded-[8px] overflow-hidden">
              {groups[letter].map(tab => (
                <li
                  key={tab.file}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer transition-[background] duration-100 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--code-bg)]"
                  onClick={() => window.open(tab.file, '_blank')}
                >
                  <span className="font-medium text-[var(--text-h)] text-[0.9375rem]">
                    {sortBy === 'title' ? tab.title : tab.artist}
                  </span>
                  <span className="text-[var(--text)] text-sm">
                    {sortBy === 'title' ? tab.artist : tab.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
