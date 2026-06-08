import { useState, useEffect } from 'react'

const btnBase = 'border-none px-[0.875rem] py-[0.35rem] rounded-[6px] cursor-pointer text-sm font-medium font-[var(--sans)] transition-all duration-150'

export default function App() {
  const [tabs, setTabs] = useState([])
  const [sortBy, setSortBy] = useState('title')
  const [asc, setAsc] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/tabs/tabs.json')
      .then(r => r.json())
      .then(data => setTabs(
        data.flatMap(({ artist, songs }) =>
          songs.map(({ title, file }) => ({ artist, title, file }))
        )
      ))
  }, [])

  const filtered = query
    ? tabs.filter(tab => tab[sortBy].toLowerCase().includes(query.toLowerCase()))
    : tabs

  const sorted = [...filtered].sort((a, b) => {
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
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
        <h1 className="m-0 text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--text-h)]">
          Guitar Tabs
        </h1>
        <div className="flex items-center gap-3">
          <a
            href="https://open.spotify.com/playlist/2nP6wBBaKalRvnC3H0j9J9"
            target="_blank"
            rel="noreferrer"
            className="text-[#1DB954] hover:opacity-70 transition-opacity duration-150"
            aria-label="Open Spotify playlist"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
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

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search by ${sortBy === 'title' ? 'song' : 'artist'}…`}
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-4 py-[0.625rem] text-[0.9375rem] text-[var(--text-h)] placeholder:text-[var(--text)] outline-none focus:border-[var(--accent)] transition-[border-color] duration-150 font-[var(--sans)]"
        />
      </div>

      <main>
        {letters.map((letter, i) => (
          <section key={letter}>
            <p className={`text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-[var(--accent)] mb-[0.35rem] ${i === 0 ? 'mt-0' : 'mt-5'}`}>
              {letter}
            </p>
            <ul className="list-none p-0 m-0 border border-[var(--border)] rounded-[8px] overflow-hidden">
              {groups[letter].map(tab => (
                <li
                  key={`${tab.artist}-${tab.title}`}
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
