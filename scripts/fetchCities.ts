export async function fetchCities(countryCode: string) {
    const res = await fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.CSC_API_KEY!
        }
      }
    );
  
    return await res.json();
  }
  