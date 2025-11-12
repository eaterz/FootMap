 // Map country names to ISO 3166-1 alpha-2 codes (or ISO 3166-2 for UK subdivisions)
 // This mirrors the mapping used on the leagues page and can be extended as needed.
 export const countryCodeMap: Record<string, string> = {
   'Afghanistan': 'AF', 'Albania': 'AL', 'Algeria': 'DZ', 'Andorra': 'AD', 'Angola': 'AO',
   'Antigua and Barbuda': 'AG', 'Argentina': 'AR', 'Armenia': 'AM', 'Australia': 'AU', 'Austria': 'AT',
   'Azerbaijan': 'AZ', 'Bahamas': 'BS', 'Bahrain': 'BH', 'Bangladesh': 'BD', 'Barbados': 'BB',
   'Belarus': 'BY', 'Belgium': 'BE', 'Belize': 'BZ', 'Benin': 'BJ', 'Bhutan': 'BT',
   'Bolivia': 'BO', 'Bosnia and Herzegovina': 'BA', 'Botswana': 'BW', 'Brazil': 'BR', 'Brunei': 'BN',
   'Bulgaria': 'BG', 'Burkina Faso': 'BF', 'Burundi': 'BI', 'Cambodia': 'KH', 'Cameroon': 'CM',
   'Canada': 'CA', 'Cape Verde': 'CV', 'Central African Republic': 'CF', 'Chad': 'TD', 'Chile': 'CL',
   'China': 'CN', 'Chinese Taipei': 'TW', 'Colombia': 'CO', 'Comoros': 'KM', 'Congo': 'CG',
   'DR Congo': 'CD', 'Costa Rica': 'CR', 'Croatia': 'HR', 'Cuba': 'CU', 'Cyprus': 'CY',
   'Czech Republic': 'CZ', 'Denmark': 'DK', 'Djibouti': 'DJ', 'Dominica': 'DM', 'Dominican Republic': 'DO',
   'Ecuador': 'EC', 'Egypt': 'EG', 'El Salvador': 'SV', 'England': 'GB-ENG', 'Equatorial Guinea': 'GQ',
   'Eritrea': 'ER', 'Estonia': 'EE', 'Eswatini': 'SZ', 'Ethiopia': 'ET', 'Fiji': 'FJ',
   'Finland': 'FI', 'France': 'FR', 'Gabon': 'GA', 'Gambia': 'GM', 'Georgia': 'GE',
   'Germany': 'DE', 'Ghana': 'GH', 'Greece': 'GR', 'Grenada': 'GD', 'Guatemala': 'GT',
   'Guinea': 'GN', 'Guinea-Bissau': 'GW', 'Guyana': 'GY', 'Haiti': 'HT', 'Honduras': 'HN',
   'Hong Kong': 'HK', 'Hungary': 'HU', 'Iceland': 'IS', 'India': 'IN', 'Indonesia': 'ID',
   'Iran': 'IR', 'Iraq': 'IQ', 'Ireland': 'IE', 'Israel': 'IL', 'Italy': 'IT',
   'Ivory Coast': 'CI', 'Jamaica': 'JM', 'Japan': 'JP', 'Jordan': 'JO', 'Kazakhstan': 'KZ',
   'Kenya': 'KE', 'Kuwait': 'KW', 'Kyrgyzstan': 'KG', 'Laos': 'LA', 'Latvia': 'LV',
   'Lebanon': 'LB', 'Lesotho': 'LS', 'Liberia': 'LR', 'Libya': 'LY', 'Liechtenstein': 'LI',
   'Lithuania': 'LT', 'Luxembourg': 'LU', 'Macau': 'MO', 'Madagascar': 'MG', 'Malawi': 'MW',
   'Malaysia': 'MY', 'Maldives': 'MV', 'Mali': 'ML', 'Malta': 'MT', 'Mauritania': 'MR',
   'Mauritius': 'MU', 'Mexico': 'MX', 'Moldova': 'MD', 'Monaco': 'MC', 'Mongolia': 'MN',
   'Montenegro': 'ME', 'Morocco': 'MA', 'Mozambique': 'MZ', 'Myanmar': 'MM', 'Namibia': 'NA',
   'Nepal': 'NP', 'Netherlands': 'NL', 'New Zealand': 'NZ', 'Nicaragua': 'NI', 'Niger': 'NE',
   'Nigeria': 'NG', 'North Korea': 'KP', 'North Macedonia': 'MK', 'Northern Ireland': 'GB-NIR', 'Norway': 'NO',
   'Oman': 'OM', 'Pakistan': 'PK', 'Palestine': 'PS', 'Panama': 'PA', 'Papua New Guinea': 'PG',
   'Paraguay': 'PY', 'Peru': 'PE', 'Philippines': 'PH', 'Poland': 'PL', 'Portugal': 'PT',
   'Puerto Rico': 'PR', 'Qatar': 'QA', 'Romania': 'RO', 'Russia': 'RU', 'Rwanda': 'RW',
   'Saint Kitts and Nevis': 'KN', 'Saint Lucia': 'LC', 'Saint Vincent and the Grenadines': 'VC',
   'Samoa': 'WS', 'San Marino': 'SM', 'São Tomé and Príncipe': 'ST', 'Saudi Arabia': 'SA',
   'Scotland': 'GB-SCT', 'Senegal': 'SN', 'Serbia': 'RS', 'Seychelles': 'SC', 'Sierra Leone': 'SL',
   'Singapore': 'SG', 'Slovakia': 'SK', 'Slovenia': 'SI', 'Solomon Islands': 'SB', 'Somalia': 'SO',
   'South Africa': 'ZA', 'South Korea': 'KR', 'South Sudan': 'SS', 'Spain': 'ES', 'Sri Lanka': 'LK',
   'Sudan': 'SD', 'Suriname': 'SR', 'Sweden': 'SE', 'Switzerland': 'CH', 'Syria': 'SY',
   'Tajikistan': 'TJ', 'Tanzania': 'TZ', 'Thailand': 'TH', 'Timor-Leste': 'TL', 'Togo': 'TG',
   'Tonga': 'TO', 'Trinidad and Tobago': 'TT', 'Tunisia': 'TN', 'Turkey': 'TR', 'Turkmenistan': 'TM',
   'Uganda': 'UG', 'Ukraine': 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB', 'United States': 'US', 'Uruguay': 'UY',
   'Uzbekistan': 'UZ', 'Vanuatu': 'VU', 'Venezuela': 'VE', 'Vietnam': 'VN', 'Wales': 'GB-WLS',
   'Yemen': 'YE', 'Zambia': 'ZM', 'Zimbabwe': 'ZW', 'Anguilla': 'AI', 'Aruba': 'AW',
   'Bermuda': 'BM', 'British Virgin Islands': 'VG', 'Cayman Islands': 'KY', 'Curaçao': 'CW',
   'Faroe Islands': 'FO', 'French Guiana': 'GF', 'Gibraltar': 'GI', 'Guadeloupe': 'GP',
   'Guam': 'GU', 'Kosovo': 'XK', 'Martinique': 'MQ', 'Montserrat': 'MS', 'New Caledonia': 'NC',
   'Sint Maarten': 'SX', 'Tahiti': 'PF', 'Turks and Caicos Islands': 'TC', 'US Virgin Islands': 'VI',
   'American Samoa': 'AS', 'Cook Islands': 'CK'
 };

 // Common aliases and alternate names to improve matching
 const aliases: Record<string, string> = {
   'USA': 'United States',
   'U.S.': 'United States',
   'United States of America': 'United States',
   'UK': 'United Kingdom',
   'Great Britain': 'United Kingdom',
   "Cote d'Ivoire": 'Ivory Coast',
   'Côte d’Ivoire': 'Ivory Coast',
   "Côte d'Ivoire": 'Ivory Coast',
   'Czechia': 'Czech Republic',
   'Republic of Korea': 'South Korea',
   'Korea, Republic of': 'South Korea',
   'Korea Republic': 'South Korea',
   'Democratic Republic of the Congo': 'DR Congo',
   'Democratic Republic of Congo': 'DR Congo',
   'Congo DR': 'DR Congo',
   'Congo (DRC)': 'DR Congo',
   'Congo (Kinshasa)': 'DR Congo',
   'Congo (Brazzaville)': 'Congo',
   'Macao': 'Macau',
   'East Timor': 'Timor-Leste',
   'Burma': 'Myanmar',
   'Swaziland': 'Eswatini'
 };

 export function normalizeCountryName(name: string): string {
   const trimmed = name.trim();
   return aliases[trimmed] ?? trimmed;
 }

 export function getCountryCode(countryName: string): string {
   const key = normalizeCountryName(countryName);
   return countryCodeMap[key] ?? 'XX';
 }

 export function getFlagUrl(countryName: string): string {
   const code = getCountryCode(countryName);
   return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
 }

