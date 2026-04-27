'use client'

import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceScore = 'green' | 'amber' | 'red' | 'none'
type ActiveTab = 'out' | 'ret'

interface FlightDatePickerProps {
  origin?: string
  originCode?: string
  destination?: string
  destinationCode?: string
  /** Called when the user clicks Search with both dates selected */
  onSearch?: (outDate: string, retDate: string) => void
  /** Optional: pass price data keyed by ISO date string to override heuristics */
  priceData?: Record<string, PriceScore>
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const DOW_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// UK bank holidays — extend as needed
const UK_BANK_HOLIDAYS = new Set([
  '2025-04-18', '2025-04-21', '2025-05-05', '2025-05-26',
  '2025-08-25', '2025-12-25', '2025-12-26',
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-04',
  '2026-05-25', '2026-08-31', '2026-12-25', '2026-12-28',
])

// ─── Heuristic price scoring ───────────────────────────────────────────────────

function getHeuristicScore(dateStr: string): PriceScore {
  const d = new Date(dateStr)
  const month = d.getMonth()
  const dow = d.getDay() // 0 = Sun
  const date = d.getDate()

  if (UK_BANK_HOLIDAYS.has(dateStr)) return 'red'

  // School holiday windows (UK)
  const isSchoolHol =
    (month === 6 && date >= 18) ||   // Late July
    month === 7 ||                    // All August
    (month === 8 && date <= 2) ||     // Early Sept
    (month === 9 && date >= 20) ||    // Oct half-term
    (month === 1 && date >= 17 && date <= 21) || // Feb half-term
    (month === 11 && date >= 20) ||   // Christmas
    (month === 0 && date <= 3)        // New Year

  if (isSchoolHol) return 'red'

  // Peak months
  if (month === 5 || month === 6) return 'amber'

  // Weekends always slightly pricier
  if (dow === 0 || dow === 6) return 'amber'

  // Deep off-peak months
  if ([0, 1, 10, 11].includes(month)) return 'amber'

  // Tue / Wed / Thu in shoulder months = best value
  if (dow >= 2 && dow <= 4) return 'green'

  return 'amber'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDisplay(str: string): string {
  const d = new Date(str)
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`
}

function nightsBetween(out: string, ret: string): number {
  return Math.round((new Date(ret).getTime() - new Date(out).getTime()) / 86_400_000)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DayProps {
  day: number
  dateStr: string
  score: PriceScore
  isPast: boolean
  isOutbound: boolean
  isReturn: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  onClick: (dateStr: string) => void
}

function Day({
  day, dateStr, score, isPast,
  isOutbound, isReturn, isInRange,
  isRangeStart, isRangeEnd, onClick,
}: DayProps) {
  const dotColor: Record<PriceScore, string> = {
    green: 'bg-[#16A34A]',
    amber: 'bg-[#D97706]',
    red:   'bg-[#DC2626]',
    none:  'hidden',
  }

  const dotBg: Record<PriceScore, string> = {
    green: 'bg-[#F0FDF4]',
    amber: 'bg-[#FFFBEB]',
    red:   'bg-[#FEF2F2]',
    none:  '',
  }

  // Selected endpoint styles
  if (isOutbound) {
    return (
      <button
        onClick={() => onClick(dateStr)}
        className="relative flex flex-col items-center justify-center min-h-[44px] rounded-[10px] border-[1.5px] border-[#022135] bg-[#022135] transition-all duration-100 cursor-pointer"
        aria-label={`Outbound: ${dateStr}`}
      >
        <span className="text-[13px] font-semibold text-white leading-none">{day}</span>
        <span className="w-[5px] h-[5px] rounded-full mt-[3px] bg-white/60" />
      </button>
    )
  }

  if (isReturn) {
    return (
      <button
        onClick={() => onClick(dateStr)}
        className="relative flex flex-col items-center justify-center min-h-[44px] rounded-[10px] border-[1.5px] border-[#03989e] bg-[#03989e] transition-all duration-100 cursor-pointer"
        aria-label={`Return: ${dateStr}`}
      >
        <span className="text-[13px] font-semibold text-white leading-none">{day}</span>
        <span className="w-[5px] h-[5px] rounded-full mt-[3px] bg-white/60" />
      </button>
    )
  }

  // Range fill
  if (isInRange) {
    const rounding = isRangeStart
      ? 'rounded-l-[10px] rounded-r-none'
      : isRangeEnd
      ? 'rounded-r-[10px] rounded-l-none'
      : 'rounded-none'

    return (
      <button
        onClick={() => onClick(dateStr)}
        className={`relative flex flex-col items-center justify-center min-h-[44px] border-[1.5px] border-transparent bg-[#03989e]/15 transition-all duration-100 cursor-pointer ${rounding}`}
        aria-label={dateStr}
      >
        <span className="text-[13px] font-medium text-[#022135] leading-none">{day}</span>
        <span className={`w-[5px] h-[5px] rounded-full mt-[3px] ${dotColor[score]}`} />
      </button>
    )
  }

  // Disabled past dates
  if (isPast) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[44px] rounded-[10px] opacity-30 cursor-not-allowed">
        <span className="text-[13px] font-medium text-slate-400 leading-none">{day}</span>
        <span className="w-[5px] h-[5px] rounded-full mt-[3px] bg-slate-300" />
      </div>
    )
  }

  // Normal available date
  return (
    <button
      onClick={() => onClick(dateStr)}
      className={`relative flex flex-col items-center justify-center min-h-[44px] rounded-[10px] border-[1.5px] border-transparent transition-all duration-100 cursor-pointer hover:border-[#022135] hover:bg-[#022135]/5 ${dotBg[score]}`}
      aria-label={dateStr}
    >
      <span className="text-[13px] font-medium text-slate-800 leading-none">{day}</span>
      <span className={`w-[5px] h-[5px] rounded-full mt-[3px] ${dotColor[score]}`} />
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FlightDatePicker({
  origin = 'London',
  originCode = 'LHR',
  destination = 'Barcelona',
  destinationCode = 'BCN',
  onSearch,
  priceData,
}: FlightDatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [outDate, setOutDate] = useState<string | null>(null)
  const [retDate, setRetDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('out')

  const changeMonth = (dir: number) => {
    setViewMonth(prev => {
      const next = prev + dir
      if (next > 11) { setViewYear(y => y + 1); return 0 }
      if (next < 0)  { setViewYear(y => y - 1); return 11 }
      return next
    })
  }

  const handleDayClick = useCallback((dateStr: string) => {
    if (activeTab === 'out') {
      setOutDate(dateStr)
      // Clear return if it's before new outbound
      setRetDate(prev => (prev && prev <= dateStr ? null : prev))
      setActiveTab('ret')
    } else {
      if (outDate && dateStr <= outDate) {
        // Clicked before outbound — reset outbound
        setOutDate(dateStr)
        setRetDate(null)
      } else {
        setRetDate(dateStr)
      }
    }
  }, [activeTab, outDate])

  const handleSearch = () => {
    if (outDate && retDate) {
      onSearch?.(outDate, retDate)
      // Default: build Travelpayouts deep-link
      // const url = `https://your-white-label.com/flights?origin=${originCode}&dest=${destinationCode}&depart=${outDate}&return=${retDate}`
      // window.open(url, '_blank')
    }
  }

  // Build calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
  let startDow = firstDayOfMonth.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1 // Mon=0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const calDays: { day: number; dateStr: string }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    calDays.push({ day: d, dateStr: toDateStr(viewYear, viewMonth, d) })
  }

  const outDateObj = outDate ? new Date(outDate) : null
  const retDateObj = retDate ? new Date(retDate) : null

  const nights = outDate && retDate ? nightsBetween(outDate, retDate) : null

  return (
    <div className="bg-[#F8FAFF] p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(2,33,53,0.08),0_0_0_1px_rgba(2,33,53,0.08)] overflow-hidden">

        {/* Header */}
        <div className="bg-[#022135] px-6 py-5 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 text-white">
            <div>
              <p className="text-xl font-semibold tracking-tight">{origin}</p>
              <p className="text-[11px] font-normal opacity-60 tracking-widest">{originCode}</p>
            </div>
            <span className="opacity-40 text-base">✈</span>
            <div>
              <p className="text-xl font-semibold tracking-tight">{destination}</p>
              <p className="text-[11px] font-normal opacity-60 tracking-widest">{destinationCode}</p>
            </div>
          </div>
          <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] text-white font-medium tracking-wide">
            Return
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/60">
          {(['out', 'ret'] as ActiveTab[]).map(tab => {
            const isActive = activeTab === tab
            const dateVal = tab === 'out' ? outDate : retDate
            const label = tab === 'out' ? 'Outbound' : 'Return'
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex flex-col items-center py-3.5 text-sm border-b-2 transition-all duration-150 ${
                  isActive
                    ? 'border-[#022135] bg-white text-[#022135]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-widest opacity-60 mb-0.5">
                  {label}
                </span>
                <span className={`font-semibold text-[15px] ${!dateVal ? 'text-slate-300 font-normal text-[13px]' : ''}`}>
                  {dateVal ? formatDisplay(dateVal) : 'Select date'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Calendar */}
        <div className="px-6 pt-5 pb-6">
          {/* Step hint */}
          {activeTab === 'ret' && outDate && (
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#03989e] bg-[#03989e]/8 rounded-lg px-3 py-2 mb-4">
              <span>↩</span>
              <span>Now pick your return date</span>
            </div>
          )}

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#022135]/5 hover:border-[#022135] hover:text-[#022135] transition-all text-base"
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="text-[15px] font-semibold text-slate-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#022135]/5 hover:border-[#022135] hover:text-[#022135] transition-all text-base"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* Day-of-week labels */}
          <div className="grid grid-cols-7 mb-1.5">
            {DOW_LABELS.map(d => (
              <span key={d} className="text-center text-[11px] font-medium text-slate-400 py-1 tracking-wide">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-[3px]">
            {/* Empty leading cells */}
            {Array.from({ length: startDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {calDays.map(({ day, dateStr }) => {
              const dateObj = new Date(dateStr)
              dateObj.setHours(0, 0, 0, 0)
              const isPast = dateObj < today
              const score: PriceScore = priceData?.[dateStr] ?? (isPast ? 'none' : getHeuristicScore(dateStr))

              const isOutbound = dateStr === outDate
              const isReturn   = dateStr === retDate

              const isInRange = !!(
                outDateObj && retDateObj &&
                dateObj > outDateObj && dateObj < retDateObj
              )
              const isRangeStart = !!(outDateObj && dateObj.getTime() === outDateObj.getTime() + 86_400_000)
              const isRangeEnd   = !!(retDateObj && dateObj.getTime() === retDateObj.getTime() - 86_400_000)

              return (
                <Day
                  key={dateStr}
                  day={day}
                  dateStr={dateStr}
                  score={score}
                  isPast={isPast}
                  isOutbound={isOutbound}
                  isReturn={isReturn}
                  isInRange={isInRange}
                  isRangeStart={isRangeStart}
                  isRangeEnd={isRangeEnd}
                  onClick={handleDayClick}
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Price guide:</span>
            {[
              { color: '#16A34A', label: 'Good deal' },
              { color: '#D97706', label: 'Average' },
              { color: '#DC2626', label: 'Peak pricing' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-4">
          <p className="text-[13px] text-slate-500">
            {!outDate && 'Select your outbound date to begin'}
            {outDate && !retDate && (
              <><strong className="text-slate-800 font-semibold">{formatDisplay(outDate)}</strong> → Select return date</>
            )}
            {outDate && retDate && (
              <>
                <strong className="text-slate-800 font-semibold">{formatDisplay(outDate)}</strong>
                {' → '}
                <strong className="text-slate-800 font-semibold">{formatDisplay(retDate)}</strong>
                {' · '}
                {nights} night{nights !== 1 ? 's' : ''}
              </>
            )}
          </p>
          <button
            onClick={handleSearch}
            disabled={!outDate || !retDate}
            className="bg-[#022135] text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition-all duration-150 whitespace-nowrap hover:bg-[#033150] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(2,33,53,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
          >
            Search flights
          </button>
        </div>

      </div>
    </div>
  )
}