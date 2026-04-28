'use client'

import { useState, useEffect } from 'react'

const LISTS: Record<string, Record<string, string[]>> = {
  beach: {
    Essentials: ['Passport / ID','Travel insurance docs','Flight tickets','Hotel confirmation','Phone charger','Headphones','Power bank'],
    Clothing: ['Swimwear (x2)','Beach cover-up','Shorts (x3)','T-shirts (x4)','Light dress / shirt','Underwear','Flip flops','Sandals','One smart outfit'],
    Toiletries: ['High SPF suncream','After-sun lotion','Insect repellent','Shampoo & conditioner','Toothbrush & toothpaste','Deodorant','Razor','Lip balm with SPF'],
    Extras: ['Beach bag','Sunglasses','Beach towel','Waterproof phone case','Reusable water bottle','Cash / card'],
  },
  city: {
    Essentials: ['Passport / ID','Travel insurance docs','Flight tickets','Hotel confirmation','Phone charger','Headphones','Power bank'],
    Clothing: ['Comfortable walking shoes','Smart casual outfit','Jeans / trousers (x2)','T-shirts (x3)','Light jacket or jumper','Underwear','Trainers'],
    Toiletries: ['Toothbrush & toothpaste','Shampoo & conditioner','Deodorant','Moisturiser','Razor'],
    Extras: ['Day bag / backpack','Reusable water bottle','Guidebook / offline maps','Cash / card','Umbrella'],
  },
  business: {
    Essentials: ['Passport / ID','Business cards','Laptop & charger','Phone charger','Travel insurance','Flight & hotel docs'],
    Clothing: ['Suit / formal wear','Smart shirts (x3)','Formal shoes','Belt','Casual clothes for evenings','Underwear'],
    Toiletries: ['Toothbrush & toothpaste','Deodorant','Razor / shaver','Cologne / perfume','Moisturiser'],
    Extras: ['Notebook & pen','Power bank','Plug adaptor','Snacks for travel','Headphones'],
  },
  adventure: {
    Essentials: ['Passport / ID','Travel insurance (with medical cover)','Emergency contact list','First aid kit','Phone charger','Torch'],
    Clothing: ['Moisture-wicking base layers','Waterproof jacket','Hiking trousers','Thermal layer','Hiking boots','Thick socks (x4)','Sun hat','Gloves'],
    Toiletries: ['Suncream','Insect repellent','Lip balm','Blister plasters','Toothbrush & toothpaste','Deodorant'],
    Extras: ['Hiking poles','Reusable water bottle','Water purification tablets','Map & compass','Headtorch','Energy bars','Dry bags'],
  },
  winter: {
    Essentials: ['Passport / ID','Travel insurance','Flight & hotel docs','Phone charger','Hand warmers'],
    Clothing: ['Ski jacket','Ski trousers','Thermal base layers (x3)','Ski socks (x4)','Ski gloves','Helmet','Ski goggles','Neck gaiter','Après-ski clothes','Winter boots'],
    Toiletries: ['SPF lip balm','High SPF suncream','Moisturiser','Toothbrush & toothpaste','Deodorant'],
    Extras: ['Ski pass holder','Locker lock','Reusable water bottle','Blister plasters','Snacks'],
  },
}

const CARRY_ON_EXTRAS = ['100ml liquids in clear zip-lock bag','Laptop out of bag at security','Wear bulkiest shoes on the plane','Check airline weight limits before packing']

export default function PackingChecklist() {
  const [tripType, setTripType] = useState('beach')
  const [nights, setNights] = useState(7)
  const [carryOn, setCarryOn] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  useEffect(() => { setChecked(new Set()) }, [tripType, carryOn])

  const list = LISTS[tripType]
  const allItems = [
    ...Object.values(list).flat(),
    ...(carryOn ? CARRY_ON_EXTRAS : []),
  ]
  const total = allItems.length
  const done = checked.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  function toggle(item: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Trip type</label>
          <select value={tripType} onChange={e=>setTripType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]">
            <option value="beach">Beach holiday</option>
            <option value="city">City break</option>
            <option value="business">Business trip</option>
            <option value="adventure">Adventure / hiking</option>
            <option value="winter">Winter / ski</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Duration (nights)</label>
          <input type="number" value={nights} min={1} max={30}
            onChange={e=>setNights(parseInt(e.target.value)||1)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#03989e]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Carry-on only?</label>
          <div className="flex gap-2">
            {[false,true].map(val => (
              <button key={String(val)} onClick={()=>setCarryOn(val)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${carryOn===val ? 'border-[#03989e] text-[#03989e] bg-teal-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{done} of {total} packed ({pct}%)</p>
        <button onClick={()=>setChecked(new Set())}
          className="text-xs text-gray-400 hover:text-gray-600 transition border border-gray-200 px-3 py-1.5 rounded-lg">
          Reset all
        </button>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: '#03989e' }} />
      </div>

      <div className="space-y-5">
        {Object.entries(list).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{cat}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map(item => {
                const isChecked = checked.has(item)
                return (
                  <button key={item} onClick={()=>toggle(item)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition ${
                      isChecked
                        ? 'border-teal-200 bg-teal-50 text-teal-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                    <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition ${
                      isChecked ? 'border-[#03989e] bg-[#03989e]' : 'border-gray-300'
                    }`}>
                      {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {carryOn && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Carry-on tips</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CARRY_ON_EXTRAS.map(item => {
                const isChecked = checked.has(item)
                return (
                  <button key={item} onClick={()=>toggle(item)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition ${
                      isChecked
                        ? 'border-teal-200 bg-teal-50 text-teal-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                    <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition ${
                      isChecked ? 'border-[#03989e] bg-[#03989e]' : 'border-gray-300'
                    }`}>
                      {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {nights > 10 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          For trips over 10 nights, consider doing laundry rather than packing more — you'll travel lighter and have more flexibility.
        </div>
      )}
    </div>
  )
}