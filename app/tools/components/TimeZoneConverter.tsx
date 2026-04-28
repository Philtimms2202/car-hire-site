'use client'

import { useState, useEffect } from 'react'

const ZONES = [
  { label: 'London (GMT/BST)',       value: 'Europe/London'         },
  { label: 'Paris / Berlin (CET)',   value: 'Europe/Paris'          },
  { label: 'Amsterdam',              value: 'Europe/Amsterdam'      },
  { label: 'Athens',                 value: 'Europe/Athens'         },
  { label: 'Moscow',                 value: 'Europe/Moscow'         },
  { label: 'New York (ET)',          value: 'America/New_York'      },
  { label: 'Los Angeles (PT)',       value: 'America/Los_Angeles'   },
  { label: 'Chicago (CT)',           value: 'America/Chicago'       },
  { label: 'Toronto',                value: 'America/Toronto'       },
  { label: 'São Paulo',              value: 'America/Sao_Paulo'     },
  { label: 'Dubai (GST)',            value: 'Asia/Dubai'            },
  { label: 'Abu Dhabi',              value: 'Asia/Dubai'            },
  { label: 'Doha',                   value: 'Asia/Qatar'            },
  { label: 'Mumbai / Delhi (IST)',   value: 'Asia/Kolkata'          },
  { label: 'Bangkok (ICT)',          value: 'Asia/Bangkok'          },
  { label: 'Singapore (SGT)',        value: 'Asia/Singapore'        },
  { label: 'Kuala Lumpur',           value: 'Asia/Kuala_Lumpur'     },
  { label: 'Hong Kong',              value: 'Asia/Hong_Kong'        },
  { label: 'Tokyo (JST)',            value: 'Asia/Tokyo'            },
  { label: 'Seoul',                  value: 'Asia/Seoul'            },
  { label: 'Beijing',                value: 'Asia/Shanghai'         },
  { label: 'Sydney (AEDT)',          value: 'Australia/Sydney'      },
  { label: 'Auckland (NZST)',        value: 'Pacific/Auckland'      },
  { label: 'Honolulu (HST)',         value: 'Pacific/Honolulu'      },
  { label: 'Johannesburg (SAST)',    value: 'Africa/Johannesburg'   },
  { label: 'Nairobi',                value: 'Africa/Nairobi'        },
  { label: 'Cairo',                  value: 'Africa/Cairo'          },
  { label: 'Reykjavik',              value: 'Atlantic/Reykjavik'    },
]

function getOffset(tz: string, date: Date) {
  const utc   = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const local = new Date(date.toLocaleString('en-US', { timeZone: tz  }))
  return Math.round((local.getTime() - utc.getTime()) / 3600000)
}

function formatDate(date: Date, tz: string) {
  return date.toLocaleString('en-GB', {
    timeZone: tz,
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function TimeZoneConverter() {
  const [home, setHome]   = useState('Europe/London')
  const [dest, setDest]   = useState('America/New_York')
  const [dtVal, setDtVal] = useState('')
  const [result, setResult] = useState<null | {
    homeStr: string; destStr: string; diff: number
  }>(null)

  useEffect(() => {
    const now = new Date()
    now.setMinutes(0, 0, 0)
    setDtVal(now.toISOString().slice(0, 16))
  }, [])

  function convert() {
    if (!dtVal) return
    const date = new Date(dtVal)
    const diff = getOffset(dest, date) - getOffset(home, date)
    setResult({
      homeStr: formatDate(date, home),
      destStr: formatDate(date, dest),
      diff,
    })
  }

  const jetLagTip = result
    ? Math.abs(result.diff) >= 5
      ? 'A large time difference — try adjusting your sleep schedule a few days before you travel. Stay hydrated on the flight and avoid alcohol.'
      : Math.abs(result.diff) >= 2
      ? 'A moderate difference — switch to destination time as soon as you board. Sleeping on local schedule from day one helps.'
      : 'A small time difference — most people adjust within a day or two without much effort.'
    : null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Your home city</label>
          <select value={home} onChange={e=>setHome(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]">
            {ZONES.map(z => <option key={z.label} value={z.value}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Destination city</label>
          <select value={dest} onChange={e=>setDest(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]">
            {ZONES.map(z => <option key={z.label} value={z.value}>{z.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Date and time (at home)</label>
          <input type="datetime-local" value={dtVal} onChange={e=>setDtVal(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <button onClick={convert}
          className="py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: '#022135' }}>
          Convert time
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          {[
            { label: 'At home', time: result.homeStr.split(',').pop()?.trim() ?? '', date: result.homeStr.split(',').slice(0,-1).join(',').trim() },
            { label: 'At destination', time: result.destStr.split(',').pop()?.trim() ?? '', date: result.destStr.split(',').slice(0,-1).join(',').trim(),
              diff: result.diff === 0 ? 'Same time' : result.diff > 0 ? `+${result.diff}h ahead` : `${result.diff}h behind` },
          ].map(row => (
            <div key={row.label} className="bg-gray-50 rounded-2xl border border-gray-200 px-5 py-4">
              <p className="text-xs text-gray-400 mb-1">{row.label}</p>
              <p className="text-2xl font-semibold" style={{ color: '#022135' }}>{row.time}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {row.date}
                {'diff' in row && row.diff && (
                  <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#e0f5f5', color: '#03989e' }}>
                    {row.diff}
                  </span>
                )}
              </p>
            </div>
          ))}

          {jetLagTip && (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              {jetLagTip}
            </div>
          )}
        </div>
      )}
    </div>
  )
}