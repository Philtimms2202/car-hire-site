'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'

const COUNTRIES: [string, string][] = [
  ['AF','Afghanistan'],['AL','Albania'],['DZ','Algeria'],['AD','Andorra'],['AO','Angola'],
  ['AG','Antigua and Barbuda'],['AR','Argentina'],['AM','Armenia'],['AU','Australia'],
  ['AT','Austria'],['AZ','Azerbaijan'],['BS','Bahamas'],['BH','Bahrain'],['BD','Bangladesh'],
  ['BB','Barbados'],['BY','Belarus'],['BE','Belgium'],['BZ','Belize'],['BJ','Benin'],
  ['BT','Bhutan'],['BO','Bolivia'],['BA','Bosnia and Herzegovina'],['BW','Botswana'],
  ['BR','Brazil'],['BN','Brunei'],['BG','Bulgaria'],['BF','Burkina Faso'],['BI','Burundi'],
  ['CV','Cabo Verde'],['KH','Cambodia'],['CM','Cameroon'],['CA','Canada'],
  ['CF','Central African Republic'],['TD','Chad'],['CL','Chile'],['CN','China'],
  ['CO','Colombia'],['KM','Comoros'],['CG','Congo'],['CD','Congo (DRC)'],['CR','Costa Rica'],
  ['HR','Croatia'],['CU','Cuba'],['CY','Cyprus'],['CZ','Czech Republic'],['DK','Denmark'],
  ['DJ','Djibouti'],['DM','Dominica'],['DO','Dominican Republic'],['EC','Ecuador'],
  ['EG','Egypt'],['SV','El Salvador'],['GQ','Equatorial Guinea'],['ER','Eritrea'],
  ['EE','Estonia'],['SZ','Eswatini'],['ET','Ethiopia'],['FJ','Fiji'],['FI','Finland'],
  ['FR','France'],['GA','Gabon'],['GM','Gambia'],['GE','Georgia'],['DE','Germany'],
  ['GH','Ghana'],['GR','Greece'],['GD','Grenada'],['GT','Guatemala'],['GN','Guinea'],
  ['GW','Guinea-Bissau'],['GY','Guyana'],['HT','Haiti'],['HN','Honduras'],['HU','Hungary'],
  ['IS','Iceland'],['IN','India'],['ID','Indonesia'],['IR','Iran'],['IQ','Iraq'],
  ['IE','Ireland'],['IL','Israel'],['IT','Italy'],['JM','Jamaica'],['JP','Japan'],
  ['JO','Jordan'],['KZ','Kazakhstan'],['KE','Kenya'],['KI','Kiribati'],['KW','Kuwait'],
  ['KG','Kyrgyzstan'],['LA','Laos'],['LV','Latvia'],['LB','Lebanon'],['LS','Lesotho'],
  ['LR','Liberia'],['LY','Libya'],['LI','Liechtenstein'],['LT','Lithuania'],['LU','Luxembourg'],
  ['MG','Madagascar'],['MW','Malawi'],['MY','Malaysia'],['MV','Maldives'],['ML','Mali'],
  ['MT','Malta'],['MH','Marshall Islands'],['MR','Mauritania'],['MU','Mauritius'],
  ['MX','Mexico'],['FM','Micronesia'],['MD','Moldova'],['MC','Monaco'],

const TIMES = Array.from({length: 48}, (_,i) => {
  const h = String(Math.floor(i/2)).padStart(2,'0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

const fmt = (d: Date) => d.toISOString().split('T')[0]

export default function CarSearch() {
  const { language, currency } = useLocale()

  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [diffDropoff, setDiffDropoff] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffDate, setDropoffDate] = useState('')
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [driverAge, setDriverAge] = useState('30')
  const [licenceCountry, setLicenceCountry] = useState('GB')

  useEffect(() => {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
    const returning = new Date(); returning.setDate(returning.getDate() + 4)
    setPickupDate(fmt(tomorrow))
    setDropoffDate(fmt(returning))
  }, [])

  const handlePickupDateChange = (val: string) => {
    setPickupDate(val)
    const d = new Date(val); d.setDate(d.getDate() + 3)
    setDropoffDate(fmt(d))
  }

  const handleSearch = () => {
    if (!pickup) return
    const params = new URLSearchParams({
      pickup_name: pickup,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      dropoff_date: dropoffDate,
      dropoff_time: dropoffTime,
      driver_age: driverAge,
      locale: language,
      curr: currency,
    })
    if (diffDropoff && dropoff) params.set('dropoff_name', dropoff)

    const url = `https://www.trip.com/carhire/?Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094&${params.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <label className="flex items-center gap-2 mb-5 cursor-pointer text-sm text-gray-500">
        <input type="checkbox" checked={diffDropoff} onChange={e => setDiffDropoff(e.target.checked)} />
        Drop off at a different location
      </label>

      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up location</label>
        <input className="input-field w-full" placeholder="Airport, city or station" value={pickup} onChange={e => setPickup(e.target.value)} />
      </div>

      {diffDropoff && (
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off location</label>
          <input className="input-field w-full" placeholder="Airport, city or station" value={dropoff} onChange={e => setDropoff(e.target.value)} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up date</label>
          <input type="date" className="input-field w-full" value={pickupDate} min={fmt(new Date())} onChange={e => handlePickupDateChange(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Pick-up time</label>
          <select className="input-field w-full" value={pickupTime} onChange={e => setPickupTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off date</label>
          <input type="date" className="input-field w-full" value={dropoffDate} min={pickupDate} onChange={e => setDropoffDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Drop-off time</label>
          <select className="input-field w-full" value={dropoffTime} onChange={e => setDropoffTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Driver age</label>
          <select className="input-field w-full" value={driverAge} onChange={e => setDriverAge(e.target.value)}>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="21">21–24</option>
            <option value="25">25–29</option>
            <option value="30">30–65</option>
            <option value="66">66–69</option>
            <option value="70">70+</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Licence country</label>
          <select className="input-field w-full" value={licenceCountry} onChange={e => setLicenceCountry(e.target.value)}>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleSearch} className="btn-primary w-full py-3">
        Search car hire
      </button>
    </div>
  )
}