export const WHITELABEL_BASE = 'https://flights.timmstravel.com';

export function formatDateDDMM(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}${mm}`;
}

export function daysFromToday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildPassengerCode(adults: number, children: number, infants: number, cabin: string): string {
  let code = '';
  if (cabin === 'business') code += 'c';
  code += String(adults);
  code += String(children);
  code += String(infants);
  return code;
}

export function buildWhitelabelUrl({
  from,
  to,
  depart,
  returnDate,
  adults = 1,
  children = 0,
  infants = 0,
  cabin = 'economy',
}: {
  from: string;
  to: string;
  depart: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabin?: string;
}): string {
  const dep = formatDateDDMM(depart);
  const ret = returnDate ? formatDateDDMM(returnDate) : '';
  const passengerCode = buildPassengerCode(adults, children, infants, cabin);
  const flightSearch = `${from.toUpperCase()}${dep}${to.toUpperCase()}${ret}${passengerCode}`;
  return `${WHITELABEL_BASE}/?flightSearch=${flightSearch}&shmarker=714930&trs=513651`;
}